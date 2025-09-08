import React, { useState, useMemo, useRef } from "react";

function CalendarGrid({ onGoToMyPage = () => {} }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const { firstDayIndex, daysInMonth } = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    return {
      firstDayIndex: first.getDay(),
      daysInMonth: last.getDate(),
    };
  }, [year, month]);

  const [notes, setNotes] = useState({});
  const [selectedTape, setSelectedTape] = useState("gray");
  const [selectedSticker, setSelectedSticker] = useState("a");
  const [calendarBg, setCalendarBg] = useState("#ffffff");
  const [mainBg, setMainBg] = useState(
    'linear-gradient(45deg, rgba(255,193,7,0.3) 0%, rgba(255,87,34,0.4) 25%, rgba(76,175,80,0.3) 50%, rgba(33,150,243,0.4) 75%, rgba(156,39,176,0.3) 100%)'
  );
  const [boardImage, setBoardImage] = useState(null);
  const [attachedItems, setAttachedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDraggingAttached, setIsDraggingAttached] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [editingItems, setEditingItems] = useState(new Set());
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const rotateStartRef = useRef({ angle: 0, centerX: 0, centerY: 0 });
  const [backgroundPhotos, setBackgroundPhotos] = useState([]);
  const [textItems, setTextItems] = useState([]);
  const [selectedText, setSelectedText] = useState(''); // 현재 입력된 텍스트
  const [selectedLang, setSelectedLang] = useState('en'); // 'en' 또는 'ko'
  const [selectedFont, setSelectedFont] = useState('Arial'); // 선택된 폰트
  const [selectedColor, setSelectedColor] = useState('#000000'); // 선택된 색상
  const [selectedSize, setSelectedSize] = useState('16'); // 선택된 크기

  // 엔터키 이벤트 리스너
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        setEditingItems(new Set());
        setSelectedItem(null);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // 공유 함수 - 전체 화면 캡처
  const handleShare = async () => {
    const entireCalendar = document.querySelector('[data-entire-calendar="true"]');
    if (!entireCalendar) return;

    try {
      // 메뉴 상태 저장하고 닫기
      const originalMenu = selectedMenu;
      setSelectedMenu(null);

      // 약간의 지연을 두어 메뉴가 닫힌 후 캡처
      setTimeout(async () => {
        try {
          // 고정 요소들 임시 숨김
          const fixedElements = entireCalendar.querySelectorAll('[style*="position: fixed"]');
          const originalDisplays = [];
          
          fixedElements.forEach((el, index) => {
            originalDisplays[index] = el.style.display;
            el.style.display = 'none';
          });

          // html2canvas 라이브러리 로드
          if (!window.html2canvas) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = () => handleShare();
            document.head.appendChild(script);
            
            // 요소들 복구
            fixedElements.forEach((el, index) => {
              el.style.display = originalDisplays[index] || '';
            });
            // 메뉴 상태 복구
            setSelectedMenu(originalMenu);
            return;
          }

          // 캡처 실행
          const canvas = await window.html2canvas(entireCalendar, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true
          });

          // 요소들 복구
          fixedElements.forEach((el, index) => {
            el.style.display = originalDisplays[index] || '';
          });

          // 메뉴 상태 복구
          setSelectedMenu(originalMenu);

          // 이미지 다운로드/공유
          canvas.toBlob((blob) => {
            if (navigator.share && navigator.canShare({ files: [new File([blob], 'calendar.png', { type: 'image/png' })] })) {
              navigator.share({
                title: `${year}년 ${month + 1}월 캘린더`,
                text: '내 캘린더를 공유합니다',
                files: [new File([blob], 'calendar.png', { type: 'image/png' })]
              });
            } else {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${year}-${String(month + 1).padStart(2, '0')}-calendar.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        } catch (error) {
          // 에러 발생 시에도 요소들 복구
          const fixedElements = entireCalendar.querySelectorAll('[style*="position: fixed"]');
          fixedElements.forEach((el) => {
            el.style.display = '';
          });
          
          // 메뉴 상태 복구
          setSelectedMenu(originalMenu);
          
          alert('캘린더 캡처 중 오류가 발생했습니다.');
          console.error('Share error:', error);
        }
      }, 100); // 100ms 지연

    } catch (error) {
      alert('캘린더 캡처 중 오류가 발생했습니다.');
      console.error('Share error:', error);
    }
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newItem = {
            id: Date.now(),
            type: 'photo',
            value: e.target.result,
            x: 400,
            y: 200,
            rotation: Math.random() * 20 - 10,
            width: 100,
            height: 80
          };
          setAttachedItems(prev => [...prev, newItem]);
          setEditingItems(prev => new Set([...prev, newItem.id]));
          setSelectedItem(newItem.id);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 텍스트 추가 함수
  const handleAddText = () => {
    if (!selectedText.trim()) {
      alert(selectedLang === 'ko' ? '텍스트를 입력해주세요.' : 'Please enter text.');
      return;
    }

    const newTextItem = {
      id: Date.now(),
      type: 'text',
      value: selectedText,
      x: 400,
      y: 200,
      rotation: 0,
      width: 'auto',
      height: 'auto',
      font: selectedFont,
      fontSize: selectedSize,
      color: selectedColor,
      lang: selectedLang
    };

    setAttachedItems(prev => [...prev, newTextItem]);
    setEditingItems(prev => new Set([...prev, newTextItem.id]));
    setSelectedItem(newTextItem.id);
    setSelectedText(''); // 입력창 초기화
  };

  const handleAddNote = (day) => {
    const text = prompt(`${month + 1}월 ${day}일 메모:`);
    if (!text) return;
    setNotes((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), text],
    }));
  };

  const handleEditNote = (day, noteIndex) => {
    const currentNote = notes[day][noteIndex];
    const newText = prompt(`${month + 1}월 ${day}일 메모 수정:`, currentNote);
    if (newText === null) return;
    
    setNotes((prev) => ({
      ...prev,
      [day]: prev[day].map((note, index) => 
        index === noteIndex ? newText : note
      ),
    }));
  };

  const handleDeleteNote = (day, noteIndex) => {
    if (window.confirm('이 메모를 삭제하시겠습니까?')) {
      setNotes((prev) => ({
        ...prev,
        [day]: prev[day].filter((_, index) => index !== noteIndex),
      }));
    }
  };

  const handleGalleryUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMainBg(`url(${e.target.result}) center/cover no-repeat`);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleBoardImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBoardImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDragStart = (e, itemType, itemValue) => {
    setDraggedItem({ type: itemType, value: itemValue });
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleItemClick = (e, itemId) => {
    e.stopPropagation();
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleAttachedItemMouseDown = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const item = attachedItems.find(item => item.id === itemId);
    if (!item) return;

    const calendarRect = document.querySelector('[data-calendar="true"]').getBoundingClientRect();
    const startX = e.clientX - calendarRect.left;
    const startY = e.clientY - calendarRect.top;
    
    setDragOffset({
      x: startX - item.x,
      y: startY - item.y
    });

    setIsDraggingAttached(itemId);
    setSelectedItem(itemId);

    const handleMouseMove = (e) => {
      const calendarRect = document.querySelector('[data-calendar="true"]').getBoundingClientRect();
      const newX = e.clientX - calendarRect.left - dragOffset.x;
      const newY = e.clientY - calendarRect.top - dragOffset.y;

      setAttachedItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, x: Math.max(0, Math.min(newX, calendarRect.width - (item.width || 50))), y: Math.max(0, Math.min(newY, calendarRect.height - (item.height || 50))) }
            : item
        )
      );
    };

    const handleMouseUp = () => {
      setIsDraggingAttached(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e, itemId, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    const item = attachedItems.find(item => item.id === itemId);
    if (!item) return;

    setIsResizing(itemId);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: item.width || 50,
      height: item.height || 50,
      direction
    };

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;
      
      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;

      if (direction === 'se') {
        newWidth = Math.max(20, resizeStartRef.current.width + deltaX);
        newHeight = Math.max(20, resizeStartRef.current.height + deltaY);
      } else if (direction === 'e') {
        newWidth = Math.max(20, resizeStartRef.current.width + deltaX);
      } else if (direction === 's') {
        newHeight = Math.max(20, resizeStartRef.current.height + deltaY);
      }

      setAttachedItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, width: newWidth, height: newHeight }
            : item
        )
      );
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRotateStart = (e, itemId) => {
    e.stopPropagation();
    e.preventDefault();
    
    const item = attachedItems.find(item => item.id === itemId);
    if (!item) return;

    const calendarRect = document.querySelector('[data-calendar="true"]').getBoundingClientRect();
    const centerX = item.x + (item.width || 50) / 2;
    const centerY = item.y + (item.height || 50) / 2;
    
    setIsRotating(itemId);
    rotateStartRef.current = {
      angle: item.rotation || 0,
      centerX: centerX,
      centerY: centerY
    };

    const handleMouseMove = (e) => {
      const mouseX = e.clientX - calendarRect.left;
      const mouseY = e.clientY - calendarRect.top;
      
      const angle = Math.atan2(
        mouseY - rotateStartRef.current.centerY, 
        mouseX - rotateStartRef.current.centerX
      ) * (180 / Math.PI);

      setAttachedItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, rotation: angle }
            : item
        )
      );
    };

    const handleMouseUp = () => {
      setIsRotating(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDragOver = (e) => {
    if (!isDraggingAttached) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e) => {
    if (isDraggingAttached) return;
    
    e.preventDefault();
    if (!draggedItem) return;

    const calendarRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - calendarRect.left;
    const y = e.clientY - calendarRect.top;

    const newItem = {
      id: Date.now(),
      type: draggedItem.type,
      value: draggedItem.value,
      x: x,
      y: y,
      rotation: Math.random() * 20 - 10,
      width: draggedItem.type === 'photo' ? 100 : (draggedItem.type === 'tape' ? 80 : 30),
      height: draggedItem.type === 'photo' ? 80 : (draggedItem.type === 'tape' ? 25 : 30)
    };

    setAttachedItems(prev => [...prev, newItem]);
    setEditingItems(prev => new Set([...prev, newItem.id]));
    setSelectedItem(newItem.id);
    setDraggedItem(null);
  };

  const handleRemoveItem = (e, itemId) => {
    e.stopPropagation();
    setAttachedItems(prev => prev.filter(item => item.id !== itemId));
    setEditingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setSelectedItem(null);
  };

  // 캘린더 그리드 생성
  const leadingBlanks = Array.from({ length: firstDayIndex }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells = [...leadingBlanks, ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  // 스타일 옵션들
  const tapeStyles = {
    gray: '/image/tape/tape01.png', 
    pink: '/image/tape/tape02.png', 
    blue: '/image/tape/tape03.png', 
    yellow: '/image/tape/tape04.png', 
    green: '/image/tape/tape05.png', 
    brown: '/image/tape/tape06.png', 
  };

  const stickerEmojis = {
    a: '/image/sticker/01.png', 
    b: '/image/sticker/02.png',
    c: '/image/sticker/03.png',
    d: '/image/sticker/04.png',
    e: '/image/sticker/05.png',
    f: '/image/sticker/06.png',
    g: '/image/sticker/07.png',
    h: '/image/sticker/08.png',
    i: '/image/sticker/09.png',
    j: '/image/sticker/10.png',
    k: '/image/sticker/11.png',
    l: '/image/sticker/12.png'
  };

  // 폰트 옵션들
  const fontOptions = {
    en: ['Arial', 'Times New Roman','Verdana', 'Comic Sans MS', 'Nanum Pen Script'],
  };

  return (
    <div 
      data-entire-calendar="true"
      style={{
        minHeight: '100vh',
        background: mainBg,
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
      onClick={() => {
        setSelectedItem(null);
      }}
    >
      {/* 좌측 버튼들 */}
      <div style={{
        position: 'fixed',
        left: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={handleShare}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#666',
            transition: 'all 0.3s ease'
          }}
        >
          📤
        </button>

        <button
          onClick={handlePhotoUpload}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#666',
            transition: 'all 0.3s ease'
          }}
        >
          📷
        </button>

        <button
          onClick={onGoToMyPage}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#666',
            transition: 'all 0.3s ease'
          }}
        >
          👤
        </button>
      </div>

      {/* 메인 캘린더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px'
      }}>
        <div 
          data-calendar="true"
          style={{
            width: 'min(800px, 90vw)',
            height: '650px',
            background: calendarBg,
            position: 'relative',
            padding: '20px 80px 120px',
            overflow: 'hidden'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* 드래그로 추가된 아이템들 */}
          {attachedItems.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: `rotate(${item.rotation}deg)`,
                zIndex: isDraggingAttached === item.id ? 20 : 15,
                cursor: isDraggingAttached === item.id ? 'grabbing' : 'grab',
                userSelect: 'none',
                border: editingItems.has(item.id) ? '2px dashed #3b82f6' : 'none',
                borderRadius: '4px'
              }}
              onClick={(e) => handleItemClick(e, item.id)}
              onMouseDown={(e) => handleAttachedItemMouseDown(e, item.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleRemoveItem(e, item.id);
              }}
            >
              {item.type === 'text' && (
                <div style={{
                  fontFamily: item.font || 'Arial',
                  fontSize: `${item.fontSize || 16}px`,
                  color: item.color || '#000000',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  fontWeight: item.lang === 'ko' ? 'normal' : 'normal',
                  transformOrigin: 'center center',
                  display: 'inline-block'
                }}>
                  {item.value}
                </div>
              )}
              {item.type === 'sticker' && (
                <div style={{
                  width: `${item.width || 30}px`,
                  height: `${item.width || 30}px`,
                  backgroundImage: `url(${stickerEmojis[item.value]})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  pointerEvents: 'none'
                }} />
              )}
              {item.type === 'tape' && (
                <div style={{
                  width: `${item.width || 80}px`,
                  height: `${item.height || 25}px`,
                  backgroundImage: `url(${tapeStyles[item.value]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '2px',
                  pointerEvents: 'none'
                }} />
              )}
              {item.type === 'shadow' && (
                <div style={{
                  width: `${item.width || 100}px`,
                  height: `${item.height || 100}px`,
                  backgroundImage: `url(${item.value})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  pointerEvents: 'none'
                }} />
              )}
              
              {/* 편집 컨트롤들 */}
              {editingItems.has(item.id) && (
                <>
                  {/* 우하단 리사이즈 핸들 (대각선) */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'se')}
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      right: '-10px',
                      width: '12px',
                      height: '12px',
                      background: '#3b82f6',
                      borderRadius: '50%',
                      cursor: 'se-resize',
                      border: '2px solid white',
                      zIndex: 30
                    }}
                  />
                  
                  {/* 우측 가로 리사이즈 핸들 */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'e')}
                    style={{
                      position: 'absolute',
                      right: '-8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '8px',
                      height: '12px',
                      background: '#8b5cf6',
                      borderRadius: '2px',
                      cursor: 'e-resize',
                      border: '1px solid white',
                      zIndex: 30
                    }}
                  />
                  
                  {/* 하단 세로 리사이즈 핸들 */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, item.id, 's')}
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '8px',
                      background: '#8b5cf6',
                      borderRadius: '2px',
                      cursor: 's-resize',
                      border: '1px solid white',
                      zIndex: 30
                    }}
                  />
                  
                  {/* 회전 핸들 */}
                  <div
                    onMouseDown={(e) => handleRotateStart(e, item.id)}
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '50%',
                      transform: 'translateX(50%)',
                      width: '12px',
                      height: '12px',
                      background: '#10b981',
                      borderRadius: '50%',
                      cursor: 'grab',
                      border: '2px solid white',
                      zIndex: 30
                    }}
                  />
                  
                  {/* 삭제 버튼 */}
                  <div
                    onClick={(e) => handleRemoveItem(e, item.id)}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '-12px',
                      width: '18px',
                      height: '18px',
                      background: '#ef4444',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: 'white',
                      fontWeight: 'bold',
                      paddingBottom: '2px',
                      boxSizing: 'border-box',
                      zIndex: 30
                    }}
                  >
                    ×
                  </div>
                </>
              )}
            </div>
          ))}

          {/* 월 표시 */}
          <div style={{
            fontSize: '120px',
            fontWeight: '300',
            color: '#ddd',
            lineHeight: '0.8',
            marginBottom: '40px',
            fontFamily: 'Georgia, serif'
          }}>
            {String(month + 1).padStart(2, '0')}
          </div>

          {/* 요일 헤더 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            marginBottom: '10px',
            borderBottom: '2px solid #333',
            paddingBottom: '8px'
          }}>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div key={day} style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#666',
                textAlign: 'left',
                padding: '0 8px'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* 캘린더 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridAutoRows: '1fr',
            gap: '1px',
            border: '1px solid black',
            background: '#f0f0f0'
          }}>
            {cells.map((day, index) => (
              <div key={index} style={{
                background: '#fff',
                position: 'relative',
                padding: '8px',
                cursor: day ? 'pointer' : 'default',
                aspectRatio: '1 / 1',
              }}>
                {day && (
                  <>
                    <div 
                      onClick={() => handleAddNote(day)}
                      style={{
                        fontSize: '14px',
                        color: '#333',
                        fontWeight: '400'
                      }}
                    >
                      {day}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      {(notes[day] || []).map((text, noteIndex) => (
                        <div 
                          key={noteIndex} 
                          style={{
                            fontSize: '10px',
                            color: '#666',
                            background: '#f8f9fa',
                            padding: '2px 4px',
                            marginBottom: '2px',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            wordBreak: 'break-word'
                          }}
                          onClick={() => handleEditNote(day, noteIndex)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            handleDeleteNote(day, noteIndex);
                          }}
                        >
                          {text}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 메뉴 바 */}
      <div style={{
        position: 'fixed',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '30px',
        background: 'rgba(255,255,255,0.95)',
        padding: '15px 30px',
        borderRadius: '50px',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}>
        {/* 테이프 메뉴 */}
        <button
          onClick={() => setSelectedMenu(selectedMenu === 'tape' ? null : 'tape')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px',
            borderRadius: '15px',
            cursor: 'pointer',
            backgroundColor: selectedMenu === 'tape' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '50px',
            height: '15px',
            backgroundImage: `url(${tapeStyles.gray})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '2px',
            transform: 'rotate(-8deg)'
          }} />
        </button>

        {/* 스티커 메뉴 */}
        <button
          onClick={() => setSelectedMenu(selectedMenu === 'sticker' ? null : 'sticker')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px',
            borderRadius: '15px',
            cursor: 'pointer',
            backgroundColor: selectedMenu === 'sticker' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '35px',
            height: '35px',
            backgroundImage: `url(${stickerEmojis.a})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
        </button>

        {/* 텍스트 메뉴 */}
        <button
          onClick={() => setSelectedMenu(selectedMenu === 'text' ? null : 'text')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px',
            borderRadius: '15px',
            cursor: 'pointer',
            backgroundColor: selectedMenu === 'text' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '35px',
            height: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#666'
          }}>
            Aa
          </div>
        </button>

        {/* 캘린더 배경 메뉴 */}
        <button
          onClick={() => setSelectedMenu(selectedMenu === 'calendarBg' ? null : 'calendarBg')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px',
            borderRadius: '15px',
            cursor: 'pointer',
            backgroundColor: selectedMenu === 'calendarBg' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '35px',
            height: '25px',
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '3px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              right: '4px',
              height: '1px',
              background: '#dee2e6'
            }} />
            <div style={{
              position: 'absolute',
              top: '7px',
              left: '4px',
              right: '4px',
              height: '1px',
              background: '#dee2e6'
            }} />
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '4px',
              right: '4px',
              height: '1px',
              background: '#dee2e6'
            }} />
          </div>
        </button>

        {/* 배경사진 메뉴 */}
        <button
          onClick={() => setSelectedMenu(selectedMenu === 'mainBg' ? null : 'mainBg')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px',
            borderRadius: '15px',
            cursor: 'pointer',
            backgroundColor: selectedMenu === 'mainBg' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '35px',
            height: '25px',
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '3px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.8)'
            }} />
          </div>
        </button>
      </div>

      {/* 서브 메뉴 */}
      {selectedMenu && (
        <div style={{
          position: 'fixed',
          bottom: selectedMenu === 'text' ? '200px' : '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: selectedMenu === 'text' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)',
          padding: '20px 30px',
          borderRadius: '30px',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          maxWidth: '80vw',
          overflowX: 'auto',
          position: 'relative',
          width : '40vw',
        }}>
          
          {selectedMenu === 'text' && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '15px', 
              alignItems: 'center',
              bottom: '100px',
              background: 'transparent',
              }}>

              {/* 텍스트 입력 */}
              <input
                type="text"
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder={selectedLang === 'ko' ? '텍스트를 입력하세요' : 'Enter text'}
                style={{
                  padding: '10px 15px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  fontSize: '16px',
                  width: '200px',
                  outline: 'none'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddText();
                  }
                }}
              />

              {/* 폰트, 크기, 색상 선택 */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '2px solid #d1d5db',
                    fontSize: '14px'
                  }}
                >
                  {fontOptions[selectedLang].map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>

                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '2px solid #d1d5db',
                    fontSize: '14px'
                  }}
                >
                  <option value="12">12px</option>
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                  <option value="30">30px</option>
                  <option value="36">36px</option>
                </select>

                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{
                    width: '40px',
                    height: '32px',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* 추가 버튼 */}
              <button
                onClick={handleAddText}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#3b82f6',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                {selectedLang === 'ko' ? '텍스트 추가' : 'Add Text'}
              </button>
            </div>
          )}

          {selectedMenu === 'tape' && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {Object.entries(tapeStyles).map(([key, imagePath]) => (
                <div
                  key={key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'tape', key)}
                  onClick={() => setSelectedTape(key)}
                  style={{
                    width: '60px',
                    height: '20px',
                    backgroundImage: `url(${imagePath})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    
                    borderRadius: '2px',
                    cursor: 'grab',
                    transform: 'rotate(-8deg)',
                    transition: 'all 0.2s ease',
                    border: selectedTape === key ? '1px solid #ccc' : '1px solid rgba(0,0,0,0.0)'
                  }}
                />
              ))}
            </div>
          )}

          {selectedMenu === 'sticker' && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {Object.entries(stickerEmojis).map(([key, imagePath]) => (
                <div
                  key={key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'sticker', key)}
                  onClick={() => setSelectedSticker(key)}
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundImage: `url(${imagePath})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    cursor: 'grab',
                    transition: 'all 0.2s ease',
                    border: selectedSticker === key ? '2px solid #3b82f6' : '2px solid transparent',
                    borderRadius: '8px',
                    padding: '4px'
                  }}
                />
              ))}
            </div>
          )}

          {selectedMenu === 'calendarBg' && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button
                onClick={() => setCalendarBg('#ffffff')}
                style={{
                  width: '40px',
                  height: '30px',
                  background: '#ffffff',
                  border: calendarBg === '#ffffff' ? '2px solid #3b82f6' : '2px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
              <button
                onClick={() => setCalendarBg('#faf8f1')}
                style={{
                  width: '40px',
                  height: '30px',
                  background: '#faf8f1',
                  border: calendarBg === '#faf8f1' ? '2px solid #3b82f6' : '2px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
              <button
                onClick={() => setCalendarBg('#fdf2f8')}
                style={{
                  width: '40px',
                  height: '30px',
                  background: '#fdf2f8',
                  border: calendarBg === '#fdf2f8' ? '2px solid #3b82f6' : '2px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
              <button
                onClick={() => setCalendarBg('#f0f9ff')}
                style={{
                  width: '40px',
                  height: '30px',
                  background: '#f0f9ff',
                  border: calendarBg === '#f0f9ff' ? '2px solid #3b82f6' : '2px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
            </div>
          )}

          {selectedMenu === 'mainBg' && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button
                onClick={handleGalleryUpload}
                style={{
                  width: '40px',
                  height: '30px',
                  background: 'white',
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}
              >
                +
              </button>
              <button
                onClick={() => setMainBg('linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)')}
                style={{
                  width: '40px',
                  height: '30px',
                  background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
              <button
                onClick={() => setMainBg('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')}
                style={{
                  width: '40px',
                  height: '30px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
              <button
                onClick={() => setMainBg('linear-gradient(45deg, rgba(255,193,7,0.3) 0%, rgba(255,87,34,0.4) 25%, rgba(76,175,80,0.3) 50%, rgba(33,150,243,0.4) 75%, rgba(156,39,176,0.3) 100%)')}
                style={{
                  width: '40px',
                  height: '30px',
                  background: 'linear-gradient(45deg, rgba(255,193,7,0.3) 0%, rgba(255,87,34,0.4) 25%, rgba(76,175,80,0.3) 50%, rgba(33,150,243,0.4) 75%, rgba(156,39,176,0.3) 100%)',
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 도움말 텍스트 */}
      {editingItems.size > 0 && (
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 1001
        }}>
          파란점: 전체크기 | 보라점: 가로/세로 | 초록점: 회전 | 빨간점: 삭제 | Enter: 편집종료
        </div>
      )}
    </div>
  );
}

export default CalendarGrid;
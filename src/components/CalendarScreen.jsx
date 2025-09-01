import React, { useState, useMemo } from "react";

function CalendarScreen({ onGoToMyPage }) {
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

  // 공유 함수
  const handleShare = async () => {
    const calendarElement = document.querySelector('[data-calendar="true"]');
    if (!calendarElement) return;

    try {
      // html2canvas를 동적으로 로드
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => handleShare();
        document.head.appendChild(script);
        return;
      }

      const canvas = await window.html2canvas(calendarElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });

      canvas.toBlob((blob) => {
        if (navigator.share && navigator.canShare({ files: [new File([blob], 'calendar.png', { type: 'image/png' })] })) {
          // 모바일 네이티브 공유
          navigator.share({
            title: `${year}년 ${month + 1}월 캘린더`,
            text: '내 캘린더를 공유합니다',
            files: [new File([blob], 'calendar.png', { type: 'image/png' })]
          });
        } else {
          // 데스크톱 다운로드
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
      alert('캘린더 캡처 중 오류가 발생했습니다.');
      console.error('Share error:', error);
    }
  };

  // 메모 관련 함수들
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

  // 이미지 업로드 함수들
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

  // 드래그 앤 드롭 함수들
  const handleDragStart = (e, itemType, itemValue) => {
    setDraggedItem({ type: itemType, value: itemValue });
    e.dataTransfer.effectAllowed = 'copy';
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
    
    setIsDraggingAttached(itemId);

    const handleMouseMove = (e) => {
      const calendarRect = document.querySelector('[data-calendar="true"]').getBoundingClientRect();
      const newX = e.clientX - calendarRect.left - dragOffset.x;
      const newY = e.clientY - calendarRect.top - dragOffset.y;

      setAttachedItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, x: Math.max(0, Math.min(newX, calendarRect.width - 50)), y: Math.max(0, Math.min(newY, calendarRect.height - 50)) }
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
      rotation: Math.random() * 20 - 10
    };

    setAttachedItems(prev => [...prev, newItem]);
    setDraggedItem(null);
  };

  const handleRemoveItem = (e, itemId) => {
    e.stopPropagation();
    setAttachedItems(prev => prev.filter(item => item.id !== itemId));
  };

  // 캘린더 그리드 생성
  const leadingBlanks = Array.from({ length: firstDayIndex }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells = [...leadingBlanks, ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  // 스타일 옵션들
  const tapeStyles = {
    gray: 'linear-gradient(135deg, rgba(200,200,200,0.9), rgba(150,150,150,0.9))',
    pink: 'linear-gradient(135deg, rgba(255,105,97,0.9), rgba(255,75,85,0.9))',
    blue: 'linear-gradient(135deg, rgba(74,144,226,0.9), rgba(56,103,214,0.9))',
    yellow: 'linear-gradient(135deg, rgba(255,206,84,0.9), rgba(255,179,71,0.9))',
    green: 'linear-gradient(135deg, rgba(129,199,132,0.9), rgba(102,187,106,0.9))',
    brown: 'linear-gradient(135deg, rgba(141,110,99,0.9), rgba(109,76,65,0.9))'
  };

  const stickerTypes = {
    a: '/image/01.png',
    b: '/image/02.png',
    c: '/image/03.png',
    d: '/image/04.png',
    e: '/image/05.png',
    f: '/image/06.png',
    g: '/image/07.png',
    h: '/image/08.png',
    i: '/image/09.png',
    j: '/image/10.png',
    k: '/image/11.png',
    l: '/image/12.png'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: mainBg,
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
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
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          📤
        </button>

        <button
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
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          +
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
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
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
            height: '580px',
            background: calendarBg,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            position: 'relative',
            padding: '60px 50px 40px',
            overflow: 'hidden'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* 우상단 테이프 */}
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '80px',
            width: '140px',
            height: '40px',
            background: tapeStyles[selectedTape],
            
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 10
          }} />

          {/* 우상단 보드 이미지 */}
          <div 
            onClick={handleBoardImageUpload}
            style={{
              position: 'absolute',
              top: '50px',
              right: '60px',
              width: '160px',
              height: '100px',
              background: boardImage ? `url(${boardImage}) center/cover` : 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transform: 'rotate(-8deg)',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '12px'
            }}
          >
            {!boardImage && '이미지 추가'}
          </div>

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
                userSelect: 'none'
              }}
              onMouseDown={(e) => handleAttachedItemMouseDown(e, item.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleRemoveItem(e, item.id);
              }}
            >
              {item.type === 'sticker' && (
                <img 
                  src={stickerTypes[item.value]} 
                  alt={item.value}
                  style={{ 
                    width: '30px', 
                    height: '30px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    pointerEvents: 'none'
                  }}
                />
              )}
              {item.type === 'tape' && (
                <div style={{
                  width: '80px',
                  height: '25px',
                  background: tapeStyles[item.value],
                  borderRadius: '2px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  pointerEvents: 'none'
                }} />
              )}
            </div>
          ))}

          {/* 월 표시 */}
          <div style={{
            fontSize: '120px',
            fontWeight: '300',
            color: '#ddd',
            lineHeight: '0.8',
            marginBottom: '30px',
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
            gridTemplateRows: 'repeat(6, 1fr)',
            height: '300px',
            gap: '1px',
            background: '#f0f0f0'
          }}>
            {cells.map((day, index) => (
              <div key={index} style={{
                background: '#fff',
                position: 'relative',
                padding: '8px',
                cursor: day ? 'pointer' : 'default'
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
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
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
            background: tapeStyles.gray,
            borderRadius: '2px',
            transform: 'rotate(-8deg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }} />
        </button>

        {/* 나비 스티커 메뉴 */}
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
            fontSize: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🦋
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
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.95)',
          padding: '20px 30px',
          borderRadius: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: 999
        }}>
          
          {selectedMenu === 'tape' && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {Object.entries(tapeStyles).map(([key, style]) => (
                <div
                  key={key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'tape', key)}
                  onClick={() => setSelectedTape(key)}
                  style={{
                    width: '60px',
                    height: '20px',
                    background: style,
                    borderRadius: '2px',
                    cursor: 'grab',
                    boxShadow: selectedTape === key ? '0 4px 12px rgba(59,130,246,0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
                    transform: 'rotate(-8deg)',
                    transition: 'all 0.2s ease',
                    border: selectedTape === key ? '2px solid #3b82f6' : '1px solid rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'rotate(-8deg) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'rotate(-8deg) scale(1)';
                  }}
                />
              ))}
            </div>
          )}

          {selectedMenu === 'sticker' && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {Object.entries(stickerTypes).map(([key, src]) => (
                <img
                  key={key}
                  src={src}
                  alt={key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'sticker', key)}
                  onClick={() => setSelectedSticker(key)}
                  style={{
                    width: '35px',
                    height: '35px',
                    cursor: 'grab',
                    transition: 'all 0.2s ease',
                    border: selectedSticker === key ? '2px solid #3b82f6' : '2px solid transparent',
                    borderRadius: '8px',
                    padding: '2px',
                    boxShadow: selectedSticker === key ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
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
                  cursor: 'pointer',
                  boxShadow: calendarBg === '#ffffff' ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'
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
                  cursor: 'pointer',
                  boxShadow: calendarBg === '#faf8f1' ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'
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
                  cursor: 'pointer',
                  boxShadow: calendarBg === '#fdf2f8' ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'
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
                  cursor: 'pointer',
                  boxShadow: calendarBg === '#f0f9ff' ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'
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
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
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
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
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
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
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
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarScreen;
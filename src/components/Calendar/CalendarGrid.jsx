import React, { useState, useMemo, useRef } from "react";
import Calendar from "./Calendar";
import SideButtons from "./SideButtons";
import MainMenu from "./MainMenu";
import SubMenu from "./SubMenu";
import AttachedItem from "./AttachedItem";
import "../style/CalendarGrid.scss";

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

  // State 관리
  const [notes, setNotes] = useState({});
  const [selectedTape, setSelectedTape] = useState("gray");
  const [selectedSticker, setSelectedSticker] = useState("a");
  const [calendarBg, setCalendarBg] = useState("#ffffff");
  const [mainBg, setMainBg] = useState(
    'linear-gradient(45deg, rgba(255,193,7,0.3) 0%, rgba(255,87,34,0.4) 25%, rgba(76,175,80,0.3) 50%, rgba(33,150,243,0.4) 75%, rgba(156,39,176,0.3) 100%)'
  );
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
  const [selectedText, setSelectedText] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState('16');

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

  // 공유 함수
  const handleShare = async () => {
    const entireCalendar = document.querySelector('[data-entire-calendar="true"]');
    if (!entireCalendar) return;

    try {
      const originalMenu = selectedMenu;
      setSelectedMenu(null);

      setTimeout(async () => {
        try {
          // 좌측 버튼과 메뉴들을 직접 선택해서 숨김
          const sideButtons = document.querySelector('.side-buttons');
          const mainMenu = document.querySelector('.main-menu');
          const subMenu = document.querySelector('.sub-menu');
          const helpText = document.querySelector('.help-text');
          
          const elementsToHide = [sideButtons, mainMenu, subMenu, helpText].filter(Boolean);
          const originalDisplays = elementsToHide.map(el => el.style.display);
          
          elementsToHide.forEach(el => {
            el.style.display = 'none';
          });

          if (!window.html2canvas) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = () => handleShare();
            document.head.appendChild(script);
            
            // 요소들 복구
            elementsToHide.forEach((el, index) => {
              el.style.display = originalDisplays[index] || '';
            });
            setSelectedMenu(originalMenu);
            return;
          }

          const canvas = await window.html2canvas(entireCalendar, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true
          });

          // 요소들 복구
          elementsToHide.forEach((el, index) => {
            el.style.display = originalDisplays[index] || '';
          });

          setSelectedMenu(originalMenu);

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
          const sideButtons = document.querySelector('.side-buttons');
          const mainMenu = document.querySelector('.main-menu');
          const subMenu = document.querySelector('.sub-menu');
          const helpText = document.querySelector('.help-text');
          
          [sideButtons, mainMenu, subMenu, helpText].filter(Boolean).forEach(el => {
            el.style.display = '';
          });
          
          setSelectedMenu(originalMenu);
          alert('캘린더 캡처 중 오류가 발생했습니다.');
          console.error('Share error:', error);
        }
      }, 100);

    } catch (error) {
      alert('캘린더 캡처 중 오류가 발생했습니다.');
      console.error('Share error:', error);
    }
  };

  // 파일 업로드 및 추가 함수들
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
    setSelectedText('');
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

  // 드래그 관련 함수들
  const handleDragStart = (e, itemType, itemValue) => {
    setDraggedItem({ type: itemType, value: itemValue });
    e.dataTransfer.effectAllowed = 'copy';
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

  return (
    <div 
      className="calendar-container"
      data-entire-calendar="true"
      style={{ background: mainBg }}
      onClick={() => setSelectedItem(null)}
    >
      <SideButtons 
        onShare={handleShare}
        onPhotoUpload={handlePhotoUpload}
        onGoToMyPage={onGoToMyPage}
      />

      <div className="calendar-wrapper">
        <Calendar
          year={year}
          month={month}
          firstDayIndex={firstDayIndex}
          daysInMonth={daysInMonth}
          notes={notes}
          setNotes={setNotes}
          calendarBg={calendarBg}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {attachedItems.map((item) => (
            <AttachedItem
              key={item.id}
              item={item}
              isDragging={isDraggingAttached === item.id}
              isSelected={selectedItem === item.id}
              isEditing={editingItems.has(item.id)}
              onSelect={setSelectedItem}
              onUpdate={setAttachedItems}
              onRemove={(itemId) => {
                setAttachedItems(prev => prev.filter(item => item.id !== itemId));
                setEditingItems(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(itemId);
                  return newSet;
                });
                setSelectedItem(null);
              }}
              setIsDragging={setIsDraggingAttached}
              setIsResizing={setIsResizing}
              setIsRotating={setIsRotating}
              resizeStartRef={resizeStartRef}
              rotateStartRef={rotateStartRef}
            />
          ))}
        </Calendar>
      </div>

      <MainMenu
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
      />

      <SubMenu
        selectedMenu={selectedMenu}
        selectedTape={selectedTape}
        setSelectedTape={setSelectedTape}
        selectedSticker={selectedSticker}
        setSelectedSticker={setSelectedSticker}
        selectedText={selectedText}
        setSelectedText={setSelectedText}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        calendarBg={calendarBg}
        setCalendarBg={setCalendarBg}
        onDragStart={handleDragStart}
        onAddText={handleAddText}
        onGalleryUpload={handleGalleryUpload}
        setMainBg={setMainBg}
      />

      {editingItems.size > 0 && (
        <div className="help-text">
          파란점: 전체크기 | 보라점: 가로/세로 | 초록점: 회전 | 빨간점: 삭제 | Enter: 편집종료
        </div>
      )}
    </div>
  );
}

export default CalendarGrid;
import React from "react";
import "../style/AttachedItem.scss";

function AttachedItem({
  item,
  isDragging,
  isSelected,
  isEditing,
  onSelect,
  onUpdate,
  onRemove,
  setIsDragging,
  setIsResizing,
  setIsRotating,
  resizeStartRef,
  rotateStartRef
}) {
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

  const handleItemClick = (e) => {
    e.stopPropagation();
    onSelect(isSelected ? null : item.id);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const calendarRect = document.querySelector('[data-calendar="true"]').getBoundingClientRect();
    
    // 드래그 오프셋을 즉시 계산
    const offsetX = e.clientX - calendarRect.left - item.x;
    const offsetY = e.clientY - calendarRect.top - item.y;

    setIsDragging(item.id);
    onSelect(item.id);

    const handleMouseMove = (e) => {
      const currentCalendarRect = document.querySelector('[data-calendar="true"]').getBoundingClientRect();
      const newX = e.clientX - currentCalendarRect.left - offsetX;
      const newY = e.clientY - currentCalendarRect.top - offsetY;

      onUpdate(prev => 
        prev.map(prevItem => 
          prevItem.id === item.id 
            ? { 
                ...prevItem, 
                x: Math.max(0, Math.min(newX, currentCalendarRect.width - (prevItem.width || 50))), 
                y: Math.max(0, Math.min(newY, currentCalendarRect.height - (prevItem.height || 50))) 
              }
            : prevItem
        )
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(item.id);
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

      onUpdate(prev => 
        prev.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, width: newWidth, height: newHeight }
            : prevItem
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

  const handleRotateStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const calendarRect = document.querySelector('[data-calendar="true"]').getBoundingClientRect();
    const centerX = item.x + (item.width || 50) / 2;
    const centerY = item.y + (item.height || 50) / 2;
    
    setIsRotating(item.id);
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

      onUpdate(prev => 
        prev.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, rotation: angle }
            : prevItem
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

  const handleRemoveItem = (e) => {
    e.stopPropagation();
    onRemove(item.id);
  };

  return (
    <div
      className={`attached-item ${isDragging ? 'dragging' : ''} ${isEditing ? 'editing' : ''}`}
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        transform: `rotate(${item.rotation}deg)`,
        zIndex: isDragging ? 20 : 15
      }}
      onClick={handleItemClick}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => {
        e.preventDefault();
        handleRemoveItem(e);
      }}
    >
      {item.type === 'text' && (
        <div
          className="text-content"
          style={{
            fontFamily: item.font || 'Arial',
            fontSize: `${item.fontSize || 16}px`,
            color: item.color || '#000000',
            fontWeight: item.lang === 'ko' ? 'normal' : 'normal',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          {item.value}
        </div>
      )}

      {item.type === 'sticker' && (
        <div
          className="sticker-content"
          style={{
            width: `${item.width || 30}px`,
            height: `${item.width || 30}px`,
            backgroundImage: `url(${stickerEmojis[item.value]})`
          }}
        />
      )}

      {item.type === 'tape' && (
        <div
          className="tape-content"
          style={{
            width: `${item.width || 80}px`,
            height: `${item.height || 25}px`,
            backgroundImage: `url(${tapeStyles[item.value]})`
          }}
        />
      )}

      {item.type === 'photo' && (
        <div
          className="photo-content"
          style={{
            width: `${item.width || 100}px`,
            height: `${item.height || 100}px`,
            backgroundImage: `url(${item.value})`
          }}
        />
      )}

      {isEditing && (
        <div className="edit-controls">
          {/* 우하단 리사이즈 핸들 (대각선) */}
          <div
            className="resize-handle se-handle"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          
          {/* 우측 가로 리사이즈 핸들 */}
          <div
            className="resize-handle e-handle"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          
          {/* 하단 세로 리사이즈 핸들 */}
          <div
            className="resize-handle s-handle"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          
          {/* 회전 핸들 */}
          <div
            className="rotate-handle"
            onMouseDown={handleRotateStart}
          />
          
          {/* 삭제 버튼 */}
          <div
            className="delete-button"
            onClick={handleRemoveItem}
          >
            ×
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachedItem;
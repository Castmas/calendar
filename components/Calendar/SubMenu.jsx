import React from "react";
import "../style/SubMenu.scss";

function SubMenu({
  selectedMenu,
  selectedTape,
  setSelectedTape,
  selectedSticker,
  setSelectedSticker,
  selectedText,
  setSelectedText,
  selectedLang,
  setSelectedLang,
  selectedFont,
  setSelectedFont,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  calendarBg,
  setCalendarBg,
  onDragStart,
  onAddText,
  onGalleryUpload,
  setMainBg
}) {
  if (!selectedMenu) return null;

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

  const fontOptions = {
    en: ['Arial', 'Times New Roman','Verdana', 'Comic Sans MS', 'Nanum Pen Script'],
  };

  return (
    <div className={`sub-menu ${selectedMenu === 'text' ? 'text-menu' : ''}`}>
      
      {selectedMenu === 'text' && (
        <div className="text-controls">
          <input
            type="text"
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            placeholder={selectedLang === 'ko' ? '텍스트를 입력하세요' : 'Enter text'}
            className="text-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onAddText();
              }
            }}
          />

          <div className="text-options">
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="font-select"
            >
              {fontOptions[selectedLang].map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="size-select"
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
              className="color-input"
            />
          </div>

          <button
            onClick={onAddText}
            className="add-text-button"
          >
            {selectedLang === 'ko' ? '텍스트 추가' : 'Add Text'}
          </button>
        </div>
      )}

      {selectedMenu === 'tape' && (
        <div className="tape-options">
          {Object.entries(tapeStyles).map(([key, imagePath]) => (
            <div
              key={key}
              className={`tape-option ${selectedTape === key ? 'selected' : ''}`}
              draggable
              onDragStart={(e) => onDragStart(e, 'tape', key)}
              onClick={() => setSelectedTape(key)}
              style={{
                backgroundImage: `url(${imagePath})`
              }}
            />
          ))}
        </div>
      )}

      {selectedMenu === 'sticker' && (
        <div className="sticker-options">
          {Object.entries(stickerEmojis).map(([key, imagePath]) => (
            <div
              key={key}
              className={`sticker-option ${selectedSticker === key ? 'selected' : ''}`}
              draggable
              onDragStart={(e) => onDragStart(e, 'sticker', key)}
              onClick={() => setSelectedSticker(key)}
              style={{
                backgroundImage: `url(${imagePath})`
              }}
            />
          ))}
        </div>
      )}

      {selectedMenu === 'calendarBg' && (
        <div className="calendar-bg-options">
          <button
            className={`bg-option ${calendarBg === '#ffffff' ? 'selected' : ''}`}
            onClick={() => setCalendarBg('#ffffff')}
            style={{ background: '#ffffff' }}
          />
          <button
            className={`bg-option ${calendarBg === '#faf8f1' ? 'selected' : ''}`}
            onClick={() => setCalendarBg('#faf8f1')}
            style={{ background: '#faf8f1' }}
          />
          <button
            className={`bg-option ${calendarBg === '#fdf2f8' ? 'selected' : ''}`}
            onClick={() => setCalendarBg('#fdf2f8')}
            style={{ background: '#fdf2f8' }}
          />
          <button
            className={`bg-option ${calendarBg === '#f0f9ff' ? 'selected' : ''}`}
            onClick={() => setCalendarBg('#f0f9ff')}
            style={{ background: '#f0f9ff' }}
          />
        </div>
      )}

      {selectedMenu === 'mainBg' && (
        <div className="main-bg-options">
          <button
            className="bg-option upload-button"
            onClick={onGalleryUpload}
          >
            +
          </button>
          <button
            className="bg-option"
            onClick={() => setMainBg('linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)')}
            style={{ background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)' }}
          />
          <button
            className="bg-option"
            onClick={() => setMainBg('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')}
            style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
          />
          <button
            className="bg-option"
            onClick={() => setMainBg('linear-gradient(45deg, rgba(255,193,7,0.3) 0%, rgba(255,87,34,0.4) 25%, rgba(76,175,80,0.3) 50%, rgba(33,150,243,0.4) 75%, rgba(156,39,176,0.3) 100%)')}
            style={{ background: 'linear-gradient(45deg, rgba(255,193,7,0.3) 0%, rgba(255,87,34,0.4) 25%, rgba(76,175,80,0.3) 50%, rgba(33,150,243,0.4) 75%, rgba(156,39,176,0.3) 100%)' }}
          />
        </div>
      )}
    </div>
  );
}

export default SubMenu;
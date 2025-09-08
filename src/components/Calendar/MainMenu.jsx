import React from "react";
import "../style/MainMenu.scss";

function MainMenu({ selectedMenu, onMenuSelect }) {
  const tapeStyles = {
    gray: '/image/tape/tape01.png'
  };

  const stickerEmojis = {
    a: '/image/sticker/01.png'
  };

  return (
    <div className="main-menu">
      {/* 테이프 메뉴 */}
      <button
        className={`menu-button ${selectedMenu === 'tape' ? 'active' : ''}`}
        onClick={() => onMenuSelect(selectedMenu === 'tape' ? null : 'tape')}
      >
        <div 
          className="tape-preview"
          style={{
            backgroundImage: `url(${tapeStyles.gray})`
          }}
        />
      </button>

      {/* 스티커 메뉴 */}
      <button
        className={`menu-button ${selectedMenu === 'sticker' ? 'active' : ''}`}
        onClick={() => onMenuSelect(selectedMenu === 'sticker' ? null : 'sticker')}
      >
        <div 
          className="sticker-preview"
          style={{
            backgroundImage: `url(${stickerEmojis.a})`
          }}
        />
      </button>

      {/* 텍스트 메뉴 */}
      <button
        className={`menu-button ${selectedMenu === 'text' ? 'active' : ''}`}
        onClick={() => onMenuSelect(selectedMenu === 'text' ? null : 'text')}
      >
        <div className="text-preview">
          Aa
        </div>
      </button>

      {/* 캘린더 배경 메뉴 */}
      <button
        className={`menu-button ${selectedMenu === 'calendarBg' ? 'active' : ''}`}
        onClick={() => onMenuSelect(selectedMenu === 'calendarBg' ? null : 'calendarBg')}
      >
        <div className="calendar-bg-preview">
          <div className="calendar-lines"></div>
          <div className="calendar-lines"></div>
          <div className="calendar-lines"></div>
        </div>
      </button>

      {/* 배경사진 메뉴 */}
      <button
        className={`menu-button ${selectedMenu === 'mainBg' ? 'active' : ''}`}
        onClick={() => onMenuSelect(selectedMenu === 'mainBg' ? null : 'mainBg')}
      >
        <div className="main-bg-preview">
          <div className="bg-icon"></div>
        </div>
      </button>
    </div>
  );
}

export default MainMenu;
import React from "react";
import "../style/SideButtons.scss";

function SideButtons({ onShare, onPhotoUpload, onGoToMyPage }) {
  return (
    <div className="side-buttons">
      <button
        className="side-button"
        onClick={onShare}
      >
        📤
      </button>

      <button
        className="side-button"
        onClick={onPhotoUpload}
      >
        📷
      </button>

      <button
        className="side-button"
        onClick={onGoToMyPage}
      >
        👤
      </button>
    </div>
  );
}

export default SideButtons;
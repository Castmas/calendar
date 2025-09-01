import React from "react";

function MenuPanel({
  selectedTape,
  setSelectedTape,
  selectedSticker,
  setSelectedSticker,
  calendarBg,
  setCalendarBg,
  mainBg,
  setMainBg,
  setBoardImage,
  attachedItems,
  setAttachedItems,
  selectedMenu,
  setSelectedMenu,
}) {
  // 보드 이미지 업로드 처리
  const handleBoardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBoardImage(imageUrl);
    }
  };

  // 메인 배경 이미지 업로드 처리
  const handleMainBgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMainBg(`url("${imageUrl}") center/cover no-repeat`);
    }
  };

  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-2">메뉴</h2>

      {/* 메뉴 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedMenu("tape")}
          className={`px-3 py-1 rounded ${
            selectedMenu === "tape" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          테이프
        </button>
        <button
          onClick={() => setSelectedMenu("sticker")}
          className={`px-3 py-1 rounded ${
            selectedMenu === "sticker" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          스티커
        </button>
        <button
          onClick={() => setSelectedMenu("bg")}
          className={`px-3 py-1 rounded ${
            selectedMenu === "bg" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          배경
        </button>
      </div>

      {/* 선택된 메뉴에 따라 렌더링 */}
      {selectedMenu === "tape" && (
        <div>
          <p className="mb-2 font-semibold">테이프 색상</p>
          <div className="flex gap-2">
            {["gray", "red", "blue", "green"].map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded cursor-pointer border-2 ${
                  selectedTape === color
                    ? "border-black"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedTape(color)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedMenu === "sticker" && (
        <div>
          <p className="mb-2 font-semibold">스티커 선택</p>
          <div className="flex gap-2 flex-wrap">
            {["a", "b", "c", "d"].map((type) => (
              <img
                key={type}
                src={`image/sticker_${type}.png`}
                alt={`스티커 ${type}`}
                className={`w-12 h-12 cursor-pointer rounded border-2 ${
                  selectedSticker === type
                    ? "border-black"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedSticker(type)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedMenu === "bg" && (
        <div>
          <p className="mb-2 font-semibold">배경 변경</p>

          {/* 캘린더 배경 색상 */}
          <div className="flex gap-2 mb-4">
            {["#ffffff", "#fef3c7", "#d1fae5", "#e0f2fe"].map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded cursor-pointer border-2 ${
                  calendarBg === color
                    ? "border-black"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setCalendarBg(color)}
              />
            ))}
          </div>

          {/* 보드 이미지 업로드 */}
          <label className="block mb-4">
            <span className="text-sm font-medium">보드 이미지 업로드</span>
            <input
              type="file"
              accept="image/*"
              className="block mt-1"
              onChange={handleBoardImageChange}
            />
          </label>

          {/* 메인 배경 이미지 업로드 */}
          <label className="block">
            <span className="text-sm font-medium">메인 배경 업로드</span>
            <input
              type="file"
              accept="image/*"
              className="block mt-1"
              onChange={handleMainBgChange}
            />
          </label>
        </div>
      )}
    </aside>
  );
}

export default MenuPanel;
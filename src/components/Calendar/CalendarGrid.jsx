import React from "react";

function CalendarGrid({
  year,
  month,
  firstDayIndex,
  daysInMonth,
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  attachedItems,
  draggedItem,
  isDraggingAttached,
  setDraggedItem,
  setIsDraggingAttached,
  dragOffset,
  setDragOffset,
  selectedTape,
  selectedSticker,
  boardImage,
  calendarBg,
}) {
  // 날짜 그리드 생성
  const leadingBlanks = Array.from({ length: firstDayIndex }, (_, i) => (
    <div key={`blank-${i}`} className="p-2 border bg-gray-50" />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return (
      <div
        key={day}
        className="p-2 border bg-white relative cursor-pointer hover:bg-gray-100"
        onDoubleClick={() => onAddNote(day)}
      >
        <div className="font-bold">{day}</div>

        {/* 메모 렌더링 */}
        {notes[day]?.map((note, index) => (
          <div
            key={index}
            className="mt-1 p-1 text-xs bg-yellow-200 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onEditNote(day, index);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              onDeleteNote(day, index);
            }}
          >
            {note.text}
          </div>
        ))}
      </div>
    );
  });

  // 붙여진 아이템 렌더링
  const attachedElements = attachedItems.map((item, index) => (
    <img
      key={index}
      src={`image/sticker_${item.type}.png`}
      alt="attached"
      className="absolute w-8 h-8"
      style={{ top: item.y, left: item.x }}
      draggable={false}
    />
  ));

  return (
    <div
      className="relative flex-1 grid grid-cols-7 gap-1 p-4 rounded-xl shadow"
      style={{ background: calendarBg }}
    >
      {/* 보드 이미지 */}
      {boardImage && (
        <img
          src={boardImage}
          alt="board"
          className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-20"
        />
      )}

      {/* 날짜 렌더링 */}
      {leadingBlanks}
      {days}

      {/* 드래그 중인 아이템 */}
      {isDraggingAttached && draggedItem && (
        <img
          src={`image/sticker_${draggedItem.type}.png`}
          alt="dragging"
          className="absolute w-8 h-8 pointer-events-none opacity-70"
          style={{
            top: draggedItem.y - dragOffset.y,
            left: draggedItem.x - dragOffset.x,
          }}
        />
      )}

      {/* 이미 붙여진 아이템 */}
      {attachedElements}
    </div>
  );
}

export default CalendarGrid;
import React from "react";
import "../style/Calendar.scss";

function Calendar({ 
  year, 
  month, 
  firstDayIndex, 
  daysInMonth, 
  notes, 
  setNotes, 
  calendarBg,
  onDragOver,
  onDrop,
  children 
}) {
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

  // 캘린더 그리드 생성
  const leadingBlanks = Array.from({ length: firstDayIndex }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells = [...leadingBlanks, ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div 
      className="calendar"
      data-calendar="true"
      style={{ background: calendarBg }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}

      <div className="month-display">
        {String(month + 1).padStart(2, '0')}
      </div>

      <div className="weekday-header">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((day, index) => (
          <div key={index} className="calendar-cell">
            {day && (
              <>
                <div 
                  className="day-number"
                  onClick={() => handleAddNote(day)}
                >
                  {day}
                </div>
                <div className="notes-container">
                  {(notes[day] || []).map((text, noteIndex) => (
                    <div 
                      key={noteIndex} 
                      className="note-item"
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
  );
}

export default Calendar;
import React from "react";
import CalendarGrid from "./CalendarGrid";
import "./CalendarScreen.scss";

function CalendarScreen(props) {
  return (
    <div className="calendar-screen">
      <div className="calendar-wrapper">
        <CalendarGrid {...props} />
      </div>
    </div>
  );
}

export default CalendarScreen;

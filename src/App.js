import React, { useState } from "react";
import "./App.css";
import backgroundImage from "./image/background.png";
import maintxt from "./image/maintxt.png";
import login from "./image/login.png";
import start from "./image/start.png";
import CalendarScreen from "./components/CalendarScreen";
import LoginModal from "./components/Login/LoginModal";
import MyPage from "./components/MyPage";

function App() {
  const [screen, setScreen] = useState("main");

  const goToLogin = () => setScreen("login");
  const goToMain = () => setScreen("main");
  const goToCalendar = () => setScreen("calendar");
  const goToMyPage = () => setScreen("mypage");
  const createNewCalendar = () => {
    // 새 캘린더 생성 로직 (현재는 캘린더 화면으로 이동)
    setScreen("calendar");
  };

  if (screen === "login") {
    return (
      <div className="login-screen">
        <LoginModal onClose={goToMain} />
      </div>
    );
  }

  if (screen === "calendar") {
    return <CalendarScreen onGoToMyPage={goToMyPage} />;
  }

  if (screen === "mypage") {
    return (
      <MyPage 
        onGoToCalendar={goToCalendar}
        onCreateNewCalendar={createNewCalendar}
      />
    );
  }

  return (
    <div
      className="main-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <img src={maintxt} alt="Welcome To My Calendar" className="title-img" />
      <div className="button-container">
        <img
          src={login}
          alt="Login"
          className="button-img"
          onClick={goToLogin}
        />
        <img
          src={start}
          alt="Start"
          className="button-img"
          onClick={goToCalendar}
        />
      </div>
    </div>
  );
}

export default App;
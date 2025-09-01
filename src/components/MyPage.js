import React, { useState, useRef } from "react";

function MyPage({ onGoToCalendar, onCreateNewCalendar }) {
  // 랜덤 동물 이름들
  const animalNames = [
    "행복한 판다", "귀여운 고양이", "활발한 토끼", "지혜로운 부엉이", 
    "용감한 사자", "온순한 양", "똑똑한 돌고래", "재빠른 다람쥐",
    "우아한 백조", "친근한 강아지", "신비한 여우", "평화로운 거북이"
  ];
  
  const [userName] = useState(animalNames[Math.floor(Math.random() * animalNames.length)]);
  const [calendarCount] = useState(Math.floor(Math.random() * 5));
  const [likeCount] = useState(Math.floor(Math.random() * 20));
  const [activeTab, setActiveTab] = useState("Calendar");
  const [hasCalendars, setHasCalendars] = useState(false);
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop&crop=face");
  const [copySuccess, setCopySuccess] = useState(false);
  
  const fileInputRef = useRef(null);
  
  const handleCreateCalendar = () => {
    setHasCalendars(true);
    if (onCreateNewCalendar) {
      onCreateNewCalendar();
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyProfileLink = async () => {
    try {
      const profileLink = `https://calendar.app/profile/${userName.replace(/\s+/g, '-').toLowerCase()}`;
      await navigator.clipboard.writeText(profileLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const myCalendars = [
    { id: 1, month: "03", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: 2, month: "03", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { id: 3, month: "03", bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }
  ];

  // 좋아요한 다른 사람의 보드 데이터
  const likedBoards = [
    { id: 1, month: "03", author: "귀여운 토끼", bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
    { id: 2, month: "02", author: "신비한 여우", bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
    { id: 3, month: "01", author: "활발한 다람쥐", bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
    { id: 4, month: "03", author: "지혜로운 부엉이", bg: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      {/* 좌측 네비게이션 */}
      <div style={{
        position: 'fixed',
        left: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 1000
      }}>
        <button
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#666',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          👤
        </button>

        <button
          onClick={handleCopyProfileLink}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: copySuccess ? 'rgba(34, 197, 94, 0.9)' : 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: copySuccess ? 'white' : '#666',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!copySuccess) {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!copySuccess) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }
          }}
        >
          {copySuccess ? '✓' : '🔗'}
        </button>
      </div>

      {/* 메인 컨테이너 */}
      <div style={{
        width: 'min(600px, 90vw)',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {/* 프로필 섹션 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundImage: `url("${profileImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}>
            <button
              onClick={handleProfileImageClick}
              style={{
                position: 'absolute',
                bottom: '-5px',
                right: '-5px',
                width: '30px',
                height: '30px',
                background: 'white',
                borderRadius: '50%',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#666'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 3px 12px rgba(0,0,0,0.15)';
                e.target.style.background = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.target.style.background = 'white';
              }}
            >
              +
            </button>
          </div>
          
          <div>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#333'
            }}>
              {userName}
            </h2>
            <p style={{
              margin: '0',
              color: '#888',
              fontSize: '14px'
            }}>
              이메일@gmail.com
            </p>
          </div>
        </div>

        {/* 통계 섹션 */}
        <div style={{
          display: 'flex',
          gap: '40px',
          marginBottom: '30px',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Calendar</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>{calendarCount}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Like</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>{likeCount}</div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div style={{
          display: 'flex',
          marginBottom: '30px',
          justifyContent: 'center',
          gap: '40px'
        }}>
          <button
            onClick={() => setActiveTab("Calendar")}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              color: activeTab === "Calendar" ? '#333' : '#999',
              fontWeight: activeTab === "Calendar" ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            Calendar
            {activeTab === "Calendar" && (
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                left: '0',
                right: '0',
                height: '1px',
                background: '#333'
              }} />
            )}
          </button>
          <button
            onClick={() => setActiveTab("Likes Board")}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              color: activeTab === "Likes Board" ? '#333' : '#999',
              fontWeight: activeTab === "Likes Board" ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            Likes Board
            {activeTab === "Likes Board" && (
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                left: '0',
                right: '0',
                height: '1px',
                background: '#333'
              }} />
            )}
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        <div style={{ minHeight: '300px' }}>
          {activeTab === "Calendar" && (
            <div>
              {hasCalendars ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '20px'
                }}>
                  {myCalendars.slice(0, calendarCount || 3).map((calendar) => (
                    <div
                      key={calendar.id}
                      style={{
                        aspectRatio: '3/4',
                        background: calendar.bg,
                        borderRadius: '12px',
                        padding: '20px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px)';
                        e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                      }}
                    >
                      {/* 테이프 효과 */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '15px',
                        width: '50px',
                        height: '20px',
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '2px',
                        transform: 'rotate(-12deg)'
                      }} />
                      
                      <div style={{
                        fontSize: '48px',
                        fontWeight: '300',
                        fontFamily: 'Georgia, serif'
                      }}>
                        {calendar.month}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#999'
                }}>
                  <div 
                    style={{
                      fontSize: '16px',
                      marginBottom: '30px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: '20px',
                      borderRadius: '10px'
                    }}
                  >
                    There are no calendars created yet.
                  </div>
                  <button
                    onClick={handleCreateCalendar}
                    style={{
                      background: '#333',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '25px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#555';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#333';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Go make it!
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Likes Board" && (
            <div>
              {likedBoards.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '15px'
                }}>
                  {likedBoards.map((board) => (
                    <div
                      key={board.id}
                      style={{
                        aspectRatio: '3/4',
                        background: board.bg,
                        borderRadius: '10px',
                        padding: '15px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div style={{
                        fontSize: '36px',
                        fontWeight: '300',
                        fontFamily: 'Georgia, serif',
                        marginBottom: '10px'
                      }}>
                        {board.month}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        opacity: '0.8',
                        position: 'absolute',
                        bottom: '10px',
                        left: '15px',
                        right: '15px'
                      }}>
                        by {board.author}
                      </div>
                      {/* 하트 아이콘 */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '16px'
                      }}>
                        ❤️
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#999',
                  fontSize: '16px'
                }}>
                  아직 좋아요한 보드가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 복사 성공 토스트 */}
      {copySuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(34, 197, 94, 0.95)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '14px',
          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
          zIndex: 1001,
          animation: 'slideIn 0.3s ease-out'
        }}>
          프로필 링크가 복사되었습니다!
        </div>
      )}

      {/* 하단 캘린더 버튼 */}
      <button
        onClick={onGoToCalendar}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#333',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          color: 'white',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        }}
      >
        📅
      </button>
    </div>
  );
}

export default MyPage;
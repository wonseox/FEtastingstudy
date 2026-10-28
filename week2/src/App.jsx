import "./App.css";

function App() {
  const username = "wonseok";
  const location = "Daejeon, Korea";
  const likeCount = 1412;
  const caption = "멋쟁이 인생";

  return (
    <main className="feed">
      <article className="post">
        <header className="profile">
          <img className="profile-image" src="/images/profile.jpg" alt="프로필" />

          <div className="profile-text">
            {/* 여기! */}
            <strong>{username}</strong>
            <span>{location}</span>
          </div>
          <button className="more-button">•••</button>
        </header>
        <img className="post-image" src="/images/멋쟁이 인생.jpg" alt="피카소 캐릭터" />
        <section className="content">
          <div className="actions">
            <div>
              <button aria-label="좋아요">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
              </button>
              <button aria-label="댓글">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 11.6a9.2 9.2 0 1 0-4.8 8.1L22 22l-1.9-5.7a9.1 9.1 0 0 0 .9-4.7Z" />
                </svg>
              </button>
              <button aria-label="DM 보내기">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m22 2-8.5 20-4-11L1 2h21ZM9.5 11 22 2" />
                </svg>
              </button>
            </div>

            <button aria-label="저장">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 2h16v20l-8-6-8 6V2Z" />
              </svg>
            </button>
          </div>
          <p className="likes">
            좋아요 <strong>{likeCount.toLocaleString()}</strong>개
          </p>
          <p className="caption">
            <strong>{username}</strong>
            {caption}
          </p>
        </section>
      </article>
    </main>
  );
}

export default App;

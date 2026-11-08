import { useState } from "react";
import "./App.css";

function Profile(prop) {
  return (
    <header className="post-profile">
      <img
        className="profile-image"
        src="/images/eden-avatar.png"
        alt="eden 프로필" />

      <strong className="profile-username">{prop.username}</strong>

      <button className="more-button" type="button" aria-label="더 보기">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>

  );
}

function PostImage() {
  return (
    <div className="post-image-area">
      <img className="post-image" src="/images/wow.png" alt="홍익대학교 마스코트" />
    </div>
  );
}

function PostActions(prop) {
  return (
    <div className="post-actions">
      <div className="left-actions">
        <button
          type="button"
          className={prop.liked ? "like-button liked" : "like-button"}
          aria-label="좋아요"
          aria-pressed={prop.liked}
          onClick={prop.onLikeClick}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>

        <button type="button" aria-label="댓글">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 11.6a9.2 9.2 0 1 0-4.8 8.1L22 22l-1.9-5.7a9.1 9.1 0 0 0 .9-4.7Z" />
          </svg>
        </button>

        <button type="button" aria-label="공유">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m22 2-8.5 20-4-11L1 2h21ZM9.5 11 22 2" />
          </svg>
        </button>
      </div>
      <button type="button" aria-label="저장">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 2h16v20l-8-6-8 6V2Z" />
        </svg>
      </button>
    </div>

  );
}

function PostContent(prop) {
  return (
    <section className="post-content">
      <p className="like-count">
        좋아요 <strong>{prop.likeCount}</strong>개
      </p>

      <p className="caption">
        <strong>{prop.username}</strong>
        <span>프론트엔드 찍먹 중 👅</span>
      </p>
    </section>
  );
}

function Post(prop) {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
  };

  const likeCount = liked ? Number(prop.number) + 1 : Number(prop.number);

  return (
    <article className="post">
      <Profile username={prop.name} />
      <PostImage />
      <PostActions liked={liked} onLikeClick={handleLikeClick} />
      <PostContent username={prop.name} likeCount={likeCount} />
    </article>
  );
}


const members = [
  { name: "짱구", number: "10" },
  { name: "철수", number: "21" },
  { name: "유리", number: "32" },
];

function App() {
  return (
    <main className="page">
      {members.map((mem) => (
        <Post key={mem.name} name={mem.name} number={mem.number} />
      ))}
    </main>
  );
}
export default App;
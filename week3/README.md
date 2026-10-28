# Week 3 Component Practice

완성된 하나의 게시글 UI를 여러 React Component로 나누어 보는 실습입니다.

이 폴더만 복사하거나 압축해 학생에게 전달할 수 있습니다. `node_modules`는 포함하지 않습니다.

## 실행하기

```bash
npm install
npm run dev
```

## 실습 시작 상태

게시글의 모든 JSX가 `src/App.jsx`의 `App` 함수 안에 들어 있습니다.

- `post-profile`: 프로필 영역
- `post-image-area`: 게시글 이미지 영역
- `post-actions`: 좋아요, 댓글, 공유, 저장 영역
- `post-content`: 좋아요 수와 본문 영역

컴포넌트를 나눈 뒤에도 화면의 디자인과 내용은 이전과 같아야 합니다.

이 초기 코드에는 Props, Array, `map`, state, 이벤트 핸들러가 사용되지 않았습니다.

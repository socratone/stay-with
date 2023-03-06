# 머물음 (meo-mul-eum)

가톨릭 묵상 노트

## Apis

- `/lexio-divinas` GET 묵상글 리스트 데이터
- `/lexio-divinas` POST 묵상글 작성
- `/lexio-divinas/{id}` GET 묵상글 데이터
- `/lexio-divinas/{id}` PUT 묵상글 수정
- `/lexio-divinas/{id}` DELETE 묵상글 삭제
- `/lexio-divinas/{id}/comments` POST 묵상글의 댓글 작성
- `/lexio-divinas/{id}/comments/{id}` DELETE 묵상글의 댓글 삭제
- `/lexio-divinas/{id}/likeds` POST 묵상글의 좋아요 추가
- `/lexio-divinas/{id}/likeds/{id}` DELETE 묵상글의 좋아요 삭제
- `/login` POST 사용자 로그인
- `/signup` POST 사용자 등록
- `/users/{id}` GET 사용자 데이터

## Data Schema

```
interface User {
  _id: string;
  kakaoId: number;
  name: string;
  email: string;
  imageUrl?: string;
}
```

```
interface LexioDivina {
  _id: string;
  bible: Bible;
  content: string;
  phrase: string;
  chapter: number;
  verse: number;
  endChapter: number;
  endVerse: number;
  userId: string;
  likedUserIds: string[];
  comments: {
    _id: string;
    userId: string;
    message: string;
  }[];
}
```

## Deployment

- [Vercel](https://vercel.com/socratone/mmm)
- [Mongodb Atlas](https://cloud.mongodb.com/v2/63e7a20d3a6c87733d5ab363#/clusters)

## Stacks

- NextJS
- Mongodb
- Material UI

## Eslint Rules

- import 순서를 자동으로 sort 해준다. ([참고 링크](https://github.com/lydell/eslint-plugin-simple-import-sort))

```
"plugins": ["simple-import-sort"],
"rules": {
  "simple-import-sort/imports": "error",
  "simple-import-sort/exports": "error",
  "import/first": "error",
  "import/newline-after-import": "error",
  "import/no-duplicates": "error",
}
```

- no-else-return

## Development

- .env.development

```
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID="?????"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
AUTH_SECRET="?????"
MONGO_CLIENT_URL="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.0"
```

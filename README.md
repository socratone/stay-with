# 머무름 (stay-with)

가톨릭 묵상 SNS

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
- `/users/{id}` PATCH 사용자 데이터 수정

## Data Schema

```
User {
  _id: string;
  kakaoId: number;
  name: string;
  email: string;
  imageUrl?: string;
  description?: string;
}
```

```
LexioDivina {
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

- [Vercel](https://vercel.com/socratone/stay-with)
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

## Conventions

- 가능하면 `interface` 보다 `type`을 사용한다.

### Naming

- UserData: GET 요청의 response data를 의미
- UserPostResult: POST 요청의 result를 의미
- UserPatchResult: PATCH 요청의 result를 의미

## Environment

- .env.development

```
NEXT_PUBLIC_ENV="development"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY="????"
KAKAO_REST_API_KEY="????"
KAKAO_CLIENT_SECRET="????"
AUTH_SECRET="????"
MONGO_CLIENT_URL="????"
```

- .env.staging
- .env.production

## Folder Structure

### Components

재사용 가능한 컴포넌트\
각 폴더 안에 컴포넌트에 필요한 모든 요소들을 둔다.

```
AlertDialog
  index.ts
  AlertDialog.tsx
  Button.tsx
  constants.ts
  helpers.ts
```

index.ts를 이용해서 import시 path를 깔끔하게 한다.\
index.ts로 이어지는 AlertDialog.tsx(메인 컴포넌트)를 제외하고는 AlertDialog 폴더 안에 있어 구분이 되니 prefix는 postfix 등을 붙이지 않는다.

### Feature

기능과 관련된 로직이 들어 있어서 공통으로 사용할 수 없는 컴포넌트

### Utils

범용적으로 사용할 수 있는 순수 함수\
공통으로 사용하면 여기에 둔다.\
예를 들어 lodash에 있는 함수가 utils에 해당한다.

### Helpers

Utils와는 조금 다르게 특정 프로젝트에만 사용하기 적합한 순수 함수\
공통으로 사용하면 여기에 둔다.

### Constants

상수, 공통으로 사용하면 여기에 둔다.

### 참고

- https://kofearticle.substack.com/p/korean-fe-article--08f
- https://www.robinwieruch.de/react-folder-structure/

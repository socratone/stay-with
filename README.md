# 머무름 (stay-with)

기도하며 머무는 곳

## Deployment

- [Vercel](https://vercel.com/socratone/stay-with)
- [Mongodb Atlas](https://cloud.mongodb.com/v2/63e7a20d3a6c87733d5ab363#/clusters)

## Log

- [Logflare](https://logflare.app/sources/28243)

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
- userDialogOpen: isOpen이나 opened가 아닌 open 키워드를 사용

## Environment

### .env.development

```
NEXT_PUBLIC_ENV="development"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY="????"
KAKAO_REST_API_KEY="????"
KAKAO_CLIENT_SECRET="????"
AUTH_SECRET="????"
MONGO_CLIENT_URL="????"

NEXT_PUBLIC_DEV_USER_ID="????"
```

### .env.production

```
NEXT_PUBLIC_ENV="production"
NEXT_PUBLIC_BASE_URL="https://staywith.kr"
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY="????"
KAKAO_REST_API_KEY="????"
KAKAO_CLIENT_SECRET="????"
AUTH_SECRET="????"
MONGO_CLIENT_URL="????"
LOGFLARE_SOURCE_ID="????"
LOGFLARE_API_KEY="????"
```

## Folder Structure

### Components

재사용 가능한 컴포넌트\
각 폴더 안에 컴포넌트에 필요한 모든 요소들을 둔다.

```
AlertDialog/
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

## PWA

- manifest.theme_color 앱 메뉴 color
- meta 태그를 이용해서 dark mode일 때 theme_color 변경

```tsx
<meta name="theme-color" content="#000" media="(prefers-color-scheme: dark)" />
```

### 참고

- https://web.dev/learn/pwa/web-app-manifest/

## Sentry

- [Issues](https://socratone.sentry.io/issues/?project=4505635607019520)

### Usage

- [Capturing Errors](https://docs.sentry.io/platforms/javascript/guides/nextjs/usage/#capturing-errors)

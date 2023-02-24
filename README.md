# 머물음 (meo-mul-eum)

가톨릭 묵상 노트

## Apis

- `/posts` GET 글 리스트 데이터
- `/posts` POST 글 작성
- `/posts/{id}` GET 글 데이터
- `/posts/{id}` PUT 글 수정
- `/posts/{id}` DELETE 글 삭제
- `/posts/{id}/comments` POST 포스트의 댓글 작성
- `/posts/{id}/comments/{id}` DELETE 포스트의 댓글 삭제
- `/posts/{id}/likeds` POST 포스트의 좋아요 추가
- `/posts/{id}/likeds/{id}` DELETE 포스트의 좋아요 삭제
- `/login` POST 사용자 로그인
- `/signup` POST 사용자 등록

## Data Schema

- `users` collection
- `posts` collection

## Deployment

- Vercel
- Mongodb Atlas

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

- material ui를 전부 import 하지 않도록 막는다. ([참고 링크](https://eslint.org/docs/latest/rules/no-restricted-imports))

```
"no-restricted-imports": [
  "error",
  {
    "paths": ["@mui/material"]
  }
]
```

- no-else-return

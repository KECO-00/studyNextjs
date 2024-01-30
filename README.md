# CSR / SSR / SSG 이해하기

### SSR(Server Side Rendering)

현존하는 일부 블록, 홈페이지, 웹사이트 등에 사용되고 있고, php나 JAVA의 서버사이트 템플릿 엔진을 이용하여 많이 개발되어 있음

- 예) 사이트 접속 -> 완성된 HTML 받음. 페이지를 바꿀 때마다 새로운 HTML이 내려옴
- 즉, 완성된 HTML이 서버에서 만들어진 뒤 브라우저에 전송되고, 브라우저는 새로운 HTML이 내려옴
- 따라서, 바로 완성된 HTML을 내려주기 때문에, 초기 용량이 작고 보안에 유리함
- 페이지마다 새로운 HTML을 그려줘야 하기 때문에, 페이지가 라우팅 될 때마다 화면 깜빡임이 있을 수 있고, 사용자가 많을 때에는 서버 부하의 위험이 있음.
- 완성된 HTML로 인해 크롤링을 하기 좋은 환경이기 때문에, SEO에 좋음

### CSR(Client Side Rendering)

CRA(create-react-app)으로 만든 React 앱이 CSR 방식으로 렌더링함

- 텅 빈 HTML 파일이 존재. root를 id로 가지는 div만 존재함. 나머지 DOM은 모두 JS로 그림
- 처음에는 빈 HTML 파일만 받고, JS를 다운로드하여 실행함.
- 초기에는 작은 HTML만 받고, 나머지는 JS로 동적으로 그리기 떄문에 SSR과 달리 화면 깜빡임이 없고 대신 초기 용량이 큼
- 서버에서 렌더링되는 것이 아니라 JS로 돔을 그리는 것이기 때문에, 해당 JS 파일을 캐시 가능함. 하지만 서버 data가 필요한 경우 계속해서 서버와 계속해서 서버와 통신해야 되기 때문에 상대적으로 보안에 취약함
- 크롤링 방식에 따라 SSR에 비해 SEO에 제약이 있음
- request time. 즉, 사이트에 접속할 때마다 HTML을 만듦.

### SSG(Static Site Generation)

- pre-rendering이라는 개념을 차용
  - static한 HTML을 build time에 미리 만들어두는 것
- 미리 정적인 HTML을 만들어두기 떄문에 서버에 부하가 없고, HTML 자체를 캐시할 수 있음.
- 완성된 HTML이기 때문에 SEO에도 좋음
- 내용이 동적으로 변하지 않는 정적인 사이트에 이용
- 예) Next 공식 홈페이지 - HTML이 내용으로 채워져 있고, Header에 'x-vercel-cache: HIT'라는 헤더 존재
  - Vercel에서 캐시해두기 때문에 임의로 개발자 도구를 이용하여, 브라우저 캐시를 꺼두어도 새로고침을 할 때마다 캐시된 HTML을 똑같이 받을 수 있음
  - 'etag'를 봐도 새로고침 했을 때, 같은 파일이 똑같이 오는 것을 확인 가능

## Next.js를 사용하는 이유

- SSR, CSR, SSG의 장점만 고려하여 페이지를 자유롭게 routing / rendering 할 수 있도록 API를 제공함

  - SSR과 SSG에서 HTML의 작은 용량과 보안
  - CSR에서 빠른 페이지 이동속도와 깜빡임 없는 UX
  - 현존하는 기술의 장점을 모아 새로운 기능을 제공하는 Next.js의 방향성

- Next의 pre-rendering
  - CRA에서 JS disable을 하면, 화면이 나타나지 않음
  - Next에서는 이미 완성된 HTML이기 때문에 화면 사용가능

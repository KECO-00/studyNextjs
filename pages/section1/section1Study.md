# nextBuild를 했을 때 만들어지는 .next 폴더 분석

## getSTaticProps.tsx 페이지를 분석

이를 실행했을 때, 페이지가 나타남

- 이때 네트워크에 보이는 getStaticProps에 해당하는 HTML과 JS 파일은 어디에 저장되어 있는지 확인
  프로젝트의 맨 위 폴더인 .next 폴더를 살펴보면 cache, server, static이라는 세가지 폴더로 나뉘어져 있음
- static/chunks/pages의 section1에 들어가면 getStaticProps라는 JS 파일이 있음.
  - 일정 해시값이 존재하는데, 브라우저에서 보면 같은 해시값을 가진 파일을 다운로드 하는 것을 확인할 수 있음
  - 이 파일에서 getStaticProps 페이지에 대한 정보가 담겨있는 것을 확인할 수 있음

---

### Next 서버에서 프리렌더링을 뒤에서 진행하는 방법

- server/pages/section1에는 HTML 파일과 json파일이 있음
- 페이지 캐시가 HIT 상태일 때, 페이지의 값과 HTML, json에 값 모두 같음
  > 이 상태에서 새로고침을 하면, ETag가 변하지 않기 때문에 값은 같지만, Revalidate 시간이 지나서 캐시는 stale 상태가 됨
- 그리고, 서버에서 getStaticProps 함수를 실행하여 API를 새로 요청하고, 프리렌더링을 진행하고 있을 것임
- 코드(HTML, json 파일)를 살펴보면, 값이 이전값과 다른 것을 확인할 수 있음
  > 즉, 뒤에서는 이미 프리렌더링이 진행됨
- 이때 새로고침을 하면, 서버에 저장되어 있던 값이 불러와지고, ETag도 바뀐것을 확인할 수 있음

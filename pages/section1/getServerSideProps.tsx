import type { GetServerSideProps, NextPage } from 'next';

interface Props {
  data: number;
}

const Example: NextPage<Props> = ({ data }) => {
  return (
    <main>
      <h1>getServerSideProps Page</h1>
      <p>값: {data}</p>
    </main>
  );
};

export default Example;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  /** https://web.dev/i18n/ko/stale-while-revalidate/ */
  // This value is considered fresh for five seconds (s-maxage=5).
  // If a request is repeated within the next 5 seconds, the previously
  // cached value will still be fresh.
  //
  // If the request is repeated before 5~15 seconds,
  // the cached value will be stale but still render (stale-while-revalidate=10).
  //
  // In the background, a revalidation request will be made to populate the cache
  // with a fresh value. If you refresh the page, you will see the new value.
  // 이 부분이 revalidate 하는 부분 
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=5, stale-while-revalidate=10'
  );

  const delayInSeconds = 2;
  const data = await new Promise((resolve) =>
    setTimeout(() => resolve(Math.random()), delayInSeconds * 1000)
  );

  return {
    props: { data },
  };
};


/*
## 강의 내용

getStaticProps 파일과 거의 유사. 다른점은 getStaticProps 대신 getServerSideProps라는 함수를 사용함

API를 moking하기 위해서 2초동안 기다린 뒤, promise를 resolve하여 데이터를 props로 return함
그려먼 페이지 컴포넌트에서 데이터를 받아서 렌더링함

페이지 접속 후, 새로고침을 하면 2초 뒤에 페이지가 렌더링됨. 
SSG와 달리 새로고침을 할 때마다, 2초동안 pending 상태가 되고, 2초 후에 그 결과가 렌더링 됨.

즉, SSR은 빌드 타임에 프리렌더링 되는게 아니라, 요청 시간(request time) 페이지에 들어올 때마다 프리렌더링 되는것임
  > SSG에 비해 사용자 경험이 좋지 않으며, 반드시 request time마다 서버사이드에서 렌더링 해야되는 페이지에만 적용해야 함
  > 예) 사용자의 인증 정보에 따라 변하는 페이지, 페이지가 동적으로 변해야 하지만 보안은 필요한 페이지에 사용
  - 가능하면 CSR이나 SSG를 사용


getStaticProps와 같이 revalidate를 할 수 있는 방법
  - 실사용은 적음
  - response header의 Cahce-Control 헤더 설정 가능 
*/
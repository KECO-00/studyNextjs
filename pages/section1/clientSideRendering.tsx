import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

/** https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr */
const NoSSR = dynamic(() => import('../../components/section1/NoSSR'), {
  ssr: false,
});

const Example: NextPage = () => {
  const [data, setData] = useState(0);

  useEffect(() => {
    const delayInSeconds = 2;
    new Promise<number>((resolve) =>
      setTimeout(() => resolve(Math.random()), delayInSeconds * 1000)
    ).then((result) => setData(result));
  }, []);

  return (
    <main>
      <h1>Client-side data fetching</h1>
      <p>값: {data}</p>

      <h1>no SSR</h1>
      <NoSSR />
    </main>
  );
};

export default Example;


/*
  기존의 React 코드와 크게 다르지 않음

  데이터를 useState 훅으로 선언하고, 값을 렌더링
  useEffect 안에서 값을 바꾸는 메인 로직을 수행
  기존과 같이 2초 후 랜덤 값을 resolve하고, 그 값을 setDate를 사용하여 상태를 업데이트함

  - 새로고침을 누르면 2초 뒤에 값이 찍힘
    - 이부분에서 SSR, SSG와 차이점이 나타남
    - HTML을 누르면, 값이 0으로 되어있음. 즉, 처음에는 초기 상태인 0으로 렌더링함

  
  NoSSR을 import하고 새로고침하면, 'window is not defined'라는 에러가 발생
    - 기본적으로 페이지에 포함되는 컴포넌트는 서버에서 렌더링 되어야 함. 하지만 서버는 window라는 객체를 모름
    - 따라서 next에서 window나 document와 같은 속성을 useEffect 밖에서 사용했을 때 에러메시지가 발생함
  
  SSR로 렌더링하고 싶지 않은 컴포넌트가 있을 경우 일반적인 import 문이 아닌, next/dynamic을 이용해서 import 해야함
  그리고 width 값은 서버에서 렌더링하지 않았기 떄문에 HTML에서 출력되지 않음
    
*/
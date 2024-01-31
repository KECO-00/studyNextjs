import type { NextPage } from 'next';

interface Props {
  data: number;
}

const Example: NextPage<Props> = ({ data }) => {
  return (
    <main>
      <h1>getStaticProps Page</h1>
      <p>값: {data}</p>
    </main>
  );
};

export default Example;

export async function getStaticProps() {
  const delayInSeconds = 2; //n초간 기다리라는 magic number
  const data = await new Promise((resolve) => // 실제 API를 mocking하기 위해서 Promise를 만들고
    setTimeout(() => resolve(Math.random()), delayInSeconds * 1000) // 2초 뒤에 Promise를 resolve하도록 mock API를 만듦
    // setTimeout(() => resolve(1), delayInSeconds * 1000) // 2초 뒤에 Promise를 resolve하도록 mock API를 만듦
  );

  return {  // page 컴포넌트의 prop으로 전달됨
    props: { data },
    revalidate: 5 /** https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration */,
  };
}


/*
 새로고침을 누르면 2초동안 pending 되다가 HTML이 업데이트 됨.
 HTML을 보면 이미 모든 값이 pre-rendering되었음을 알 수 있음
 단 새로고침마다 2초의 시간이 걸리고, random 함수가 실행되고 있음 --> 이건 원하는 SSG 방식이 아님

 SSG는 build time에 모든것을 pre-rendering하고, 정적으로 그 값이 바뀌지 않아야 하기 때문
 getStaticProps를 사용했는데도 계속 값이 바뀌는 이유는 현재 Next를 실행하고 있는 환경이 개발 환경이기 때문
 ** 개발환경에서는 매 요청마다 getStaticProps가 실행됨 **

 build를 하면 /section1/getStaticProps 페이지가 만들어졌으며, getStaticProps가 빌드타임에 실행되었기 때문에 2초 가량(2149ms)이 걸림
 production 서버를 실행하면, 새로고침을 해도 정적으로 생성된 값이 바뀌지 않음
 
 그리고 미리 pre-rendering된 HTML을 그대로 가져오는 것이기 때문에, 2초가 걸리지 않음(14ms) 
 HTML의 Header를 확인해보면 변하지 않는 정적 파일이므로 항상 캐시에 HIT하는 것을 확인할 수 있음 - X-Nextjs-Cache: HIT

 이런식으로 build Time에 API를 한번만 불러오고 배포된 이후에는 그 값이 변하지 않는다면, getStaticProps로 SSG 방식으로 렌더링하면 됨
 하지만 상황에 따라 API의 결과가 바뀌는 경우가 있을 수 있는데, 값이 바뀐다고 매번 사이트 전체를 새로 배포하는 것도 문제가 있고 이를 해결하기 위해 SSR 방식으로 대체하기에는 SSG의 장점을 포기하기 힘듦

 이를 해결하기 위해 Next에서는 revalidate 속성을 제공함
 revalidate는 Incremental Static Regeneration이라는 ISR 방식을 지원하기 위해 만든 속성임
 이 기능을 사용하여 이미 빌드가 완료된 사이트에서 주기적으로 정적인 페이지를 업데이트 할 수 있음
 해당 페이지만 업데이트하는 것이기 때문에, 전체 사이트를 다시 빌드할 필요가 없음

 revalidate를 5로 설정하면 5초동안 해당 값이 유지되다가, 일정 주기(약 7초)마다 값이 바뀌는 것을 확인할 수 있음
 
 document의 Header를 보면 캐시가 HIT된 상태를 확인할 수 있음
 즉, 기존에 렌더링된 값은 이미 캐시된 HTML 문서라는 것임
 근데 새로고침을 다시 누르면 값은 그대로이지만 캐시는 STALE 상태임을 확인할 수 있음 - x-nextjs-cache: STALE
 아까와 같이 HIT가 아니라 값은 STALE, 즉 fresh하지 않은 상태라는 것임

 이렇게 새로고침을 하면서 확인을 하면 5초동안 HIT가 유지되다가 2초동안 STALE이 보이는 것이 반복됨

 즉, revalidate: 5라는 것은 5초마다(서버가 request를 받은지 5초가 지난 후, 다시 request가 왔을 때마다) 새로운 값으로 다시 pre-rendering하라는 뜻임

 etag도 값이 유지되는 동안은 동일함(왜냐면 같은 pre-rendering된 HTML이니까)
 근데 값이 바뀌면 etag도 바뀌는 것을 확인할 수 있음

 실제로 서비스를 하는 경우, 데이터가 이렇게 자주 바뀌는 일은 적을 것임
 n 초 뒤에도 데이터가 같다면, Next는 캐시 상태는 HIT와 STALE로 바뀌지만, etag는 바뀌지 않음
 revalidate를 선언했어도, data가 바뀌지 않았으면 Next가 pre-rendering을 다시 수행하지 않는다는 것임

 getStaticProps를 활용하면 SSG와 ISR를 가장 효율적인 방식으로 사용할 수 있음

 */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Links() {

  const router = useRouter();
  useEffect(() => {
    router.prefetch('/section1/getStaticProps')
  },[router]);

  return (
    <main>
      <h1>Links</h1>
      <button 
        onClick={() => {
          router.push('/section1/getStaticProps');
        }}
      >
        /getStaticProps
      </button>
      
      

      {/* next/link로 라우팅하기 */}
      {/* <div style={{height: '200vh'}}/> */}
      {/* <Link 
        href="/section1/getStaticProps" 
        style={{color: 'skyblue'}}
        legacyBehavior // next v12
      >
        <a>/getStaticProps</a>
      </Link> */}
      {/* <Link href="/section1/getStaticProps" style={{color: 'skyblue'}}>move to /getStaticProps</Link> */}

    </main>
  );
}


/*

  <next/link>
  실행하고 Link를 눌러 이동하면, getSTaticProps.json이 계속해서 생김

  Next.js에서는 최초로 실행했을 때, 해당 페이지의 HTML을 불러옴
  하지만 페이지를 이동할 때는 추가적인 HTML을 가져오지 않음
  --> Network를 확인하면 getStaticProps 페이지에 관한 js 파일만 가져옴

  즉, 최초 실행은 SSG로 실행되지만, 페이지를 라우팅할 때는 CSR 방식으로 빠르게 이동함

  반대로, getStaticProps 페이지에서 새로고침을 하면, getStaticProps에 해당하는 HTML을 받아오고
  뒤로가기를 눌러도, Links 페이지에 해당하는 JS만 가져오고, HTML은 따로 불러오지 않음

  이렇게 next/link가 SSG와 CSR을 결합한 routing을 제공함

  a 태그를 활용해서 라우팅을 하면
  json 파일도 없고 getStaticProps js 파일도 없는 것을 볼 수 있음
  그리고 링크를 통해 이동하면 getStaticProps HTML을 새롭게 받아옴
  즉, CSR이 아니기 때문에 매번 페이지를 이동할 때마다 HTML을 받아와야 함

  반면 next/link를 사용하면 해당 페이지에 대한 정보를 자바스크립트 파일로 이미 가지고 있음
   >> CSR 방식으로 DOM을 렌더링 할 수 있음
  추가로 json 파일에 getStaticProps에 사용한 data가 저장되어 있는데, 그 값이 그대로 렌더링 됨
  즉, JS파일과 json을 결합하여 바로 DOM을 업데이트 할 수 있음
  >> CSR과 같은 방식으로 동작함
  최초의 한번만 HTML 파일을 가져오고, next 링크가 있는 곳은 JS와 json 파일로 해당 페이지에 대한 정보를 미리 가져와서 
  빠르게 CSR 방식으로 라우팅 가능
  + 페이지마다 HTML도 이미 pre-rendering 되어있기 때문에 SEO도 문제 없음

  높이가 200vh인 div를 추가했더니, 이번에는 페이지에 해당하는 JS와 json이 보이지 않음
    >> 스크롤을 내려서 next/link가 특정 영역에 나타나면 그때 가져옴
    >> 화면에 보이지 않을때는 가져오지 않다가, next/link를 누를 수 있을 때 lazy한 방식으로 파일을 가져옴
  Next는 이런 식으로 불필요한 네트워크 요청을 지양함

  elements 탭에서 next/link를 확인하면 next/link가 아닌 a태그로 자동으로 변환됨
  <Link>는 a 태그를 완전히 대체할 수 있기 때문에, 이 컴포넌트에 바로 스타일 적용 가능

  반면에 Link 안에 a 태그를 직접 넣게 되면 next에서 a를 제거하라는 에러메시지를 출력함
    >> Link legacyBehavior는 Next.js 12의 Next/link에 대한 설명임
    Link 태그에 legacyBehavior 속성을 추가하고, a 태그를 직접 넣으면 Next 버전 12의 링크처럼 작동함
      >> 이는 Next 12에서 link가 a 태그를 완전히 대체하지 않았기 때문에 직접 자식으로 a 태그를 넣는 것을 권장했었음
      >> + 그리고 링크가 a 태그가 아니기 때문에 스타일을 입혀도 작동하지 않았음. a 태그에 스타일을 입혀야 했었음
      >> 13버전에서는 a 태그를 없애고 바로 link를 사용하게 함
     
  Next는 모든 페이지에 대한 pre-rendering을 진행해서 SEO를 보장함과 동시에, next/link를 통해 CSR 방식으로 라우팅을 함으로써
  빠른 라우팅과 적은 네트워크 요청도 가능함


 <next/router>
 useRouter 훅을 호출하여, router.push 함수를 실행하게 함 
 >> 버튼 클릭 시 js와 json이 다운로드되면서 CSR 방식으로 라우팅 됨. 
 >> 이렇게 useRouter는 next/link를 대체할 수 있음

  하지만 next/link와 달리, 버튼이 바로 보인다고 해서 js와 json을 가져오는 것이 아님.
  >> next/link처럼 자동으로 prefetch하기 위해서는 개발자가 직접 코드를 구현해야 함.
  >> prefetch를 사용하고, 이동하고자 하는 URL을 파라미터로 넘기면 됨
  >> 그럼 json과 js 파일이 prefetch된 것을 볼 수 있음

  router.push가 아닌 router.replace로 routing을 하거나, query parameter를 바꿀 수도 있고, 현재 페이지의 query parameter를 이용하는 방법도 있음
 
  router는 prefetch를 해주지 않기 때문에, next/link 사용을 권장함
*/
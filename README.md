# Carrot Market
https://carrot-market-vert.vercel.app/enter

- Serverless Carrot Market Clone using NextJS , Tailwind , Prisma, PlanetScale and Cloudflare

## Code Challenge

~~### 1. API Redirect : Record로 한번만 적용 - 좋아요 main index표기문제 : front에서 해결, backend에서 가능할까?~~

~~### 2. useUser Hook 전체 적용~~

~~### 3. ChatRoom Model (Talk to Seller 기능구현)~~ - seller 와 buyer 설정

~~### 4. 물건 예약 버튼(누르면 예약내역 생성)~~

### 5. 거래 후기 버튼(예약날짜 지나면 채팅방에 생성)

~~### 6. Community 상세 페이지 static으로 refactoring~~

~~### 7. Item Like function 수정 : 초기버전으로 수정. 굳이 getStaticProps를 써야할 필요성 못느낌~~

어려웠던 점 : 클라이언트 단에서 활용하기 위해 함수들을 리팩토링하는 것이 어려웠다. 프론트에서 api에 post request 할 때마다 method, body, header등 설정할 것이 많아 중복되는 코드가 길어지는 것은 물론 오류가능성도 높았는데, 하나의 hook처럼간단하게 fn(“url”)만 작성해도 되는 방식으로 리팩토링하였다. 이런 사고방식을 이 프로젝트에 최대한 적용해야겠다고 생각해 재사용되는 코드는 최대한 component화 시키려고 했다. 그 결과 코드의 가독성이 상당히 올라가고 잘못된 접근에 대한 오류방지를 일괄적으로 적용시킬 수 있었다.

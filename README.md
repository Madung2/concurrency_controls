# Concurrency Controls
Studying various concurrency control methods using ypescript & asynchronous programming in Python
***





## 디렉토리 구조
src    
├── app.controller.spec.ts   
├── app.controller.ts   
├── app.module.ts   
├── app.service.ts   
├── database   
│   ├── database.module.ts   
│   ├── pointhistory.table.ts   
│   └── userpoint.table.ts   
├── main.ts   
├── point   
│   ├── point.controller.ts   
│   ├── point.dto.ts   
│   ├── point.model.ts   
│   ├── point.module.ts   
│   └── point.service.ts   
└── utils   
    └── requestqueue.ts   

## 엔티티와 모듈 구성
엔티티:  데이터베이스의 테이블과 매핑되는 클래스 PointHistoryTable과 UserPointTable이 여기에 해당
모듈: 애플리케이션의 구성 요소를 나누고 **의존성을 관리**하는 핵심 구성요소 database.module, point.module
    어플리케이션의 구조를 체계적으로 관리할 수 있다
모델: 어플리케이션 내에서 사용하는 데이터의 구조를 정의
DTO: 클라이언트에게 데ㅣ터를 전송할때 사용되는 객체 구조를 정의 주로 API요청의 본문에서 예상되는 데이터 구조를 정의


## 의존성 주입
객체가 필요로 하는 외부의 객체나 서비스를 직접 생성하지 않고 외부로부터 받아 사용하는 디자인 패턴, 객체간의 결합도를 낮춤, 코드재사용성업, 테스트 용이


## 동시성 처리
여러 사용자가 동시에 같은 포인트를 수정할 수 있다고 가정하면,  올바른 동시성 제어가 없으면 데이터의 무결성이 손상될 수 있다
- 낙관적 락: 데이터를 읽을 때 락을 걸지 않고 데이터를 업데이트 할 때만 데이터가 마지막으로 읽혔을때와 동일한지 확인
- 비관적 락: 데이터 수정 뿐 아니라 읽을 때부터 락을 거는 방법
- 데이터베이스 트랜젝션을 사용해 조회하고 업데이트 하는 과정 전체를 하나의 원자적 작업으로 만드릭
- 분산 락: Redis 등 외부 시스템을 사용해서 
    : 현재 Redis등 분산락 사용 어렵기 때문에 트랜젝션 구현하는 방법으로 진행할 예정

  
## 임계영역 Lock & Mutax
- 큐를 사용해서 요청 Promise를 관리하는 것의 한계: 큐 접근 자체가 동시성 에러를 뱉을 수 있다
- 다중 스레딩 환경에서 동시성을 관ㄹ니하게 위해 사용되는 동기화 매커니즘
- 뮤택스: 동시에 하난의 스레드만이 특정 섹션의 코드를 실행할 수 있도록 제한
- PYTHON에서는 threading 모듈을 임포트 해서 락을 실행할 수 있다


## 코드로 동시성 처리를 해야하는 현실적인 필요성
- 물리적으로 DB가 나눠져 있어서 롤백을 위한 트랜잭션부터 코드 개발이 필요할때
- 락은 사용하면서도 성능은 향상시키고 싶을때 데이터를 읽을 때는 락을 걸지 않고 데이터를 변경할때는 락을 사용하는 **낙관적 락** 사용 필요성 생김
- 낙관적 락은 db가 아닌 코드로 구현할 수밖에 없다
  
## 타입스크립트로 락 구현

## 추상화계층, 강결합, 서비스레이어, 트랜젝션레이어
서비스가 직접 Entity를 만나고 있는데 갑자기 DB가 바뀌면 유지보수가 어려울 수 있다.
이때 한단계 추상화를 거치면 변경 오염을 방지할 수 있다.
### 이점  
* 재사용성과 유지보수성 향상  
* 관심사의 분리 (서비스: 비즈니스 로직, 트랜젝션: 트랜젝션 관리)  
* 유연성 트랜젝션 관리 로직을 분리하면 트랜젝션 처리 방식을 변경 확장해야할 경우 서비스 로직에 영향을 주지 않고 독립적으로 수정가능  
### 단점  
* 코드 복잡성  



## 추가구현  
- 포인트 충전,이용 내역을 조회하는 history 기능을 작성하려면 charge와 use 함수에 history 업데이트가 포함되어야 한다   
- 특정유저의 포인트 충전 하는 기능을 하용하려면 기존 포인트를 db에서 불러온뒤 더해야함.   
- 마찬가지로 포인트 사용하려면 포인트를 db에서 불러온뒤 뺄셈을 한다.  
- 업데이트 된 값은 다시 insertOrUpdate 메서드를 사용해서 db 업데이트 필요  
- sumPoint는 음수가 안되도록 로직처리 필요  
- 임포트 절대경로를 상대경로로 수정  

## 예외처리
- 예외처리의 핵심 포인트는 유저에게 보여도 되는 에러인가 보이면 안되는 에러인가 확인
- 로그인 에러는 유저에게 보여야 하는 에러, DB 용량 에러등은 유저에게 보이면 안되는 에러
- 로직을 머리속에서 충분히 구상하는게 필요하다 화이트보드로 작동원리를 생각해보는 시간 필요
  
## 테스트 함수


## 테스트 실행
```npm run test:e2e```

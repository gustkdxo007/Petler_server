# Petler Project

## Petler

Pet + Butler = Petler, 애완동물과 집사를 합친 말입니다. 이름에서 느껴지듯이 이번 프로젝트는 반려동물을 키우는 사람들을 위한 서비스입니다. 반려동물을 혼자 키우기도 하지만 가정에서, 혹은 사무실에서 함께 키우기도 합니다. 함께 키우다 보면 반려동물이 밥은 먹었는지, 샤워는 했는지, 산책은 했는지 말해주지 않으면 알지 못합니다. 말하지 못하는 반려동물을 위한 서비스. 무엇을 했고, 누가 무엇을 해야 하는지 알 수 있다면 반려동물을 더 잘 케어할 수 있지 않을까? 라는 생각으로 프로젝트가 진행되었습니다. 약 4주간 진행된 프로젝트입니다.

## Role & Stack

> GraphQL / apollo-server-express / express / JWT / MySQL / sequelize / node-schedule / moment

GraphQL을 사용해 보기로 했습니다. 기존 REST API와는 다른 방식이어서 색달랐습니다. end-point가 1개이고 클라이언트에서 필요로 하는 데이터만을 요청할 수 있고, 필요한 데이터를 얻기 위해 여러 번의 요청을 보내지 않아도 된다는 장점이 있었습니다. 클라이언트 쪽에서도 GraphQL과 Apollo를 함께 사용하면 React life cycle을 크게 신경 쓰지 않아도 되고 Redux를 대체할 수 있다는 장점이 있었기 때문에 GraphQL과 Apollo로 프로젝트를 진행하기로 했습니다.

DB는 여러 관계와 조인이 필요했고 데이터들이 언제든 변경될 수 있기 때문에 MySQL을 사용하기로 했고 그에 따라 ORM은 sequelize를 사용했습니다. 사용자 인증을 위해서 JWT를, 알람과 반복 생성 등 시간에 따른 작업을 처리하기 위해서 node-schedule과 moment를 사용하였습니다. 저는 이번 프로젝트에서 Backend를 담당하였습니다.

## Task

### Server & DB 세팅

GraphQL로 시작하기 위해서 보통 graphql-yoga나 apollo-server를 많이 사용합니다. 두 가지다 빠르고 쉽게 GraphQL을 사용할 수 있게 해줍니다. 어떤 것들을 사용할지 알아보다가 apollo-server 2.0이 새롭게 출시되었고 많은 부분을 포함하고 있었고 더욱더 쉽고 강력하게 사용할 수 있었기 때문에 apollo-server를 선택해서 기본 서버를 세팅하였습니다. cors나 parse를 따로 해주지 않았는데 그 부분을 자동으로 처리해 줘서 간편하게 할 수 있었습니다. DB도 sequelize init으로 DB 연결에 필요한 부분을 자동으로 처리해 줍니다. 그에 맞는 데이터 타입을 정의해주고 각각에 맞는 관계를 설정하고 추가적인 연결을 통해 서버와 DB를 세팅하였습니다.

### GraphQL TypeDefs, Query, Mutation, Resolver 작성

GraphQL은 API를 쿼리 형태로 요청합니다. 클라이언트에서 필요한 데이터를 얻기 위해 쿼리를 요청해야 하는데 그걸 요청할 수 있게 서버에서 타입을 정의해줘야 합니다. 사용할 쿼리나 뮤테이션의 이름을 정의하고 어떤 값이 들어와야 하는지 데이터 타입을 정의해줍니다. 그렇게 하면 클라이언트에서는 정의된 쿼리로 원하는 데이터 값만을 요청할 수 있습니다. 그러나 아직은 타입 정의만 했기 때문에 원하는 데이터를 얻을 수 없습니다. 쿼리나 뮤테이션을 요청했을 때 그에 맞는 데이터를 주기 위한 resolver를 함수로 작성해줘야 합니다.

Query는 GET과 같은 개념이라고 생각하면 됩니다. 원하는 데이터를 필터링하고 Read 하기 위한 작업을 요청합니다. Mutation은 POST와 같은 개념입니다. Create, Update, Delete와 같은 작업을 하기 위한 요청을 처리합니다.

처음에는 GraphQL을 잘 이해하지 못하고 Query를 작성했습니다. 유저가 있으면 그 유저가 속해있는 채널 정보를 알 수 있어야 하고 그 하위의 펫 정보를 알 수 있어야 하고 그 펫에 할당된 todo를 알 수 있어야 하는 그런 구조로 작성되어야 했습니다. 그러나 resolver에서 return을 할 때 원하는 값을 억지로 넣어 주었기 때문에 그런 흉내만을 내는 함수를 작성한 것입니다. 처음에는 그렇게 사용하는 줄 알았습니다. 그러나 쿼리를 하나둘 추가하면서 뭔가 이상하다는 것을 느꼈습니다. 다시 알아본 결과 잘못된 방식으로 진행했다는 것을 깨달았고 새롭게 쿼리를 작성해줬습니다. Root 쿼리를 따로 정의하고 그 하위에서 요청할 수 있는 쿼리를 작성해줘야 했습니다. 상위로부터 내려오는 값은 함수의 첫 번째 인자로 들어갔고 그에 맞는 resolver를 작성하여 올바른 방법으로 진행할 수 있었습니다.

### Subscription을 이용한 실시간 통신

GraphQL에는 Query, Mutation과 같은 Subscription 타입이 존재합니다. 우리가 구독하기를 누르고 새로운 업데이트가 있을 때마다 그에 대한 정보를 실시간으로 얻는 것처럼 GraphQL에서 실시간 통신을 하기 위한 방법이 Subscription입니다. Apollo-server에서 제공하는 Pubsub을 이용해 구현할 수 있었습니다. TypeDefs에 Subscription에 관한 타입을 정의해주고 resolver에는 그에 맞는 함수를 아래와 같이 작성해주면 됩니다.

```javascript
Subscription: {
  todo: {
    subscribe: withFilter(
      () => {
        return pubsub.asyncIterator("TODO");
      },
      (payload, variables) => {
        return `${payload.todo.channel_id}` === variables.channel_id;
      },
    );
  }
}
```

asyncIterator의 인자로 무엇을 subscription 할 것인지 받습니다. 우리는 각 채널에서 그 채널에 존재하는 todo의 변화를 알기 원했습니다. 그래서 withFilter를 사용하여 각 채널에 맞는 todo의 변화만을 실시간으로 전달해 주었습니다. payload에는 withFilter의 첫 번째 인자의 함수 return 값이 들어가고 variables는 클라이언트에서 보내주는 변수 값이 들어갑니다. 서버에서 각 채널의 변화를 필터링해서 전달하도록 합니다.

```javascript
pubsub.publish("TODO", {
  todo: {
    mutation: "CREATE_TODO",
    data: todo,
    channel_id: todo.channel_id,
  },
});
```

Subscription을 필요로 하는 resolver 함수에 위와 같은 내용을 추가합니다. 첫 번째 인자에는 asyncIterator의 인자와 동일한 값을 전달하고 두 번째 인자에는 return 할 값을 할당합니다. 이와 같은 방법으로 간단하게 실시간 통신을 할 수 있습니다.

### 반복 todo update

todo에 반복설정을 할 수 있게 했습니다. 반복된 todo를 작성하기 위한 몇 가지 대안이 있었습니다. 첫 번째는 매일 반복되는 데이터를 새로 생성하는 것. 두 번째는 기존의 todo를 새로운 todo로 업데이트하는 것입니다. 첫 번째 방법은 기존의 todo를 유지할 수 있다는 장점이 있었지만, 날이 지날수록 같은 todo가 제곱으로 생성되는 단점이 있었습니다. 그리고 해당 todo의 변경이 일어나면 같이 변경되어야 하는데 그걸 처리하는 데 어려움이 있었습니다. 두 번째 방법은 하나의 todo를 계속 처음의 상태로 업데이트하면 되기 때문에 변경에 대한 처리는 문제가 없었지만, 이전 todo에 대한 기록이 남지 않는다는 문제가 있었습니다. 변경 전 todo에 대한 기록은 중요하지 않다고 판단해 두 번째 방법으로 진행하였습니다.

매일 자정에 반복 설정된 todo를 새로 업데이트해주는 작업이 필요했습니다. node-schedule을 이용해 매일 자정에 작업하도록 설정해 주었고 DB에서 반복 요일에 현재 요일의 값을 포함하는 데이터를 찾아 처음 todo의 상태로 업데이트해주었습니다.

```javascript
const weeks = ["일", "월", "화", "수", "목", "금", "토"];
const today = weeks[moment().day()]; // 오늘의 요일을 나타냅니다.

const todo = await models.todo.findAll({
  where: { repeat_day: { [Op.like]: `%${today}$` } }, // 오늘의 요일을 포함하는 데이터를 찾습니다.
});

// 조건에 맞는 데이터를 처음의 상태로 update 해줍니다.
```

### 미리 알림, 담당 집사 설정 시 푸시 알림을 위한 환경 설정

todo를 생성할 때 담당 집사를 선택할 수 있고 미리 알림 시간을 설정할 수 있습니다. 담당 집사가 선택되면 해당 유저에게 할당된 todo의 내용을 알려야 하고 설정된 알림 시간에 푸시 알림을 해야 합니다. 담당 집사 알람은 담당 되면 바로 알람을 주면 되기 때문에 간단했는데 미리 알림은 정해진 시간이 있었기 때문에 약간 까다로웠습니다. 처음에는 매번 전체 DB를 탐색해야 하나 싶었습니다. 데이터가 작으면 상관없지만 많아진다면 매번 전체 DB를 탐색하는 것은 효율적이지 않은 방법이었습니다. 서버 부하도 엄청날 것 같았습니다. 그래서 미리 알림 값이 입력되면 node-schedule로 입력된 시간에 원하는 작업을 하게 해 주었습니다. 새로 생성할 때는 괜찮았는데 문제는 todo가 업데이트되거나 삭제될 때였습니다. 기존에 설정된 것을 취소해야 하는데 그 방법을 찾는 데 애를 먹었습니다. 검색 결과 sheduleJob의 첫 번째 인자로 해당 작업의 이름(변수)을 지정할 수 있었고 업데이트나 삭제가 될 때 그 작업을 취소시킴으로 문제를 해결할 수 있었습니다.


##### [프로젝트 시연 영상] (https://youtu.be/lmU50uzUneI)

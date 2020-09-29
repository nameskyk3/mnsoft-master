
# UI 개발자 가이드 
본 문서는 UI 개발시 필요한 다양한 규칙에 대한 가이드를 포함 하고 있습니다.
해당 문서에서 가이드 하는 내용은 반드시 준수해야 하는것은 아니지만, 가급적 지켜주셨으면 하는 바램이 있습니다.

## Java 코드 스타일
### Style file
  - https://github.com/google/styleguide/blob/gh-pages/intellij-java-google-style.xml
### 적용방법
  - https://jiyeonseo.github.io/2016/11/15/setting-java-google-style-to-intellij/

## ECMAScript6 스타일 가이드
### 1. 참조형 변수는 const를 사용 하여 선언
  - 참조를 다시 할당할 수 없어서, 버그로 연결 되거나 이해할 수 없는 코드가 되는것을 예방
```
// bad
var a = 1;
var b = 2;

// good
const a = 1;
const b = 2;
```
### 2. 가급적 var는 사용하지 않고, const/let을 사용 하자
  - var는 함수범위 (function-scoped) const/let 은 블록범위(block-scoped)이기 때문. 뭐든지 가까운게 좋은법이다.
```
// bad
var count = 1;
if (true) {
  count += 1;
}

// good, use the let.
let count = 1;
if (true) {
  count += 1;
}
```
### 3. 객체 선언 시, 리터럴 구문을 사용
```
// bad
const item = new Object();

// good
const item = {};
```
### 4. 매소드에 단축 구문 (Object Shorthand) 사용
```
// bad
const atom = {
  value: 1,

  addValue: function (value) {
    return atom.value + value;
  },
};

// good
const atom = {
  value: 1,

  addValue(value) {
    return atom.value + value;
  },
};
```
### 5. 속성에 단축 구문 (Object Concise) 사용
```
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  lukeSkywalker: lukeSkywalker,
};

// good
const obj = {
  lukeSkywalker,
};
```
### 6. 속성명에는 따옴표, 작은따옴표를 붙이지 말자
  - 일반적인 단어에는 사용하지 말고, 잘못된 식별자 구문(~~그냥 쓰면 에러 나는것~~)에만 사용하자
```
// bad
const bad = {
  'foo': 3,
  'bar': 4,
  'data-blah': 5,
};

// good
const good = {
  foo: 3,
  bar: 4,
  'data-blah': 5,
};
```
### 7. 배열 선언 시, 리터럴 구문 사용
```
// bad
const items = new Array();

// good
const items = [];
```
### 8. 배열 복사는 배열의 확장 연산자인 ...를 사용
```
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i $lt; len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```
### 9. 구조화 대입 (Destructuring) 사용
```
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// good
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```
```
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```
### 10. 여러 값을 반환 하는 경우, 객체의 구조화 대입을 사용
```
// bad
function processInput(input) {
  // 그러면 기적이 일어난다
  return [left, right, top, bottom];
}

// 호출자에 반환되는 데이터의 순서를 고려해야 함
const [left, __, top] = processInput(input);

// good
function processInput(input) {
  // 그러면 기적이 일어난다
  return { left, right, top, bottom };
}

// 호출하면서 필요한 데이터만 선택할 수 있음
const { left, right } = processInput(input);
```

### 11. 프로그램으로 문자열을 생성하는 경우, 템플릿 문자열 (Template Strings)을 사용
```
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// bad
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```
### 12. 함수의 매개변수를 조작하지 말고, 기본 매개변수(Default Parameters)를 사용
```
// really bad
function handleThings(opts) {
  // 만약 opts가 falsy 인 경우는 바란대로 객체가 설정됩니다. 
  // 그러나 미묘한 버그를 일으키는 원인이 될수도 있습니다. 
  opts = opts || {};
  // ...
}

// still bad
function handleThings(opts) {
  if (opts === void 0) {
    opts = {};
  }
  // ...
}

// good
function handleThings(opts = {}) {
  // ...
}
```
### 13. 함수의 기본 매개변수는 앞쪽에 배치
```
// bad
function handleThings(opts = {}, name) {
  // ...
}

// good
function handleThings(name, opts = {}) {
  // ...
}
```
### 14. 절대로 매개변수를 건들지 않는다
```
// bad
function f1(obj) {
  obj.key = 1;
};

// good
function f2(obj) {
  const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
};
```
```
// bad
function f1(a) {
  a = 1;
}

function f2(a) {
  if (!a) { a = 1; }
}

// good
function f3(a) {
  const b = a || 1;
}

function f4(a = 1) {
}
```

## Vue 컴포넌트 스타일 가이드
### 1. 모듈 기반 개발
  - 한가지 일만 해야 한다.
  - FIRST (Focused, Independent, Reusable, Small, Testable)
  
### 2. 명명법
  - 의미있고, 짦고(2~3단어), 발음 가능해야 한다.
  - 하이픈을 포함하고, 예약어를 사용하면 안된다.
```
<!-- 권장합니다 -->
<app-header></app-header>
<user-list></user-list>
<range-slider></range-slider>

<!-- 피하세요! -->
<btn-group></btn-group> <!-- 짧지만 발음할 수 없습니다. `button-group`으로 사용하는 것이 좋습니다. -->
<ui-slider></ui-slider> <!-- 모든 컴포넌트는 UI 엘리먼트이기 때문에 의미가 없습니다. -->
<slider></slider> <!-- 사용자 정의 엘리먼트 스펙을 준수하지 않았습니다. -->
```

### 3. 컴포넌트 표현식을 단순하게 사용
```
<!-- 권장합니다 -->
<template>
	<h1>
		{ { `${year}-${month}` } }
	</h1>
</template>
<script type="text/javascript">
  export default {
    computed: {
      month() {
        return this.twoDigits((new Date()).getUTCMonth() + 1);
      },
      year() {
        return (new Date()).getUTCFullYear();
      }
    },
    methods: {
      twoDigits(num) {
        return ('0' + num).slice(-2);
      }
    },
  };
</script>

<!-- 피하세요! -->
<template>
	<h1>
		{ { `${(new Date()).getUTCFullYear()}-${('0' + ((new Date()).getUTCMonth()+1)).slice(-2)}` } }
	</h1>
</template>
```

### 4. 컴포넌트의 props를 원시 자료형으로 사용
  - 복잡한 Object 형태로 전달 하지 않는다.
  - JavaScript 원시 값 (string, number, boolean) 을 사용하여 명확하게 선언
```
<!-- 권장합니다 -->
<range-slider
  :values="[10, 20]"
  min="0"
  max="100"
  step="5"
  :on-slide="updateInputs"
  :on-end="updateResults">
</range-slider>

<!-- 피하세요! -->
<range-slider :config="complexConfigObject"></range-slider>
```

### 5. 컴포넌트 props 선언 시, 방어적 프로그래밍을 도입
  - prop에 기본 값을 사용
  - type 옵션 사용
```
<template>
  <input type="range" v-model="value" :max="max" :min="min">
</template>
<script type="text/javascript">
  export default {
    props: {
      max: {
        type: Number, // [1*] 'max' prop은 Number로만 사용할 수 있습니다.
        default() { return 10; },
      },
      min: {
        type: Number,
        default() { return 0; },
      },
      value: {
        type: Number,
        default() { return 4; },
      },
    },
  };
</script>
```

### 6. 컴포넌트 구조
```
<template lang="html">
	<div class="Ranger__Wrapper">
		<!-- ... -->
	</div>
</template>

<script type="text/javascript">
  export default {
    // 이름 적는 것을 잊지마세요
    name: 'RangeSlider',
    // compose new components
    extends: {},
    // 컴포넌트 어트리뷰트 그룹
    props: {
        bar: {}, // 알파벳순으로 정렬합니다
        foo: {},
        fooBar: {},
    },
    // 컴포넌트 변수 그룹
    data() {},
    computed: {},
    // 컴포넌트가 다른 컴포넌트를 사용할 경우
    components: {},
    // 컴포넌트 메서드 그룹
    watch: {},
    methods: {},
    // 컴포넌트 라이프사이클 메서드 그룹
    beforeCreate() {},
    mounted() {},
};
</script>

<style scoped>
  .Ranger__Wrapper { /* ... */ }
</style>
```

### 7. 컴포넌트 이벤트 이름
  - kebab-cased (하이픈으로 구분)
  - 부정사의 행태 (client-api-load) 혹은 명사에서 동사로 끝나야 함(drive-upload-success)
  
### 8. this.$parent 피하기
  - component 에서 부모의 컨텍스트를 직접 접근 하는것은 FIRST 규칙을 위반
  - attribute/property를 이용하여 부모->자식으로 값을 전달
  - attribute/property에서 callback을 사용하여 부모에서 정의된 method를 child 로 전달
  - child 에서 이벤트를 emit 하여 parent 컴포넌트로 전달
  
### 9. this.$refs를 주의하여 사용하기
```
<!-- 좋아요, ref를 사용하지 않아도 됩니다 -->
<range :max="max"
  :min="min"
  @current-value="currentValue"
  :step="1"></range>
```

```
<!-- this.$refs를 사용하는 좋은 예제 입니다 -->
<modal ref="basicModal">
  <h4>Basic Modal</h4>
  <button class="primary" @click="$refs.basicModal.close()">Close</button>
</modal>
<button @click="$refs.basicModal.open()">Open modal</button>

<!-- Modal 컴포넌트 -->
<template>
  <div v-show="active">
    <!-- ... -->
  </div>
</template>

<script>
  export default {
    // ...
    data() {
        return {
            active: false,
        };
    },
    methods: {
      open() {
      	this.active = true;
      },
      hide() {
      	this.active = false;
      },
    },
    // ...
  };
</script>
```

```
<!-- `emit`으로 처리할 수 있다면 피하세요! -->
<template>
  <range :max="max"
    :min="min"
    ref="range"
    :step="1"></range>
</template>

<script>
  export default {
    // ...
    methods: {
      getRangeCurrentValue() {
      	return this.$refs.range.currentValue;
      },
    },
    // ...
  };
</script>
```

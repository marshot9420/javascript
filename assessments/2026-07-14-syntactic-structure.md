# 2026-07-14 JavaScript의 문법 구조

ECMAScript의 문법 구조는 소스 코드가 어떤 단위로 구성되고, 그 단위들이 어떤 형태로 결합되어 유효한 코드가 되는지를 정의한다.

가장 기본적인 관계는 다음과 같다.

```txt
소스 코드
→ 어휘 문법에 따라 토큰으로 구분
→ 토큰이 구문 문법에 따라 결합
→ 표현식, 문, 선언 등의 문법 구조 형성
```

예를 들어 다음 코드가 있다.

```js
const result = 10 + 20;
```

어휘 문법의 관점에서는 다음과 같은 토큰으로 나뉜다.

```txt
const
result
=
10
+
20
;
```

구문 문법의 관점에서는 다음과 같은 구조가 된다.

```txt
const 선언
├─ 바인딩 식별자: result
└─ 초기화 표현식
   └─ 덧셈 표현식
      ├─ 숫자 리터럴: 10
      └─ 숫자 리터럴: 20
```

ECMAScript의 문법은 단순히 코드의 모양만 정의하지 않는다. 문법 생산식으로 만들어진 구조에 정적 의미 규칙과 Early Error 규칙을 적용하여 실제로 허용되는 코드인지 판별한다.

---

## 1.1.1 어휘 문법

어휘 문법은 소스 텍스트의 문자들을 ECMAScript 구문 문법이 사용할 입력 요소와 토큰으로 구분하는 규칙이다.

```txt
소스 텍스트
├─ 공백
├─ 줄 종결자
├─ 주석
└─ 토큰
```

공백과 주석은 보통 구문 문법에 전달되지 않는다. 다만 줄 종결자는 토큰은 아니지만, 세미콜론 자동 삽입이나 `[no LineTerminator here]` 제약에 영향을 준다. 여러 줄 주석 안에 줄 종결자가 포함된 경우에도 구문 문법에는 줄 종결자가 존재하는 것처럼 반영된다.

```js
const value = 10;
```

다음 공백들은 토큰 사이를 구분하지만 그 자체가 일반적인 ECMAScript 토큰은 아니다.

```txt
const[공백]value[공백]=[공백]10;
```

반면 다음은 모두 토큰이다.

```txt
const
value
=
10
;
```

### 토큰

토큰은 구문 문법이 하나의 단위로 취급하는 입력 요소다.

ECMAScript 토큰은 크게 다음과 같이 구분할 수 있다.

```txt
토큰
├─ 예약어
├─ 식별자 이름
├─ 리터럴 관련 토큰
├─ 구두점
└─ 템플릿 관련 토큰
```

명세상 구문 문법은 어휘 문법이 만들어 낸 토큰들을 단말 기호로 사용한다. 공백과 주석을 제외한 입력 요소가 구문 문법의 단말 기호가 되며, 예약어·식별자·리터럴·구두점 등이 ECMAScript 토큰에 해당한다.

#### 토큰은 문자 한 개와 같지 않다

```js
const
```

`const`는 다섯 개의 문자로 구성되지만 하나의 토큰이다.

```js
123.45;
```

`123.45`도 여러 문자로 구성되지만 하나의 숫자 리터럴 토큰이다.

```js
===
```

`===` 역시 세 문자가 아니라 하나의 구두점 토큰으로 인식된다.

#### 가장 긴 토큰 우선

어휘 분석에서는 현재 위치에서 만들 수 있는 토큰 중 가능한 한 긴 토큰을 선택한다.

```js
value === other;
```

이는 다음처럼 분리되지 않는다.

```txt
==
=
```

하나의 `===` 토큰으로 인식된다.

마찬가지로 다음 코드의 `++`도 두 개의 `+` 토큰이 아니라 하나의 증가 연산자용 토큰이다.

```js
count++;
```

#### 문맥에 따라 달라지는 토큰화

일부 문자는 주변 구문 문맥에 따라 다른 종류의 토큰이 될 수 있다.

```js
left / right;
```

여기서 `/`는 나눗셈 구두점이다.

```js
const pattern = /hello/g;
```

여기서 `/hello/g`는 정규 표현식 리터럴이다.

ECMAScript 명세는 여러 어휘 목표 기호를 사용하여 현재 구문 위치에서 `/`를 나눗셈으로 볼지 정규 표현식 리터럴의 시작으로 볼지 구별한다. 이 때문에 토큰화는 모든 문자를 완전히 독립적으로 자르는 단순 작업으로만 볼 수 없다.

---

### 식별자

식별자는 변수, 함수, 클래스, 매개변수, 레이블 등의 이름으로 사용되는 문법 요소다.

```js
const userName = "Mars";

function calculateTotal(price, quantity) {
  return price * quantity;
}

class Product {}
```

여기서 이름으로 사용된 요소는 다음과 같다.

```txt
userName
calculateTotal
price
quantity
Product
```

다만 소스 코드에서 식별자처럼 생긴 모든 이름이 같은 역할을 하는 것은 아니다.

#### IdentifierName

`IdentifierName`은 식별자 형태를 가진 가장 넓은 어휘 문법상의 이름이다.

```js
value
userName
calculateTotal
class
return
await
```

`class`와 `return`도 문자 형태만 보면 `IdentifierName`에 해당한다. 그러나 예약어이므로 일반적인 변수 이름인 `Identifier`로 사용할 수 없다.

```js
const class = 10; // SyntaxError
```

따라서 관계는 다음과 같다.

```txt
IdentifierName
├─ 실제 식별자로 사용할 수 있는 이름
└─ 키워드·예약어라서 식별자로 사용할 수 없는 이름
```

명세상 `Identifier`는 대략 `IdentifierName` 중 `ReservedWord`가 아닌 것으로 정의된다. `await`와 `yield`처럼 문맥에 따라 허용 여부가 달라지는 이름에는 추가 문법 매개변수와 Early Error 규칙이 적용된다.

#### IdentifierReference

기존 바인딩을 이름으로 참조하는 식별자다.

```js
const count = 10;

console.log(count);
```

두 번째 `count`는 `count`라는 바인딩을 찾는 `IdentifierReference`다.

```txt
count라는 이름 확인
→ 현재 환경에서 바인딩 탐색
→ 바인딩에 연결된 값 사용
```

식별자 참조를 평가한 명세상의 직접 결과는 단순 값이 아니라 `Reference` 타입의 명세 레코드다. 이후 필요한 위치에서 `GetValue`를 통해 실제 값을 가져온다.

#### BindingIdentifier

새로운 바인딩의 이름을 정의하는 식별자다.

```js
const count = 10;
```

여기서 `count`는 바인딩 식별자다.

```js
function double(value) {
  return value * 2;
}
```

여기서는 다음 이름들이 바인딩을 만든다.

```txt
double
value
```

바인딩 식별자는 다음과 같은 위치에서 사용된다.

```txt
변수 선언의 이름
함수 선언의 이름
클래스 선언의 이름
함수 매개변수
catch 매개변수
구조 분해 바인딩의 이름
```

#### LabelIdentifier

레이블의 이름 또는 `break`, `continue`가 참조하는 레이블 이름이다.

```js
outer: for (const row of rows) {
  for (const item of row) {
    if (item === target) {
      break outer;
    }
  }
}
```

여기서 `outer`는 변수 바인딩이 아니라 레이블 식별자다.

#### 프로퍼티 이름과 식별자의 차이

다음 코드에서 두 `name`은 동일한 방식으로 해석되지 않는다.

```js
const name = "outside";

const user = {
  name: "Mars",
};

console.log(user.name);
```

```txt
첫 번째 name   변수 바인딩 이름
객체의 name    프로퍼티 이름
user.name의 name
               정적으로 지정된 프로퍼티 키
```

`user.name`의 `name`은 현재 환경에서 `name`이라는 변수를 찾지 않는다. `user` 객체의 `"name"` 프로퍼티를 찾는다.

그래서 예약어도 프로퍼티 이름으로 사용할 수 있다.

```js
const object = {
  class: "A",
  return: "B",
};

console.log(object.class);
console.log(object.return);
```

#### PrivateIdentifier

클래스의 private 요소를 나타내는 이름이다.

```js
class Counter {
  #count = 0;

  increment() {
    this.#count++;
  }
}
```

`#count`는 일반 식별자나 문자열 프로퍼티 키가 아니라 `PrivateIdentifier`다. 명세상 `#`와 `IdentifierName`이 결합한 별도의 어휘 요소로 정의된다.

---

### 키워드

키워드는 ECMAScript 문법에서 특별한 역할을 수행하는 단어다.

```txt
break
case
catch
class
const
continue
debugger
default
delete
do
else
export
extends
finally
for
function
if
import
in
instanceof
new
return
super
switch
this
throw
try
typeof
var
void
while
with
yield
```

예를 들어 `if`는 조건문을 시작하고, `return`은 함수 실행을 종료하며, `class`는 클래스 문법을 시작한다.

```js
if (condition) {
  return value;
}
```

#### 키워드와 예약어

키워드와 예약어는 완전히 같은 말이 아니다.

```txt
키워드
문법에서 실제 기능을 수행하는 특별한 단어

예약어
식별자로 사용할 수 없도록 예약된 단어
```

많은 키워드는 예약어이지만, 문맥에 따라 특별한 의미를 가지면서도 항상 예약되지는 않는 단어도 있다.

예를 들어 `async`는 항상 예약된 단어가 아니다.

```js
const async = 10;
```

하지만 다음 문맥에서는 비동기 함수를 나타내는 특별한 문법 요소로 사용된다.

```js
async function load() {}
```

`await`와 `yield`는 현재 코드가 모듈인지, 비동기 함수 내부인지, 제너레이터 함수 내부인지 등에 따라 식별자로 사용할 수 있는지가 달라진다. `if`, `while` 등의 단어는 항상 예약되지만 `await`와 `yield`에는 문맥적 제약이 적용된다.

#### 문맥적 키워드

문맥적 키워드는 특정 문법 위치에서만 특별한 의미를 갖는 단어다.

```js
for (const item of items) {
}
```

여기서 `of`는 `for-of` 문법을 구성한다.

```js
import { value as renamed } from "./module.js";
```

여기서 `as`와 `from`은 모듈 문법 안에서 특별한 역할을 한다.

```js
class Example {
  static create() {}

  get value() {
    return 10;
  }

  set value(nextValue) {}
}
```

여기서 `static`, `get`, `set`도 해당 문법 위치에서 특별한 의미를 갖는다.

이러한 단어들을 모두 언제나 사용할 수 없는 예약어로 생각하면 안 된다. 실제 허용 여부와 의미는 해당 단어가 놓인 문법 문맥에 의해 결정된다.

---

### 리터럴

리터럴은 값을 소스 코드에 직접 나타내는 문법적 표기다.

```js
null;
true;
false;
10;
3.14;
10n;
("hello");
```

리터럴은 코드에 적힌 표기이고, 값은 그 리터럴을 평가하여 얻는 런타임 데이터다.

```txt
코드의 `10`   숫자 리터럴
평가 결과     숫자 값 10
```

다음 두 표현식은 모두 숫자 값 `10`을 만들지만 문법 구조는 다르다.

```js
10;
```

숫자 리터럴이다.

```js
5 + 5;
```

덧셈 표현식이다. 표현식 전체는 리터럴이 아니다.

#### Null 리터럴

```js
null;
```

`null` 값을 직접 나타낸다.

`null`은 리터럴이지만 다음의 `undefined`는 리터럴이 아니다.

```js
undefined;
```

`undefined`는 `undefined`라는 이름을 참조하는 식별자 참조다.

#### 불리언 리터럴

```js
true;
false;
```

각각 불리언 값 `true`와 `false`를 나타낸다.

#### 숫자 리터럴

```js
10;
3.14;
1e3;
0b1010;
0o12;
0xff;
```

숫자 리터럴은 십진수뿐 아니라 2진수, 8진수, 16진수 표기를 지원한다.

```js
1_000_000;
```

숫자 구분자 `_`를 사용할 수도 있다.

#### BigInt 리터럴

```js
10n;
0xffn;
```

끝의 `n`은 해당 리터럴이 Number가 아니라 BigInt 값을 나타낸다는 뜻이다.

#### 문자열 리터럴

```js
"hello";
"hello";
```

큰따옴표와 작은따옴표를 사용할 수 있다.

```js
"line\nbreak";
```

이스케이프 시퀀스를 통해 소스에 직접 적기 어려운 문자를 표현할 수 있다.

#### 정규 표현식 리터럴

```js
/hello/gi;
```

정규 표현식의 패턴과 플래그를 소스 코드에 직접 나타낸다.

정규 표현식 리터럴은 어휘 문법에서 하나의 특별한 토큰으로 인식되지만, 표현식 문법에서는 기본 표현식의 한 형태로 사용된다.

#### 템플릿 리터럴

```js
`hello`;
```

문자열과 비슷한 값을 만들 수 있다.

```js
`Hello, ${name}`;
```

`${...}` 안에 표현식을 포함할 수도 있다.

템플릿 리터럴 전체는 단순한 하나의 문자열 리터럴 토큰으로만 구성되지 않는다. 정적 문자열 부분과 표현식 부분을 구분하기 위한 여러 템플릿 관련 어휘 요소가 사용된다.

#### 배열·객체 리터럴과 어휘 문법상의 리터럴

다음은 배열 리터럴과 객체 리터럴이라고 부른다.

```js
[1, 2, 3];
```

```js
{
  name: "Mars",
}
```

그러나 이들은 각각 하나의 어휘 토큰이 아니다.

```txt
배열 리터럴
[
1
,
2
,
3
]

객체 리터럴
{
name
:
"Mars"
}
```

여러 토큰이 표현식 문법에 따라 결합된 구문 구조다.

명세의 기본 표현식 문법에서도 `Literal`, `ArrayLiteral`, `ObjectLiteral`, `RegularExpressionLiteral`, `TemplateLiteral`은 서로 구별된 항목으로 나타난다. 명세상 좁은 `Literal` 범주는 `null`, 불리언, 숫자, 문자열 리터럴로 구성된다.

```txt
좁은 명세상 Literal
├─ NullLiteral
├─ BooleanLiteral
├─ NumericLiteral
└─ StringLiteral

이름에 리터럴이 들어가는 다른 표현식
├─ ArrayLiteral
├─ ObjectLiteral
├─ RegularExpressionLiteral
└─ TemplateLiteral
```

---

## 1.1.2 표현식

표현식은 평가되는 코드 구조다.

표현식을 평가하면 문법 형태에 따라 다음과 같은 결과가 만들어질 수 있다.

```txt
ECMAScript 값
Reference
함수나 클래스 객체
평가 중 발생한 abrupt completion
```

일반적으로는 “값을 만들어 내는 코드”라고 설명할 수 있지만, 식별자 참조나 프로퍼티 접근 표현식은 명세상 먼저 `Reference`를 만들 수 있으므로 “항상 곧바로 값만 만든다”라고 정의하면 지나치게 단순하다.

```js
10;
```

숫자 리터럴 표현식이다.

```js
first + second;
```

덧셈 표현식이다.

```js
user.name;
```

프로퍼티 접근 표현식이다.

```js
calculate();
```

호출 표현식이다.

```js
result = 10;
```

할당 표현식이다.

### 표현식은 다른 표현식의 일부가 될 수 있다

```js
calculate(price * quantity + shippingFee);
```

구조는 다음과 같다.

```txt
호출 표현식
├─ 호출 대상 표현식
│  └─ calculate
└─ 인수 표현식
   └─ 덧셈 표현식
      ├─ 곱셈 표현식
      │  ├─ price
      │  └─ quantity
      └─ shippingFee
```

표현식은 재귀적으로 다른 표현식을 포함하며 더 큰 표현식을 만든다.

### 기본 표현식

표현식의 가장 기초가 되는 형태다.

```js
this
value
10
"hello"
[1, 2]
{ name: "Mars" }
function () {}
class {}
```

대표적으로 다음이 포함된다.

```txt
this
식별자 참조
리터럴
배열 리터럴
객체 리터럴
함수 표현식
클래스 표현식
정규 표현식 리터럴
템플릿 리터럴
괄호로 묶인 표현식
```

명세의 `PrimaryExpression`에도 이러한 표현들이 기본 표현식 형태로 열거되어 있다.

### 왼쪽 값 표현식

호출, 생성, 멤버 접근 등 표현식 계층의 왼쪽 부분을 이루는 표현이다.

```js
user.name;
user["name"];
createUser();
new User();
```

대표적으로 다음이 포함된다.

```txt
프로퍼티 접근
optional chaining
함수 호출
메서드 호출
new 호출
tagged template
```

### 갱신 표현식

```js
count++;
count--;
++count;
--count;
```

피연산자의 값을 변경하고 값을 결과로 만든다.

전위와 후위는 결과값이 다르다.

```js
let count = 1;

const first = count++; // first: 1, count: 2
const second = ++count; // second: 3, count: 3
```

### 단항 표현식

하나의 피연산자를 사용하는 표현식이다.

```js
!value + value - value;
typeof value;
void value;
delete object.key;
```

### 산술 표현식

```js
left ** right;
left * right;
left / right;
left % right;
left + right;
left - right;
```

### 비트 표현식

```js
value << 1;
value >> 1;
value >>> 1;

left & right;
left ^ right;
left | right;
```

### 관계·동등성 표현식

```js
left < right;
left <= right;
left > right;
left >= right;

key in object;
value instanceof Constructor;

left == right;
left != right;
left === right;
left !== right;
```

### 논리 표현식

```js
left && right;
left || right;
left ?? right;
```

논리 연산자는 항상 양쪽 피연산자를 모두 평가하지 않는다.

```js
false && run();
true || run();
value ?? fallback;
```

왼쪽 피연산자의 결과에 따라 오른쪽 표현식의 평가 여부가 결정된다.

### 조건 표현식

```js
condition ? whenTrue : whenFalse;
```

JavaScript에서 `if`는 문이지만 삼항 조건 연산자는 표현식이다.

```js
const message = isLoggedIn ? "Welcome" : "Login required";
```

조건 표현식은 값이 필요한 위치에 들어갈 수 있다.

### 할당 표현식

```js
value = 10;
value += 10;
value ??= fallback;
object.key = "next";
```

할당은 문이 아니라 표현식이다.

```js
const result = (value = 10);
```

할당 표현식도 평가 결과를 가지므로 다른 표현식 안에 배치할 수 있다.

### 함수·클래스 표현식

```js
const run = function () {};
const load = async function () {};
const generate = function* () {};

const Product = class {};
```

함수 선언이나 클래스 선언과 외형이 비슷하지만, 값이 필요한 표현식 위치에서 사용된다.

### 화살표 함수 표현식

```js
const double = (value) => value * 2;
```

화살표 함수는 선언문 형태가 따로 존재하지 않으며 함수 표현식이다.

### `await` 표현식

```js
const result = await promise;
```

`await promise` 부분은 표현식이다.

### `yield` 표현식

```js
function* generate() {
  const input = yield 10;
}
```

`yield 10`은 제너레이터 함수 안에서 사용하는 표현식이다.

### 쉼표 표현식

```js
const result = (first(), second(), third());
```

왼쪽부터 각 표현식을 평가하고 마지막 표현식의 값을 결과로 만든다.

변수 선언이나 함수 인수 목록에서 사용하는 쉼표와 쉼표 연산자는 구별해야 한다.

```js
const first = 1,
  second = 2;
```

이 쉼표는 선언 항목을 구분한다.

```js
run(first, second);
```

이 쉼표는 인수를 구분한다.

```js
const result = (first, second);
```

이 쉼표는 쉼표 연산자다.

### 표현식과 값의 차이

```js
1 + 2;
```

```txt
1 + 2    표현식
3        표현식을 평가한 결과인 값
```

표현식은 소스 코드의 문법 구조이며 값은 실행 중 존재하는 데이터다.

### 표현식과 문의 차이

```js
run();
```

호출 표현식이다.

```js
run();
```

호출 표현식을 문으로 사용한 표현식 문이다.

표현식은 다른 표현식 안에 들어갈 수 있다.

```js
const result = run();
```

반면 일반적인 문은 값이 필요한 자리에 넣을 수 없다.

```js
const result = if (condition) {
  run();
}; // SyntaxError
```

---

## 1.1.3 문

문은 프로그램의 제어 흐름과 실행 동작을 구성하는 문법 단위다.

명세상 `Statement`에는 블록문, 변수문, 빈 문, 표현식 문, 조건문, 반복문, `continue`, `break`, `return`, `throw`, `try`, `debugger` 문 등이 포함된다.

```txt
문
├─ 블록문
├─ 변수문
├─ 빈 문
├─ 표현식 문
├─ 조건문
├─ 반복문
├─ 제어 이동문
├─ 예외 관련 문
├─ 레이블문
├─ with 문
└─ debugger 문
```

### 블록문

```js
{
  const value = 10;
  console.log(value);
}
```

중괄호 안에 여러 문과 선언을 묶는다.

블록문은 하나의 문이므로 문이 들어갈 수 있는 위치에 사용할 수 있다.

```js
if (condition) {
  run();
}
```

`if`문의 본문은 하나의 블록문이다.

### 빈 문

```js

```

세미콜론 하나만으로 구성되며 아무 동작도 하지 않는다. 명세상 평가 결과는 `empty`다.

빈 문은 의도하지 않게 작성하면 문제가 생길 수 있다.

```js
if (condition);
{
  run();
}
```

실제 구조는 다음과 같다.

```txt
if 문
└─ 본문: 빈 문 ;

별도의 블록문
└─ run();
```

따라서 `run()`은 조건과 관계없이 실행된다.

### 표현식 문

표현식을 문이 들어갈 위치에 독립적으로 배치한 문이다.

```js
run();
value = 10;
count++;
```

구조는 다음과 같다.

```txt
run()    호출 표현식
run();   호출 표현식을 포함하는 표현식 문
```

명세의 문법 형태는 다음 관계로 정의된다.

```txt
ExpressionStatement
└─ Expression ;
```

표현식 문을 평가하면 내부 표현식을 평가한 뒤 그 참조에서 값을 가져온 결과를 반환한다.

모든 표현식이 아무 수정 없이 표현식 문으로 사용될 수 있는 것은 아니다.

```js
{
  name: "Mars";
}
```

문장 시작 위치의 `{`는 객체 리터럴이 아니라 블록으로 해석될 수 있다.

객체 리터럴 표현식을 명확하게 독립 실행하려면 괄호로 감쌀 수 있다.

```js
({ name: "Mars" });
```

익명 함수 표현식도 그대로 문장 시작 위치에 둘 수 없다.

```js
function () {} // SyntaxError
```

괄호를 사용하면 표현식으로 해석된다.

```js
(function () {});
```

표현식 문은 블록, 함수 선언, 클래스 선언 등과의 문법적 모호성을 막기 위해 특정 토큰으로 시작할 수 없도록 제한된다.

### 변수문

```js
var value = 10;
```

`var` 선언은 명세상 `VariableStatement`라는 문의 한 종류다.

이는 `let`과 `const`가 명세상 `LexicalDeclaration`으로 분류되는 것과 다르다.

### 조건문

#### `if`문

```js
if (condition) {
  run();
} else {
  stop();
}
```

구조는 다음과 같다.

```txt
if 문
├─ 조건: 표현식
├─ 참일 때 실행할 문
└─ 거짓일 때 실행할 문
```

`if`문 전체는 표현식이 아니지만 내부 조건에는 표현식이 들어간다.

#### `switch`문

```js
switch (status) {
  case "READY":
    start();
    break;

  default:
    stop();
}
```

하나의 입력 표현식을 평가한 뒤 일치하는 `case`부터 문 목록을 실행한다.

### 반복문

```js
while (condition) {
  run();
}
```

```js
do {
  run();
} while (condition);
```

```js
for (let index = 0; index < 10; index++) {
  run(index);
}
```

```js
for (const key in object) {
  console.log(key);
}
```

```js
for (const value of iterable) {
  console.log(value);
}
```

반복문 전체는 표현식이 아니라 문이다. 다만 초기화, 조건, 갱신, 순회 대상 등의 위치에는 표현식이나 선언이 들어갈 수 있다.

### `continue`문

```js
continue;
```

현재 반복의 나머지를 중단하고 다음 반복으로 넘어간다.

```js
continue outer;
```

레이블이 지정된 반복문의 다음 반복으로 이동할 수도 있다.

### `break`문

```js
break;
```

현재 반복문 또는 `switch`문을 빠져나간다.

```js
break outer;
```

레이블이 지정된 문을 종료할 수도 있다.

### `return`문

```js
return;
```

```js
return result;
```

함수 실행을 종료한다.

`return result;` 전체는 문이며, `result` 부분은 반환값을 계산하는 표현식이다.

```txt
return 문
└─ 반환 표현식: result
```

### `throw`문

```js
throw error;
```

`throw error;` 전체는 문이며, `error`는 던질 값을 계산하는 표현식이다.

`throw`와 표현식 사이에는 줄 종결자가 올 수 없다.

```js
throw
new Error(); // SyntaxError
```

### `try`문

```js
try {
  run();
} catch (error) {
  handle(error);
} finally {
  cleanup();
}
```

예외가 발생할 수 있는 블록, 예외를 처리하는 `catch`, 항상 실행할 `finally`를 구성한다.

### 레이블문

```js
target: {
  break target;
}
```

문에 이름을 붙여 `break`나 `continue`가 특정 문을 대상으로 삼을 수 있게 한다.

### `debugger`문

```js
debugger;
```

디버거가 연결되어 있을 때 실행을 중단할 수 있는 지점을 나타낸다.

### `with`문

```js
with (object) {
  console.log(name);
}
```

객체의 프로퍼티를 식별자 해석 환경에 포함시키는 문이지만, 정적 분석을 어렵게 만들기 때문에 strict mode에서는 Early Error다.

### 표현식 문과 표현식이 아닌 문

```txt
표현식 문
표현식을 독립적인 문으로 사용

표현식이 아닌 문
if, while, return, throw, try 등 자체적인 문법 구조를 가진 문
```

```js
run();
```

표현식 문이다.

```js
if (condition) {
  run();
}
```

전체는 표현식이 아닌 `if`문이다.

그러나 내부에는 표현식과 표현식 문이 들어 있다.

```txt
if 문
├─ condition     식별자 참조 표현식
└─ 블록문
   └─ run();     표현식 문
```

따라서 “표현식이 아닌 문”은 표현식을 전혀 포함하지 않는다는 뜻이 아니다. **문 전체가 하나의 표현식으로 사용될 수 없다는 뜻**이다.

---

## 1.1.4 선언

선언은 이름을 도입하고, 그 이름과 관련된 바인딩이나 문법적 정의를 구성하는 코드다.

```txt
선언
├─ 어휘 선언
├─ 함수 선언
├─ 제너레이터 함수 선언
├─ async 함수 선언
├─ async 제너레이터 선언
└─ 클래스 선언
```

### 문과 선언의 관계

일상적으로는 `var 선언문`, `let 선언문`, `함수 선언문`처럼 모두 선언문이라고 부르기도 한다.

그러나 명세 문법에서는 `Statement`와 `Declaration`을 구분한다.

```txt
StatementListItem
├─ Statement
└─ Declaration
```

즉, 블록 안에는 문과 선언이 함께 들어갈 수 있지만 문법 범주로는 서로 구별된다.

```js
{
  run();
  const value = 10;
  function calculate() {}
}
```

```txt
StatementList
├─ 표현식 문
├─ 어휘 선언
└─ 함수 선언
```

### `var` 선언

```js
var value = 10;
```

새로운 변수 바인딩을 선언하지만 명세상 `Declaration`이 아니라 `VariableStatement`다.

```txt
var    Statement 계열
```

### `let` 선언

```js
let value;
let count = 10;
```

명세상 `LexicalDeclaration`이다.

초기화 표현식은 생략할 수 있다.

```js
let value;
```

이 선언이 실행될 때 `value`는 `undefined`로 초기화된다.

### `const` 선언

```js
const value = 10;
```

명세상 `LexicalDeclaration`이다.

일반적인 `const` 선언에는 초기화 표현식이 반드시 필요하다.

```js
const value; // Early Error
```

초기화 표현식이 없는 `const` 바인딩은 Early Error로 규정된다.

### 함수 선언

```js
function calculate() {
  return 10;
}
```

함수 이름에 대한 바인딩을 선언하고 함수 정의를 제공한다.

### 제너레이터 함수 선언

```js
function* generate() {
  yield 10;
}
```

### async 함수 선언

```js
async function load() {
  return await request();
}
```

### async 제너레이터 선언

```js
async function* generate() {
  yield await request();
}
```

### 클래스 선언

```js
class Product {
  constructor(name) {
    this.name = name;
  }
}
```

클래스 이름에 대한 바인딩을 선언하고 클래스 정의를 제공한다.

### 선언과 표현식의 구별

함수와 클래스는 선언 형태와 표현식 형태를 모두 가질 수 있다.

```js
function run() {}
```

함수 선언이다.

```js
const run = function () {};
```

오른쪽의 `function () {}`는 함수 표현식이다.

```js
class Product {}
```

클래스 선언이다.

```js
const Product = class {};
```

오른쪽의 `class {}`는 클래스 표현식이다.

구별 기준은 단순히 `function`이나 `class`라는 단어가 존재하는지가 아니라, 해당 구문이 놓인 문법적 위치다.

### 바인딩 패턴

선언의 이름 위치에는 하나의 식별자뿐 아니라 구조 분해 바인딩 패턴도 사용할 수 있다.

```js
const { name, age } = user;
```

```js
const [first, second] = values;
```

객체·배열 형태로 보이지만 여기서는 객체·배열 리터럴 표현식이 아니라 바인딩할 이름들을 지정하는 패턴이다.

```txt
const { name } = user;
      └──────── 객체 바인딩 패턴

const object = { name };
               └────── 객체 리터럴
```

---

## 1.1.5 연산자 우선순위

연산자 우선순위는 여러 연산자가 하나의 표현식에 함께 나타날 때 어떤 연산이 더 강하게 묶이는지를 결정한다.

```js
1 + 2 * 3;
```

곱셈이 덧셈보다 우선순위가 높으므로 다음처럼 해석된다.

```js
1 + 2 * 3;
```

다음처럼 해석되지 않는다.

```js
(1 + 2) * 3;
```

ECMAScript 명세는 연산자마다 숫자 우선순위를 직접 부여하기보다, 표현식 문법을 여러 단계로 계층화하여 우선순위를 나타낸다.

```txt
MultiplicativeExpression
→ AdditiveExpression
→ ShiftExpression
→ RelationalExpression
→ EqualityExpression
→ ...
```

낮은 단계의 표현식이 더 높은 단계의 표현식 안에 들어가도록 문법이 구성되므로 어떤 연산자가 더 강하게 묶이는지가 결정된다. 표현식 문법이 `PrimaryExpression`, 왼쪽 값 표현식, 갱신 표현식, 단항 표현식, 지수·곱셈·덧셈 표현식 등으로 계층화되어 있는 이유다.

### 대략적인 우선순위

높은 쪽에서 낮은 쪽으로 단순화하면 다음과 같다.

```txt
그룹화                     (...)
멤버 접근·호출             object.key, object[key], call()
new
후위 갱신                  value++, value--
전위·단항                  ++value, !value, typeof value
지수                        **
곱셈                       *, /, %
덧셈                       +, -
비트 이동                  <<, >>, >>>
관계                       <, <=, >, >=, in, instanceof
동등성                     ==, !=, ===, !==
비트 AND                   &
비트 XOR                   ^
비트 OR                    |
논리 AND                   &&
논리 OR                    ||
Null 병합                  ??
조건                       ? :
할당                       =, +=, &&=, ??= 등
yield
쉼표                       ,
```

이 표는 표현식을 읽기 위한 요약이고, 실제 유효성은 명세의 구문 생산식과 문법 제약으로 결정된다.

### 우선순위와 결합 방향

우선순위는 서로 다른 연산자를 어떻게 묶는지 정한다.

```js
a + b * c;
```

```js
a + b * c;
```

결합 방향은 같은 우선순위의 연산자가 연속될 때 어느 방향으로 묶이는지를 정한다.

대부분의 이항 산술 연산자는 왼쪽 결합이다.

```js
a - b - c;
```

```js
a - b - c;
```

지수 연산자는 오른쪽 결합이다.

```js
a ** (b ** c);
```

```js
a ** (b ** c);
```

할당 역시 오른쪽 결합이다.

```js
a = b = 10;
```

```js
a = b = 10;
```

### 우선순위와 평가 순서

연산자 우선순위와 피연산자 평가 순서는 다른 개념이다.

```js
left() + middle() * right();
```

문법적으로는 다음처럼 묶인다.

```js
left() + middle() * right();
```

그러나 피연산자 표현식은 소스 텍스트의 왼쪽에서 오른쪽 순서로 평가된다.

```txt
left()
→ middle()
→ right()
→ 곱셈
→ 덧셈
```

우선순위는 구문 트리의 결합 구조를 결정하고, 평가 순서는 그 구조를 실제로 처리하는 절차를 결정한다.

### 괄호

괄호를 사용하면 기본 우선순위와 다른 방식으로 표현식을 묶을 수 있다.

```js
(1 + 2) * 3;
```

괄호 안의 덧셈 표현식이 하나의 그룹으로 취급된다.

### 문법적으로 함께 사용할 수 없는 조합

우선순위만으로 모든 조합이 결정되는 것은 아니다.

```js
a ?? b || c
```

Null 병합 연산자와 논리 AND·OR 연산자는 괄호 없이 직접 혼합할 수 없다.

```js
(a ?? b) || c;
a ?? (b || c);
```

처럼 의도를 괄호로 명확히 해야 한다.

또한 지수 연산자의 왼쪽에 일부 단항 표현식을 그대로 둘 수 없는 등 별도의 구문 제약이 존재한다.

따라서 연산자 표만 외우는 것보다 실제 명세의 표현식 문법과 괄호 요구 조건을 함께 봐야 한다.

---

## 1.1.6 세미콜론 자동 삽입

ECMAScript의 많은 문과 선언은 세미콜론으로 끝난다.

```js
run();
const value = 10;
return value;
```

그러나 정해진 조건에서는 소스 코드에 세미콜론이 직접 적혀 있지 않아도 세미콜론이 토큰 스트림에 삽입된 것으로 처리된다. 이를 Automatic Semicolon Insertion, ASI라고 한다.

### 세미콜론의 역할

세미콜론은 표현식을 값으로 만들거나 표현식을 문으로 변환하는 연산자가 아니다.

```js
run();
```

호출 표현식이다.

```js
run();
```

표현식 문 문법의 전체 형태다.

```txt
ExpressionStatement
├─ Expression: run()
└─ ;
```

### 줄바꿈마다 삽입되는 것이 아니다

다음 코드는 하나의 덧셈 표현식으로 이어진다.

```js
const result = first + second;
```

다음과 같다.

```js
const result = first + second;
```

줄바꿈이 존재한다고 해서 무조건 앞에 세미콜론이 삽입되는 것은 아니다.

### 기본 삽입 상황

명세의 기본 규칙을 단순화하면 다음과 같다.

#### 다음 토큰 때문에 문법 분석을 계속할 수 없는 경우

현재 토큰과 다음 토큰을 이어서 유효한 문법 구조를 만들 수 없고 둘 사이에 줄 종결자가 존재하면 세미콜론이 삽입될 수 있다.

```js
const first = 10;
const second = 20;
```

다음처럼 처리된다.

```js
const first = 10;
const second = 20;
```

#### `}` 앞

문이나 선언의 끝에 세미콜론이 필요하지만 다음 토큰이 `}`라면 그 앞에 세미콜론이 삽입될 수 있다.

```js
{
  run();
}
```

#### 입력 끝

입력의 끝에 도달했지만 세미콜론이 없어서 전체 코드를 완성된 문법 구조로 분석할 수 없다면 끝에 세미콜론이 삽입될 수 있다.

```js
run();
```

입력 끝에서 다음처럼 처리될 수 있다.

```js
run();
```

#### restricted production

`[no LineTerminator here]`가 지정된 위치에 줄 종결자가 있으면 줄바꿈 앞에 세미콜론이 삽입될 수 있다.

대표적으로 다음 문법이 영향을 받는다.

```txt
후위 ++와 --
return
throw
break의 레이블
continue의 레이블
yield
async 함수 문법
화살표 함수의 =>
```

명세는 세 가지 기본 ASI 규칙과 `[no LineTerminator here]`가 적용되는 제한 문법을 별도로 정의한다.

### `return`과 줄바꿈

```js
return;
value;
```

다음처럼 처리된다.

```js
return;
value;
```

`value`는 반환 표현식이 아니다.

객체를 반환할 때도 문제가 될 수 있다.

```js
return
{
  name: "Mars",
};
```

다음과 비슷하게 처리된다.

```js
return;

{
  name: "Mars";
}
```

객체를 반환하려면 같은 줄에 시작하거나 괄호로 연결해야 한다.

```js
return {
  name: "Mars",
};
```

```js
return {
  name: "Mars",
};
```

### 후위 증가·감소와 줄바꿈

```js
value;
++next;
```

`++`는 앞의 `value`에 적용되는 후위 증가 연산자로 처리되지 않는다.

다음처럼 구분될 수 있다.

```js
value;
++next;
```

### 다음 줄과 이어지는 경우

다음 코드는 줄바꿈 지점에 세미콜론이 삽입되지 않는다.

```js
const result = getValue()[0];
```

다음처럼 이어질 수 있기 때문이다.

```js
const result = getValue()[0];
```

다음 코드도 이어진 호출 표현식으로 분석될 수 있다.

```js
value(next);
```

```js
value(next);
```

세미콜론 없는 스타일에서는 다음 토큰으로 시작하는 줄을 특히 주의해야 한다.

```txt
(
[
`
+
-
정규 표현식 리터럴이 될 수 있는 /
```

명세도 이 토큰들로 다음 줄이 시작하면 앞 표현식과 호출, 프로퍼티 접근, tagged template, 이항 연산 등의 형태로 이어질 수 있다고 설명한다.

### `for` 헤더에는 삽입되지 않는다

```js
for (initialize; condition; update) {
  run();
}
```

`for` 헤더의 두 세미콜론은 구성 요소를 구분하는 필수 문법이다. ASI는 이 세미콜론들을 대신 삽입하지 않는다.

### 빈 문과 ASI

명시적으로 적힌 세미콜론 하나는 빈 문이다.

```js

```

그러나 ASI가 아무 위치에나 빈 문을 만들어 문법 오류를 해결하는 것은 아니다.

예를 들어 다음 코드에서 `else` 앞에 세미콜론을 삽입하면 `if`의 본문이 빈 문이 되어 버리므로 ASI로 코드가 복구되지 않는다.

```js
if (condition)
else run();
```

ASI는 “적당히 세미콜론을 넣어서 코드를 실행 가능하게 만드는 기능”이 아니라 명세에 정의된 제한적인 토큰 삽입 규칙이다.

---

## 1.1.7 Early Error

Early Error는 소스 코드가 문법 생산식에 따라 구조적으로 분석된 뒤, 실제 평가를 시작하기 전에 적용되는 정적 오류 규칙이다.

```txt
소스 텍스트
→ 어휘 문법
→ 구문 분석
→ Parse Node
→ 정적 의미·Early Error 검사
→ 오류가 없으면 평가
```

Early Error를 위반하면 `SyntaxError`가 발생하고 해당 Script나 Module의 실행은 시작되지 않는다.

### 일반 구문 오류와의 관계

다음 코드는 기본 문법 형태 자체를 만들 수 없다.

```js
const = 10;
```

이는 구문 분석 단계에서 유효한 문법 생산식과 일치하지 않는다.

다음 코드는 문법적인 구조는 인식할 수 있지만 추가 정적 제약을 위반한다.

```js
const value;
```

`const` 선언이라는 구조는 인식할 수 있지만, 초기화 표현식이 없는 `const` 바인딩은 Early Error다.

둘 다 외부에서는 `SyntaxError`로 관찰될 수 있지만 명세가 오류를 규정하는 방식에는 차이가 있다.

### 중복 어휘 선언

```js
{
  let value;
  let value;
}
```

같은 `StatementList`의 어휘 선언 이름에 중복 항목이 있으므로 Early Error다.

```js
{
  let value;
  const value = 10;
}
```

이 역시 같은 이름을 중복해서 어휘 선언한다.

블록의 `LexicallyDeclaredNames`에 중복이 있거나 어휘 선언 이름이 같은 목록의 `VarDeclaredNames`와 충돌하면 Syntax Error로 규정된다.

### `let`과 `var` 충돌

```js
{
  let value;
  var value;
}
```

같은 블록의 어휘 선언 이름과 `var` 선언 이름이 충돌하므로 Early Error다.

### 중복 바인딩 이름

```js
let { name, name } = object;
```

하나의 어휘 선언 안에서 만들어지는 바인딩 이름에 중복 항목이 생기므로 Early Error다.

명세는 `LexicalDeclaration`의 `BoundNames`에 중복 항목이 포함되면 Syntax Error라고 규정한다.

### 초기화 없는 `const`

```js
const value;
```

`const` 선언의 바인딩에 초기화 표현식이 없으므로 Early Error다.

```js
const value = 10;
```

처럼 초기화해야 한다.

### strict mode의 식별자 제약

```js
"use strict";

let eval = 10;
```

```js
"use strict";

function run(arguments) {}
```

strict mode에서는 `eval`이나 `arguments`를 일부 바인딩 식별자로 사용하는 것이 Early Error다.

식별자의 허용 여부는 단순히 어휘 문법만으로 결정되는 것이 아니라 strict mode 여부, `Yield`·`Await` 문법 매개변수, Early Error 규칙의 조합으로 결정된다.

### `await`와 `yield`

```js
function* generate() {
  let yield = 10;
}
```

제너레이터 문맥에서는 `yield`를 바인딩 이름으로 사용할 수 없다.

```js
async function load() {
  let await = 10;
}
```

비동기 함수 문맥에서는 `await`를 바인딩 이름으로 사용할 수 없다.

모듈 코드에서도 `await`는 일반적인 식별자로 제한된다.

### strict mode의 `with`

```js
"use strict";

with (object) {
  run();
}
```

`with`문이라는 문법 구조는 존재하지만 strict mode 코드에 나타나면 Early Error다.

### 유효하지 않은 할당 대상

```js
10 = value;
```

```js
left + right = value;
```

할당 연산자의 왼쪽은 유효한 할당 대상이어야 한다.

리터럴이나 덧셈 표현식은 값을 저장할 대상이 아니므로 허용되지 않는다.

### 유효하지 않은 갱신 대상

```js
10++;
```

```js
(first + second)++;
```

`++`와 `--`의 피연산자도 유효한 갱신 대상이어야 한다.

### `break`와 `continue`의 문맥

```js
break;
```

반복문, `switch`, 유효한 레이블 문맥 밖의 `break`는 허용되지 않는다.

```js
continue;
```

반복문 밖의 `continue` 역시 허용되지 않는다.

```js
label: {
  continue label;
}
```

`continue`가 참조하는 레이블은 반복문에 연결된 레이블이어야 한다.

### `return`의 문맥

```js
return value;
```

일반적인 Script 최상위에서 `return`문은 사용할 수 없다.

`return`은 함수 본문처럼 문법 매개변수 `[Return]`이 허용된 문맥에서만 나타날 수 있다.

### private 이름

```js
class Example {
  method() {
    return this.#missing;
  }
}
```

클래스 안에서 선언되지 않은 private 이름을 참조하면 Early Error가 된다.

```js
class Example {
  #value;
  #value;
}
```

같은 클래스에서 private 이름을 중복 선언하는 경우에도 정적 제약이 적용된다.

### 정규 표현식 리터럴

```js
const pattern = /[/;
```

정규 표현식 리터럴 토큰의 내부 패턴이 유효한 정규 표현식 문법을 만족하지 않으면 Early Error가 된다.

### Early Error의 범위

Early Error는 하나의 독립된 코드 종류가 아니다.

```txt
표현식에 붙는 Early Error
문의 Early Error
선언의 Early Error
함수·클래스 문법의 Early Error
Script·Module의 Early Error
```

각 문법 생산식 아래에 해당 구조가 만족해야 하는 정적 제약으로 분산되어 있다.

예를 들어:

```txt
식별자
└─ strict mode에서 eval·arguments 제한

어휘 선언
├─ 중복 바인딩 금지
└─ const 초기화 필수

블록
├─ 어휘 선언 이름 중복 금지
└─ 어휘 선언과 var 선언 이름 충돌 금지

with 문
└─ strict mode에서 금지
```

따라서 Early Error는 문법 분석과 실행 사이에서 소스 코드의 정적 유효성을 검사하는 명세 규칙들의 집합으로 보는 것이 적절하다.

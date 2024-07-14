# 浅拷贝和深拷贝

## 拷贝原理

JavaScript 数据类型由基本类型和引用类型构成。基本类型比较轻量，即数据体积比较小，所以存在栈内存中，引用类型，数据体积可以很大，所以存在堆内存中。所以当拷贝基本数据类型的试试，能直接从栈中拷贝，而拷贝引用类型的时候，拷贝的是该对象的地址，地址也是变量，存在栈内存中。

## 什么是浅拷贝？

这里的拷贝指的都是对象的拷贝，由于一般对象的占用内存体积比较大（比基本类型大很多，复杂对象占用内存更多），所以当我们拷贝对象的时候，执行的都是浅拷贝，即只拷贝对象的地址，

浅拷贝的几种方法：

- Object.assign
- 扩展运算符
- 数组的 slice 方法
- 数组的 concat 方法

### Object.assign

Object.assgin() 拷贝的是对象的属性的引用，而不是对象本身。

```js
let obj = { name: "sy", age: 18, attrs: { sex: "男" } };
let obj2 = Object.assign({}, obj);

obj2.attrs.sex = "女";

console.log(obj.attrs.sex); // 女
```

### 扩展运算符

```js
const arr = [1, 2, 3, 4, 5, 6];
const newArr = [...arr]; //跟arr.slice()是一样的效果
```

### 数组的 slice 方法

```js
const arr = [1, 2, 3, 4, 5, 6];
const newArr = arr.slice(); // [1, 2, 3, 4, 5, 6]
```

### 数组的 concat 方法

```js
const arr = [1, 2, 3, 4, 5, 6];
const newArr = arr.concat(); // [1, 2, 3, 4, 5, 6]
```

### 手写一个浅拷贝

处理浅拷贝的时候，需要区分当前拷贝的 object 类型是数组还是一个对象，基础类型值则直接返回。

```js
const shallowClone = (target) => {
  if (typeof target === "object" && target !== null) {
    // 判断目标是一个数组还是一个对象
    const cloneTarget = Array.isArray(target) ? [] : {};

    // 遍历一个对象的所有自身属性, 忽略掉继承属性
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = target[prop];
      }
    }

    return cloneTarget;
  } else {
    // 非对象类型直接返回值本身
    return target;
  }
};
```

## 什么是深拷贝？

浅拷贝的限制: 它只能拷贝一层对象。如果有对象的嵌套，那么浅拷贝将无能为力。
如果修改新数组中对象的值，原数组中对象的值也会发生变化。有时候我们希望新拷贝的引用对象不影响原来的对象，显然浅拷贝无法做到。
但幸运的是，深拷贝就是为了解决这个问题而生的，它能解决无限极的对象嵌套问题，实现彻底的拷贝。

```js
let arr = [1, 2, 3, {}];
let arr1 = arr.slice();
arr1[3].name = "abc";

console.log(arr); // [1, 2, 3, {name: 'abc'}]
```

下面介绍深拷贝的几种办法：

- JSON.stringify
- 手动实现深拷贝

### 简陋版 JSON.stringify

通过 JSON.stringify 把对象转成字符串，再通过 JSON.parse 解析出一个新对象，实现对象的深拷贝

```js
JSON.parse(JSON.stringify());
```

很方便，但是存在如下 4 个问题：

1. 无法解决循环引用的问题

```js
let obj = { val: 2 };
obj.target = obj;

let copyObj = JSON.parse(JSON.stringify(obj));
/*

拷贝的时候报错，报系统栈溢出，因为对象存在循环引用的问题

VM2370:1 Uncaught TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    --- property 'target' closes the circle
    at JSON.stringify (<anonymous>)
    at <anonymous>:1:25
(anonymous) @ VM2370:1
*/
```

2. 无法拷贝一些特殊的对象，诸如 RegExp,Date,Set,Map 等

3. 无法拷贝函数

丢失函数属性

```js
let obj = { name: "function", value: function () {} };

let newObj = JSON.parse(JSON.stringify(obj));

newObj; // {name: "function"}
```

4. 原型丢失的情况

### 一步一步手写深拷贝代码

大部分情况下我们用 JSON 拷贝大法可以解决对对象的复制，更复杂的情况就需要我们使用 loadsh 库的 deepclone 或者手动实现一个完备的深拷贝方法。

一：基础版深拷贝

使用递归的方式拷贝对象，同时解决数组拷贝问题

```js
const deepClone = (target) => {
  if (typeof target === "object" && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop]); // 递归拷贝
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
};
```

测试用例

```js
const target = {
  field1: 1,
  field2: undefined,
  field3: "jamie",
  field4: {
    child: "child",
    child2: {
      child2: "child2",
    },
  },
  fileld5: [4, 5, { name: "hello world" }],
};

console.log(clone(target));
```

二：解决循环引用的问题

因为使用了递归计算方式，如果对象属性中引用了自己，`target.self = target`, 递归调用就会陷入死循环。
为了解决循环引用问题，我们需要开辟一个单独的空间来存储当前对象和拷贝对象之间的关系。在拷贝任意对象前，先在存储空间中查找，若已经拷贝过该对象，则直接返回引用，如果未拷贝过，则继续执行对象拷贝。
这个存储空间是一个 key-value 的形式的数据结构，且 key 可以为一个引用类型，我们可以选择 `WeakMap` 这种数据结构。
使用 `WeakMap` 数据结构而不是 `Map`结构的一个目的是，`WeakMap` Key 值对对象是弱引用，若目标对象执行 `obj = null` 释放，WeakMap 相应的键值对也会释放空间，而不会形成额外的消耗。

```js
const clone = (target, map = new WeakMap()) => {
  if (typeof target === "object" && target !== null) {
    if (map.has(target)) {
      return map.get(target);
    }

    let obj = Array.isArray(target) ? [] : {};

    map.set(target, obj);

    for (let prop in target) {
      obj[prop] = clone(target[prop], map);
    }

    return obj;
  } else {
    return target;
  }
};
```

执行测试用例，拷贝正确，`target.self` 属性显示为 `[Circular]` 类型

三、遍历性能优化
for...in 效率不如 for 循环和 while 循环，把 for...in 遍历方式进行改造

```js
const forEach = (array, callback) => {
  let index = 0;

  while (index < array.length) {
    callback(array[index], index);
    index++;
  }

  return array;
};
const clone = (target, map = new WeakMap()) => {
  if (typeof target === "object" && target !== null) {
    if (map.has(target)) {
      return map.get(target);
    }

    let isArray = Array.isArray(target);
    let cloneTarget = isArray ? [] : {};

    map.set(target, cloneTarget);

    if (isArray) {
      target.forEach((item, index) => {
        cloneTarget[index] = clone(item, map);
      });
    } else {
      let keys = Object.keys(target);
      forEach(keys, (key) => {
        cloneTarget[key] = clone(target[key], map);
      });
    }

    return cloneTarget;
  } else {
    return target;
  }
};
```

四、处理其他数据类型 map/set

首先先提取和封装判断数据类型的方法

```js
// 判断是否是引用类型的对象
const isObject = (obj) => {
  return typeof obj === "object" && obj !== null;
};

// 判断是否是基础类型
const isPrimitive = (value) => {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "undefined" ||
    typeof value === "symbol" ||
    typeof value === "bigint" ||
    value === null
  );
};

const isFunction = (fn) => {
  return typeof fn === "function";
};

const isMap = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Map]";
};

const isSet = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Set]";
};
```

现在引用类型数量增多，使用 getInit 方法来生成 target 同类空对象

```js
const getInit = (target) => {
  // 获取目标对象的构造器
  const Ctor = target.constructor;

  // 数组: f Array(){[native code]}
  // map: f Map(){[native code]}
  // set: f Set(){[native code]}
  // function: f Function(){[native code]}
  // ...

  return new Ctor();
};
```

```js
const clone = (target, map = new WeakMap()) => {
  // 处理基础类型
  if (isPrimitive(target)) {
    return target;
  }

  // 处理引用类型
  if (isObject(target)) {
    // 防止循环引用
    if (map.has(target)) {
      return map.get(target);
    }

    // 拷贝一个同类型的空对象
    let cloneTarget = getInit(target);
    map.set(target, cloneTarget);

    if (Array.isArray(target)) {
      // 处理数组
      target.forEach((item, index) => {
        cloneTarget[index] = clone(item, map);
      });
    } else if (isSet(target)) {
      target.forEach((value) => {
        cloneTarget.add(clone(value));
      });
    } else if (isSet(target)) {
      target.forEach((value, key) => {
        cloneTarget.set(key, clone(value));
      });
    } else {
      let keys = Object.keys(target);
      forEach(keys, (key) => {
        cloneTarget[key] = clone(target[key], map);
      });
    }

    return cloneTarget;
  }
};
```

更新测试用例：

```js
let map = new Map();
map.set("name", "jamie");

let set = new Set();
set.add("name", "jamie");
// 测试用例
const target = {
  field1: 1,
  field2: undefined,
  field3: "jamie",
  field4: {
    child: "child",
    child2: {
      child2: "child2",
    },
  },
  fileld5: [4, 5, { name: "hello world" }],
  map,
  set,
};

target.self = target;
```

五、处理不能被迭代的对象

```js
const mapTag = "[object Map]";
const setTag = "[object Set]";
const boolTag = "[object Boolean]";
const numberTag = "[object Number]";
const stringTag = "[object String]";
const symbolTag = "[object Symbol]";
const dateTag = "[object Date]";
const errorTag = "[object Error]";
const regexpTag = "[object RegExp]";
const funcTag = "[object Function]";

// 处理函数
const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if (!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if (!body) return null;
  if (param) {
    const paramArr = param[0].split(",");
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
};

// 处理正则表达式
const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
};

const handleNotTraverse = (target, type) => {
  const Ctor = target.constructor;
  switch (tag) {
    case boolTag:
      return new Object(Boolean.prototype.valueOf.call(target));
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target));
    case stringTag:
      return new Object(String.prototype.valueOf.call(target));
    case symbolTag:
      return new Object(Symbol.prototype.valueOf.call(target));
    case errorTag:
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
};
```

## 参考文章

[如何写出一个惊艳面试官的深拷贝?](https://juejin.cn/post/6844903929705136141)

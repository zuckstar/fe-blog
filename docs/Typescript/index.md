# Typescript 练习题

[闯关地址](https://github.com/type-challenges/type-challenges)

[练习题](https://hzm0321.github.io/apaas-front-doc/blog/TypeScript%20Challenge#13-hello-world)

常见的内置 ts 函数要学会自己实现：

`Pick`、`Awaited`、`ReturnType`、`Parameters`、`Record`、`Partial`、`Readonly`

## 常用关键字

### extends

extends 关键字在 TS 编程中出现的频率挺高的，而且不同场景下代表的含义不一样，特此总结一下：

- 表示继承/拓展的含义
- 表示约束的含义
- 表示分配的含义

### typeof 关键字

typeof 将 JS 对象 转化为 描述对象的类型

### keyof

TypeScript 允许我们遍历某种类型的属性，并通过 keyof 操作符提取其属性的名称。

keyof 操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

### in 关键字

in 的右侧一般会跟一个联合类型，使用 in 操作符可以对该联合类型进行迭代。 其作用类似 JS 中的 for...in 或者 for...of

```ts
type Animals = "pig" | "cat" | "dog";
type animals = {
  [key in Animals]: string;
};

// 等同于：
type animals = {
  pig: string;
  cat: string;
  dog: string;
};
```

in + keyof:

- keyof 将描述对象的属性类型转化为联合类型
- in 对联合类型进行遍历

### infer 关键字

infer 可以在 extends 的条件语句中推断待推断的类型。

### as 关键字

- 断言 JS 类型

- 转化 TS 类型

- as + extends + in + keyof

## 简单

### 1. 实现 Pick

题目：

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

答案：

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### 2.ReadyOnly

题目：

```ts
interface Todo {
  title: string;
  description: string;
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar",
};

todo.title = "Hello"; // Error: cannot reassign a readonly property
todo.description = "barFoo"; // Error: cannot reassign a readonly property
```

答案：

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

### 3. Partial

```ts
type Partial<T> = {
  [K in keyof T]?: T[K];
};
```

### 4. 元祖转换成对象

题目：

```ts
const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type result = TupleToObject<typeof tuple>; // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

答案：

- 约束元祖的联合类型 `readonly (string | number | symbol)[]`

- `[P in T[number]]` 迭代获取元祖每一个下标的值

```ts
type TupleToObject<T extends readonly (string | number | symbol)[]> = {
  [P in T[number]]: P;
};
```

### 5. 第一个元素

题目：

```ts
type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];
type arr3 = [];

type head1 = First<arr1>; // expected to be 'a'
type head2 = First<arr2>; // expected to be 3
type head3 = First<arr3>; // expected to be never
```

答案：

- 传递的泛型 T 得符合数组类型
- 判断 T 是否是空数组，空数组返回 never 类型，否则返回 `T[0]` 元素的类型

```ts
type First<T extends any[]> = T extends [] ? never : T[0];
```

### 6. 获取元组长度

题目：

```ts
type tesla = ["tesla", "model 3", "model X", "model Y"];
type spaceX = [
  "FALCON 9",
  "FALCON HEAVY",
  "DRAGON",
  "STARSHIP",
  "HUMAN SPACEFLIGHT"
];

type teslaLength = Length<tesla>; // expected 4
type spaceXLength = Length<spaceX>; // expected 5
```

答案：

- 使用 extends 关键字，约束泛型 T 为元祖类型
- 获取元祖身上的 length 属性的类型

```ts
type Length<T extends readonly (string | number | symbol)[]> = T["length"];
```

### 7. Exclude

实现内置的 `Exclude<T, U>` 类型，但不能直接使用它本身。

从联合类型 T 中排除 U 的类型成员，来构造一个新的类型。

题目：

```ts
type Result = Exclude<"a" | "b" | "c", "a">; // 'b' | 'c'
```

答案：

```ts
type Result = Exclude<"a" | "b" | "c", "a">;
// 等价于
type Result = Exclude<"a", "a"> | Exclude<"b", "a"> | Exclude<"c", "a">;

type MyExclude<T, U> = T extends U ? never : T;
```

### 8. Awaited

实现一个 `Awaited<T>`，它接受一个 Promise 类型并返回它 resolve 的类型。

例如：`Promise<ExampleType>`，请你返回 ExampleType 类型。

```ts
type ExampleType = Promise<string>;

type Result = Awaited<ExampleType>; // string
```

答案：

- 限制 T 为 Promise 类型
- 推断 Promise 的 resovle 值
- 如果 Promise 的 resolve 仍然为一个 promise，则递归调用类型判断，否则返回 resolve 值类型
- 如果不为 Promise 类型，返回 never 类型

```ts
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MyAwaited<P>
    : P
  : never;
```

### 9. Parameters

实现一个 `Parameters<T>`，它接受一个函数类型 T 并返回一个由参数类型组成的元组。

例如：

```ts
const foo = (arg1: string, arg2: number): void => {};

type FunctionParamsType = MyParameters<typeof foo>; // [arg1: string, arg2: number]
```

答案：

- 限制泛型为函数类型，推断参数，如果是函数则返回参数列表元组 P，否则返回 never

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

## 中等

### 1. 获取函数返回类型

题目：

```ts
const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type a = MyReturnType<typeof fn>; // 应推导出 "1 | 2"
```

答案：

- 如果 T 是一个函数，则返回推断的返回值类型 R，如果 T 不是函数则直接返回 T 的类型

```ts
type MyReturnType<T extends (args: any[]) => any> = T extends (
  args: any[]
) => infer R
  ? R
  : T;
```

### 2. 实现 Omit

不使用 Omit 实现 TypeScript 的 `Omit<T, K>` 泛型。

Omit 会创建一个省略 K 中字段的 T 对象。

例如：

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyOmit<Todo, "description" | "title">;

const todo: TodoPreview = {
  completed: false,
};
```

答案：

- K 继承 Todo 是的属性

- 在属性中进行条件判断，P 是否继承 K，如果继承返回 never，否则正常返回 `T[P]` 类型

```ts
type MyOmit<T, K extends keyof Todo> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
```

### 3. Readonly 2

实现一个通用 `MyReadonly2<T, K>`，它带有两种类型的参数 T 和 K。

K 指定应设置为只读的属性的子集。

例如：

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

const todo: MyReadonly2<Todo, "title" | "description"> = {
  title: "Hey",
  description: "foobar",
  completed: false,
};

todo.title = "Hello"; // Error: cannot reassign a readonly property
todo.description = "barFoo"; // Error: cannot reassign a readonly property
todo.completed = true; // OK
```

答案：

- 联合类型，分别判断是否继承于 U，继承则将属性设置为 readonly，没有继承则将属性设置为正常类型

```ts
type MyReadonly2<T, U extends keyof T> = {
  readonly [key in keyof T as key extends U ? key : never]: T[key];
} & {
  [key in keyof T as key extends U ? never : key]: T[key];
};
```

### 4. Record

`Record<K, T>` 的基本用法：

```ts
type Direction = "up" | "right" | "down" | "left";
type RecordDirection = Record<Direction, number>;

const direction: RecordDirection = {
  up: 1,
  right: 2,
  down: 3,
  left: 4,
};

type RecordDirection = {
  up: number;
  right: number;
  down: number;
  left: number;
};
```

答案：

- 限制 K 输入为一个联合类型，作为键值
- in 遍历键值

```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};
```

## 参考

https://juejin.cn/post/7034035155434110990#heading-17

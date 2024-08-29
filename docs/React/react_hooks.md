# React Hooks

## 什么是 hooks

### 你对 Hooks 了解吗？Hooks 的本质是什么？为什么？

hooks 的本质是-闭包。
它在外部作用域存储了值

A： React Hooks 是 React 16.8 之后推出的函数式组件状态管理方案。它是为了解决状态管理、逻辑复用、类组件写法麻烦等原因而提出的。Hooks 的本质可以总结如下:

1. 状态管理:Hooks 提供了 useState 等 API,让函数组件也能管理自己的状态,不再需要依赖类组件的 state 和 setState。

2. 副作用处理：Hooks 提供了 useEffect 钩子函数,可以帮助组件处理副作用,如数据请求、订阅和手动 DOM 操作等。这些在函数组件中是无法直接实现的,需要使用 Hooks 来完成。

3. 组件复用：Hooks 通过自定义钩子函数的方式实现了组件行为的复用。开发者可以将一些通用的状态管理或副作用处理逻辑封装成自定义 Hooks,在多个组件中复用。这种方式相比于 HOC 和 Render Props 模式更加简洁和直观。

4. 无状态和有状态组件的统一：在 React 16.8 版本之前,函数组件被称为"无状态组件",而 class 组件则是"有状态组件"。Hooks 的引入打破了这个界限,函数组件也可以拥有自己的状态了,从而统一了组件的编写方式。

### 为什么 React 要引入 Hooks? 主要是因为类组件存在以下问题:

1. 状态管理复杂:类组件的状态管理需要依赖 this 关键字,容易出现 this 指向问题。

2. 生命周期钩子繁琐:类组件的生命周期钩子较多,且相互之间存在耦合,容易造成代码混乱。

3. 逻辑复用困难:类组件间的逻辑复用需要依赖高阶组件、render props 等模式,增加了组件树的复杂度。
   因此,React 团队引入了 Hooks 的概念,旨在解决上述问题,让函数组件也能具备类组件的能力,同时简化组件的结构和逻辑,提高代码的可读性和可维护性。

### React hooks，它带来了哪些便利?

逻辑复用、业务代码更聚合、写法更简洁

## 有哪些常用的 hooks？

React 提供了一系列的 Hooks，用于在函数组件中添加和管理状态、副作用等功能。

1. useState：用于在函数组件中添加状态

2. useEffect：用于处理副作用操作。（数据获取、订阅、事件监听等）

3. useContext：用于在组件树中获取和使用共享的上下文

4. useReducer：用于管理复杂状态逻辑的替代方案，类似于 redux 的 reducer

5. useCallback：用于缓存回调函数，以便在依赖发生变化的时候避免重复创建新的函数实例

6. useMemo：用于缓存计算结果，以便在依赖未发生变化时避免重复计算

7. useRef：用于在函数组件之间保存可变的值，并且不会引发重新渲染

8. useLayoutEffect：与 useEffect 类似，但在浏览器完成绘制之前同步执行

9. useImperativeHandle：用于自定义暴露给父组件的实例值或者方法

10. useDebugValue：用于在开发者工具中显示自定义的钩子相关标签

## 实现一个 useState

## 实现一个 useEffect

## useRef 有什么作用？

useRef 是一个 React Hook，如果你需要一个值，在组件不断 render 时保持不变

使用 ref 可以确保：

- 可以在重新渲染之间 存储信息（普通对象存储的值每次渲染都会重置，快照）

- 改变它 不会触发重新渲染（状态变量会触发重新渲染）

- 对于组件的每个副本而言，这些信息都是本地的（外部变量则是共享的）

### 配合 ref 使用

ref 可以获取真实的 DOM 元素。

可以把 useRef() hooks 返回的变量放在 ref 中，可以存储 DOM 对象

### forwardRef

React.forwardRef()透传 Ref，也就是转发 Ref，它会创建一个 React 组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。它常用的场景为：转发 ref 到 DOM 组件。

```js
React.forwardRef((props, ref) => <></>);
```

1. 访问子组件的 DOM 节点

```js
// 子组件
const ChildrenButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 父组件：现在你可以从父组件中直接获取DOM引用
const ref = useRef();
<ChildrenButton ref={ref}>Click me!</ChildrenButton>;

ref.current.click();
```

2. 搭配 useImperativeHandle 使用

但是 React 官方说应当避免使用 ref 这样的命令式代码，所以推荐 useImperativeHandle 应当与 React.forwardRef 一起使用。所以将上述代码改为如下形式，能够实现一样的功能：

```js
const Child = React.forwardRef((props: any, ref: any) => {
  const childRef = useRef < any > null;
  // 设置父组件ref的current
  useImperativeHandle(ref, () => ({
    focus: () => {
      childRef && childRef.current.focus();
    },
  }));
  return (
    <>
      <input ref={childRef} />
      {props.children}
    </>
  );
});
const Father = () => {
  const fatherRef = useRef < any > null;
  const handleClick = () => {
    // 此处可以直接使用父组件的ref调用子组件暴露出来的focus方法了
    fatherRef.current.focus();
  };
  return (
    <div style={{ padding: 20 }}>
      <Child ref={fatherRef} />
      <button onClick={handleClick}>点击我操作子组件中的input元素</button>
    </div>
  );
};
```

3. 在高阶组件中转发 refs

一个常见的模式是为了抽象或修改子组件行为的高阶组件（HOC）。forwardRef 可以用来确保 ref 可以传递给包装组件:

```js
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log("old props:", prevProps);
      console.log("new props:", this.props);
    }

    render() {
      const { forwardedRef, ...rest } = this.props;

      // 将自定义的 prop 属性 "forwardedRef" 定义为 ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // 注意：React.forwardRef 回调的第二个参数 "ref" 传递给了LogProps组件的props.forwardedRef
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```

## useReducer

## 什么时候使用自定义 hooks

首先应该使用内置 hook，存在组件间共享逻辑的时候，应该提取 hooks

1. 关注逻辑复用

2. 关注分类

3. 封装通用逻辑

## 有哪些常件的自定义 hooks

- useRequest：模拟请求

- useSetState：管理 object 类型的 state 的 Hooks

- useDidMount：类似于类组件中的 componentDidMount，用于组件挂载后的操作

- useUnmount：类似于类组件中的 componentWillUnmount，用于组件卸载时的操作

- useDebounce：用于处理输入框内容的防抖处理，避免频繁触发请求

```js
function useDebounce(fn, delay) {
  let timerRef = useRef(null);

  return useCallback(
    (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    },
    [fn, delay]
  );
}
```

- useThrottle：用于限制某个函数的调用频率

```js
function useThrottle(fn, interval) {
  let lastRef = useRef(0);
  let timerRef = useRef(null);

  return useCallback((...args) => {
    let now = Date.now();
    clearTimeout(timerRef.current);

    if (now - lastRef.current > interval) {
      fn.apply(this, args);
      lastRef.current = now;
    } else {
      timerRef.current = setTimeout(() => {
        fn.apply(this, args);
      }, interval);
    }
  });
}
```

测试

```js
// 使用示例
function MyComponent() {
  const [value, setValue] = useState("");

  const handleChange = useDebounce((event) => {
    setValue(event.target.value);
  }, 500);

  const handleClick = useThrottle(() => {
    console.log("Clicked!");
  }, 1000);

  return (
    <div>
      <input type="text" onChange={handleChange} />
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

- useLocalStorage：便捷地使用 localStorage 存储数据

- useEventListener：用于简化事件监听器的添加和清理

- useScroll：用于监测滚动位置的变化

```js
/**
 * 自定义 Hook，用于获取当前的滚动位置
 */
const useScroll = () => {
  // 存储滚动的 x,y 坐标
  const [scrollPosition, setScrollPosition] = useState({
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  });

  // 滚动的时候设置 x,y 坐标
  const handleScroll = () => {
    setScrollPosition({
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    });
  };

  useEffect(() => {
    // 监听浏览器滚动事件
    window.addEventListener("scroll", handleScroll);

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
};
```

## 写一个 hooks, 要求用上 usecallback 的缓存特性但是返回的值是静态的

```js
function useStaticValue(initValue) {
  const getStaticValue = useCallback(() => initValue, []);
  return getStaticValue;
}

// 使用示例
function MyComponent() {
  // 返回一个静态的函数引用
  const staticValue = useStaticValue(1);
  return (
    <div>
      <p>{getStaticValue()}</p>
    </div>
  );
}
```

## 为什么不能在循环、条件或者嵌套函数中调用 hooks？

规则：不要再循环、条件或者嵌套函数中使用 Hooks，确保总是在你的 React 函数的最顶层以及任何 return 之前调用它们。

FiberNode 的 memoizedState 属性存储了 hooks 状态的对象。并且多个 hooks 状态对象通过单链表的结构按序连接，例如：

`fiber.memorizedstate(hook@)-> next(hook1)-> next(hook2)->next(hook3)->next(hook4)->...`

如果用循环、条件或者嵌套函数等方式使用 Hooks，会破坏 Hooks 的调用顺序，memoizedState 数组是按 hook 定义的顺序来放置数据的，如果 hook 顺序变化，memoizedState 并不会感知到。

单链表的每个 Hook 节点没有名字或者 key，因为除了它们的顺序，我们无法记录它们的唯一性。因为为了确保某个 Hook 是它本身，我们不能破坏这个链表的稳定性。

Hook 类型定义如下：

```js
export type Hook = {
  memoizedState: any, // 最新状态值
  baseState: any, // 初始状态值
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null, // 环形链表，存储的是该 hook 多次调用产生的更新对象
  next: Hook | null, // next 指针，之下链表中的下一个 Hook，如果为 null，证明是最后一个 Hook
};
```

## 为什么只能在 React 函数内部使用 Hooks？

react 函数提供了一个普通 js 函数没有的作用域（上下文），而这也是通过 js 的词法作用域（闭包）实现的！

## 说说你对 React Hook 闭包陷阱的理解，有哪些解决方案？

### useState 闭包陷阱

### useEffect 闭包陷阱

## 参考文档

[为什么需要 Hooks](https://chlorinec.top/2023/06/01/Development/deep-dive-react-hooks/)

[React Hooks 使用心得](https://www.cnblogs.com/ztfjs/p/hooks.html)

[一文讲透 React Hooks 闭包陷阱](https://juejin.cn/post/7230819482012237861)

[从根上理解 React Hooks 的闭包陷阱](https://juejin.cn/post/7093931163500150820)

# React 性能优化

## 在 React 中可以做哪些性能优化？

- 列表项使用 key 属性

- 类组件: 使用 shouldComponentUpdate 避免不必要的渲染

- 函数组件：
  - React.memo 避免不必要的渲染
  - useMemo、useCallback
    - useMemo 返回缓存的值
    - useCallback 返回缓存的函数
- 避免不必要的渲染
  - 合理地使用条件渲染,避免渲染无用的 DOM 元素。
  - 使用 React.Fragment 或空标签<>...</> 来替代无意义的 DOM 包裹，减少嵌套层级
- 拆分组件
  - 将大型组件拆分为更小的可重用组件,可以提高组件的复用性和渲染效率。

## useCallback 和 useMemo

### 根本区别：

1. useMemo 用于缓存计算结果值，而 useCallback 用于缓存函数引用。 更具体来说对第一个函数参数的处理方式不同，useMemo 是执行函数后缓存执行的结果，useCallback 直接对传入的函数引用进行缓存。他们都会在依赖项发生变化的时候重新执行函数。

### 意义：

1. 使用 useMemo 可以避免重复进行昂贵的计算操作,提高性能。

2. 使用 useCallback 可以避免不必要的函数重新创建,提高性能,并且可以在子组件中使用记忆函数,减少不必要的重渲染。

### 使用场景：

1. 对于一些昂贵的计算,比如大量数据的排序、过滤等操作,可以使用 useMemo 进行缓存,避免重复计算。

2. 当你在组件树中层层传递回调函数时，可以使用 useCallback 来避免不必要的函数重新创建，提高性能。

3. 如果一个组件的渲染依赖于一个复杂的对象,使用 useMemo 可以避免每次渲染都重新创建这个对象。

### 防止不必要的 effect

如果一个值被 useEffect 依赖，那它可能需要被缓存，这样可以避免重复执行 effect。

```js
const Component = () => {
  // 在 re-renders 之间缓存 a 的引用
  const a = useMemo(() => ({ test: 1 }), []);

  useEffect(() => {
    // 只有当 a 的值变化时，这里才会被触发
    doSomething();
  }, [a]);

  // the rest of the code
};
```

### 防止不必要的 re-render

三种情况会 re-render:

1. 当组件本身的 props 或者 state 改变时

2. context value 改变时，使用该值的组件会 re-render

3. 当父组件重新渲染时，它的所有的子组件会 re-render，形成一条 re-render 链

第三个 re-render 时机经常被开发者忽视，导致代码中存在大量的无效缓存。

例如：

```js
const App = () => {
  const [state, setState] = useState(1);

  const onClick = useCallback(() => {
    console.log("Do something on click");
  }, []);

  return (
    // 无论 onClick 是否被缓存，Page 都会 re-render
    <Page onClick={onClick} />
  );
};
```

当使用 setState 改变 state 时，App 会 re-render，作为子组件的 Page 也会跟着 re-render。这里 useCallback 是完全无效的，它并不能阻止 Page 的 re-render。

### 如何防止子组件 re-render

必须同时缓存 onClick 和组件本身，才能实现 Page 不触发 re-render。

```js
const PageMemoized = React.memo(Page);

const App = () => {
  const [state, setState] = useState(1);

  const onClick = useCallback(() => {
    console.log("Do something on click");
  }, []);

  return (
    // Page 和 onClick 同时 memorize
    <PageMemoized onClick={onClick} />
  );
};
```

由于使用了 React.memo，PageMemoized 会浅比较 props 的变化后再决定是否 re-render。onClick 被缓存后不会再变化，所以 PageMemoized 不再 re-render。

现在可以得出结论了，必须同时满足以下两个条件，子组件才不会 re-render：

1. 子组件自身被缓存。

2. 子组件所有的 prop 都被缓存。

那应该什么时候缓存组件，怎么判断一个组件的渲染是昂贵的？

很遗憾，似乎没有一个简单&无侵入&自动的衡量方式。通常来说有两个方式：

1. 人肉判断，开发或者测试人员在研发过程中感知到渲染性能问题，并进行判断。
2. 通过工具，目前有一些工具协助开发者在查看组件性能:

- 如 React Dev Tools Profiler
- 如这个 hooks：useRenderTimes

另外，React 在 16.5 版本后提供了 Profiler API：它可以识别出应用中渲染较慢的部分，或是可以使用类似 memoization 优化的部分。所以可以通过 puppeteer 或 cypress 在自动化集成中测试组件性能，这很适合核心组件的性能测试。

### 如何判断子组件需要缓存

我们已经了解，为了防止子组件 re-render，需要以下成本：

1. 开发者工作量的增加： 一旦使用缓存，就必须保证组件本身以及所有 props 都缓存，后续添加的所有 props 都要缓存。

2. 代码复杂度和可读性的变化：代码中出现大量缓存函数，这会增加代码复杂度，并降低易读性。

除此之外还有另外一个成本：性能成本。 组件的缓存是在初始化时进行，虽然每个组件缓存的性能耗费很低，通常不足 1ms，但大型程序里成百上千的组件如果同时初始化缓存，成本可能会变得很可观。

所以局部使用 memo，比全局使用显的更优雅、性能更好，坏处是需要开发者主动去判断是否需要缓存该子组件。

### 防止不必要的重复计算

组件渲染才是性能的瓶颈，应该把 useMemo 用在程序里渲染昂贵的组件上，而不是数值计算上。当然，除非这个计算真的很昂贵，比如阶乘计算。

### 结论

讲到这里我们可以总结出 useMemo/useCallback 使用准则了：

1. 大部分的 useMemo 和 useCallback 都应该移除，他们可能没有带来任何性能上的优化，反而增加了程序首次渲染的负担，并增加程序的复杂性。

2. 使用 useMemo 和 useCallback 优化子组件 re-render 时，必须同时满足以下条件才有效。

- 子组件已通过 React.memo 或 useMemo 被缓存
- 子组件所有的 prop 都被缓存

3. 不推荐默认给所有组件都使用缓存，大量组件初始化时被缓存，可能导致过多的内存消耗，并影响程序初始化渲染的速度。

## 使用 React.memo

React.memo 是 React 提供的一个高阶组件(Higher-Order Component,HOC),它的主要作用如下:

### 1. 性能优化

- React.memo 通过对组件的 props 进行浅层比较来决定是否需要重新渲染组件。如果 props 没有发生变化，则不会重新渲染该组件，从而提高性能。

### 2. 避免不必要的重新渲染

- 对于一些纯粹的、输入输出关系简单的组件,使用 React.memo 可以避免不必要的重新渲染,减少不必要的 DOM 操作,提高应用程序的整体性能。

## 为什么过度使用 useCallback 可能会造成性能问题？

### 1. 过度缓存函数引用

- useCallback 的作用是缓存函数引用,以避免不必要的函数重新创建。但如果滥用 useCallback,就会导致大量函数引用被缓存,占用了不必要的内存空间。

### 2. 增加渲染开销

- 每次组件渲染时,React 都需要检查 useCallback 的依赖项是否发生变化,以决定是否需要重新创建函数。如果依赖项很多,这个检查过程就会增加渲染的开销。

### 3. 增加代码复杂度

- 过度使用 useCallback 会让代码变得复杂,降低可读性和可维护性。开发者需要时刻注意函数依赖项的变化,以确保正确使用 useCallback。

### 4. 潜在的内存泄漏

- 如果 useCallback 缓存的函数引用没有被正确释放,就可能造成内存泄漏。这需要开发者格外小心,确保组件卸载时正确清理缓存的函数引用。

## 在 React 中组件为何要设置 key 属性？

### 1. 助 React 识别组件的唯一性，提高更新效率

- 当 React 渲染一个列表时，需要知道哪些项目发生了变化,哪些项目被添加或移除了。key 属性可以帮助 React 唯一标识每个列表项，从而更高效地进行比较和更新。通过 key 属性的唯一标识，React 可以更快地找到需要更新的元素，减少不必要的比较和调和操作，从而提高整体的更新效率。

### 2. 优化 DOM 操作

- 有了 key 属性,React 就可以根据 key 值识别哪些元素发生了变化,从而只更新发生变化的部分,减少不必要的 DOM 操作,提高性能。

### 3. 避免组件状态丢失

- 当列表发生变化时,如果没有设置 key 属性,React 可能会错误地认为组件没有发生变化,导致组件状态丢失。设置 key 可以确保 React 能够正确地识别组件,保持组件状态不变。

### 4. index 作为 key 是否合适？

- 涉及新增删除的场景不合适：index 设置为 key 不合适，头部新增节点后会更新多个节点
- 不涉及位置变动，只涉及修改数据的场景合适

## 参考文档

[我们应该在什么场景下使用 useMemo 和 useCallback ](https://fe.ecool.fun/topic-answer/f10c4b00-cceb-4323-97dc-55b315b05024?orderBy=updateTime&order=desc)

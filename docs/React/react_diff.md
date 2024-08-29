# React 中的 DIFF 算法

概览：

Fiber 树是边构建、边遍历、边对比的，这样最大程度减少了遍历次数，也符合「可中断」的设定。深度优先遍历。

目的是对 oldFiber 和 newChildren 进行比较，生成新的 workingProgessFiber 的过程

什么是双缓冲 fiber 树机制？

- 双缓冲 fiber 树机制，就是内存中同时存在两颗 fiber 树对象，当使用其中一个的时候，另外一个可以执行计算。fiber 树中的新旧节点之间使用 alternate 关联，可以直接对比新旧两个节点，可以快速定位实现复用或者删除。

什么是 oldFiber ？

- 就是当前已经构建好的 fiber 树，由于要通过 currentFiber 构建新的 fiber，所以 currentFiber 在 diff 过程中也称为 oldFiber

什么是 newChildren ？

- 从 workInProgress.child 属性中取出 children，这个 children 不是 fiber 节点，而是组件 render 方法根据 JSX 结构 createElement 创建的 element 数组，这点不要混淆。
- newChildren 就是在 Diff 过程中，用户构建的 JSX 对象（也可能是一个 JSX 对象数组）

diff 算法分为单节点和多节点 diff

- 单节点：object、string、number 类型。先后比较 key 和 type，相同则复用，继续递归比较子节点。不同则直接新建 fiber 节点并返回。
- 多节点：array 类型
  - 节点更新：节点属性更新（props）、节点类型更新（li -> div）
  - 节点新增或减少
  - 节点的位置变化
- 多节点更新，两轮遍历
  - 第一轮遍历：处理更新的节点（key 不变，type 不变）
  - 第二轮遍历：
    - newChildren 和 oldFiber 同时遍历完，结束
    - newChildren 遍历完 oldFiber 未完成，oldFiber 标记 DELETION
    - newChildren 未遍历完，oldFiber 遍历完，newChildren 标记 PLACEMENT
    - newChildren 和 oldFiber 都未遍历完成，根据 oldIndex 和 lastPlacedIndex 对比先后顺序
      - 如果 oldIndex >= lastPlacedIndex 保持位置不懂
      - 如果 oldIndex < lastPlaced，则需要交换位置

# 双缓冲 fiber 技术

fiber 树构建的构成就是把 ReactElement 转换成 Fiber 树的过程。在这个过程中，内存里会同时存在 2 颗 fiber 树。

- 其一：代表当前的 fiber 树。如果是初次构造，页面还没有渲染，此时界面对应的 fiber 树为空（fiberRoot.current = null）

- 其二：代表正在构造的 fiber 树。(即将展示出来, 挂载到 HostRootFiber.alternate 上, 正在构造的节点称为 workInProgress)。当构造完成之后, 重新渲染页面, 最后切换 fiberRoot.current = workInProgress, 使得 fiberRoot.current 重新指向代表当前界面的 fiber 树。

# Diffing 算法

当对比两棵树的时候，为了降低算法复杂度，React 的 diff 会预设三个限制：

1. 只对同级元素进行 Diff，如果一个 DOM 节点在前后两次更新中跨越了层级，那么 React 不会尝试复用他。

2. 对比元素

- 对比不同类型的元素：当根节点为不同类型的元素时，React 会拆卸原有的树并且建立起新的树。其他节点元素类型改变时，例如元素 div 变成 p，React 会销毁 div 及其子孙节点，并新建 p 及其子孙节点。

- 对比同一类型的元素：当对比两个相同类型的 React 元素时，React 会保留 DOM 节点，仅比对及更新有改变的属性。

- 对比同类型的组件元素：当一个组件更新时，组件实例会保持不变，因此可以在不同的渲染时保持 state 一致。React 将更新该组件实例的 props 以保证与最新的元素保持一致，并且调用该实例的 UNSAFE_componentWillReceiveProps()、UNSAFE_componentWillUpdate() 以及 componentDidUpdate() 方法。下一步，调用 render() 方法，diff 算法将在之前的结果以及新的结果中进行递归。

- 对子节点进行递归：默认情况下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。

  - 新增元素到表尾，开销较小

  - 插入到表头，更新开销较大

3. 开发者可以通过 key prop 标识移动的元素，来表示哪些子元素在不同的渲染下能保持稳定。

## Diff 是如何实现的

从根节点开始，当 currentFiber 不存在的情况下，执行 `mountChildFibers`。

当 currentFiber 存在的时候，执行 `reconcileChildFibers`

从 Diff 的入口函数 `reconcileChildFibers` 出发，函数会根据 newChild 类型调用不同的处理函数。

我们可以从同级的节点数量将 Diff 分为两类：

1. 当 `newChild` 类型为 `object`、`number`、`string`、代表同级只有一个节点，

   - 如果 newChild 是 object 类型，则有可能是 `REACT_FRAGMENT_TYPE`、`REACT_PORTAL_TYPE`、`REACT_LAZY_TYPE`
   - 如果 newChild 是 string 类型或者 number 类型，则可能是文本节点 `SINGLE_TEXT_NODE`

2. 当 `newChild` 类型为 `Array`，同级有多个节点

## 单节点 Diff 算法

1. 如果是新增节点，直接新建 fiber，没有多余的逻辑

2. 如果是对比更新：

   - 先比较元素 key 是否相同，再比较元素的 type 是否相同，都相同则复用。
   - child.sibling 逐个比较。如果不满足条件，则新建一个 fiber 节点返回

## 多节点 Diff 算法

多节点的 diff 针对的是有多个同级的 JSX 对象的情况。 `isArray(newChild)`

多节点的 DIFF 一共有三种情况：

- 节点更新
  - props 变化
- 节点新增或减少
- 节点的位置变化

节点更新的概率，高于节点新增或减少、节点的位置变化。

### 多节点 Diff 算法 reconcileChildrenArray 概述

多节点 diff，reconcileChildrenArray 方法参数的意义。

```js
function reconcileChildrenArray(
  returnFiber,
  currentFirstChild,
  newChildren,
  lanes
) {}
```

- returnFiber：代表的是父级的 fiber 节点

- currentFirstChild：代表的是 currentFiber

- newChildren: 本次更新的 JSX 对象组成的数组

- lanes：优先级相关，透传即可

单节点 diff 和多节点 diff 都是比较当前更新的 JSX 对象和 currentFiber 生成 workingProgressFiber 的过程。

currentFiber 是链表结构，通过 `currentFiber.sibling` 链表结构连接到下一个兄弟节点。而 newChildren 是数组结构。无法进行数组之间的比较。遍历数组以及类似链表的结果。基于以上情况，react 多节点 diff 要经历两轮遍历：

- 第一轮遍历：处理更新节点
- 第二轮遍历：处理剩下不属于更新的节点。

### 多节点 diff 中变量的含义

- resultingFirstChild： Diff 结束最终返回该变量，指代 workingProgressFiber，可以认为是最终需要返回的头结点。

- previousNewFiber： 是一个中间变量，当创建了 newFiber 后，通过 `previousNewFiber.sibling = newFiber` 连接上一个 fiber 节点。

- oldFiber：保存当前已经遍历到的 currentFiber，指向了当前正在进行 diff 的那个 currentFirstChild(currentFiber)

- nextOldFiber：指向了当前正在遍历的 oldFiber 的下一个 fiber

- newIdx，当前遍历到 newChildren（JSX 对象）的索引

### 第一轮遍历

第一轮遍历步骤如下：

1. let i = 0，遍历 newChildren，将 `newChildren[i]`与 `oldFiber` 比较，判断 DOM 节点是否可复用。

2. 如果可复用，i++，继续比较 `newChildren[i]` 与 `oldFiber.sibling`，可以复用则继续遍历。

3. 如果不可复用，分两种情况：

- key 不同导致不可复用，立即跳出整个遍历，第一轮遍历结束。

- key 相同 type 不同导致不可复用，会将 oldFiber 标记为 `DELETION`，并继续遍历

4. 如果 newChildren 遍历完（即 `i === newChildren.length - 1`）或者 oldFiber 遍历完（即 `oldFiber.sibling === null`），跳出遍历，第一轮遍历结束。

#### 步骤 3 跳出的遍历

key 相同 type 不同导致不可复用，会创建一个新的 fiber 节点

- createFiberFromElement(element, returnFiber.mode, lanes);
- newFiber.effectTag = Placement; 会在 commit 阶段执行 appendChild

### 第二轮遍历

1. newChildren 和 oldFiber 同时遍历完

最理想的情况，Diff 结束，无需第二轮遍历

2. newChildren 没遍历完，oldFiber 遍历完

已有的 DOM 节点都复用了，此时还有新加入的节点，意味着本次更新有新节点插入，我们只需要遍历剩下的 newChildren 为生成的 workInprogress fiber 依次记为 Placement（appendChild 新增）

3. newChildren 遍历完，oldFiber 没遍历完

意味着本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的 oldFiber，依次标记 Deletion。

4. newChildren 与 oldFiber 都没遍历完

这是 Diff 算法最精髓也是最难懂的部分，即需要处理移动的节点。我们接下来会重点讲解。

### 处理移动的节点

由于有节点改变了位置，所以不能再用位置索引 i 对比前后的节点，那么如何才能将同一个节点在两次更新中对应上呢？

我们需要使用 key。

为了快速的找到 key 对应的 oldFiber，我们将所有还未处理的 oldFiber 存入以 key 为 key，oldFiber 为 value 的 Map 中。

```js
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```

接下来遍历剩余的 newChildren，通过 `newChildren[i].key` 就能在 existingChildren 中找到 key 相同的 oldFiber。

#### 标记节点是否移动

既然我们的目标是寻找移动的节点，那么我们需要明确：节点是否移动是以什么为参照物？

我们的参照物是：最后一个可复用的节点在 oldFiber 中的位置索引（用变量 lastPlacedIndex 表示）。

由于本次更新中节点是按 newChildren 的顺序排列。在遍历 newChildren 过程中，每个遍历到的可复用节点一定是当前遍历到的所有可复用节点中最靠右的那个，即一定在 lastPlacedIndex 对应的可复用的节点在本次更新中位置的后面。

那么我们只需要比较遍历到的可复用节点在上次更新时是否也在 lastPlacedIndex 对应的 oldFiber 后面，就能知道两次更新中这两个节点的相对位置改变没有。

我们用变量 oldIndex 表示遍历到的可复用节点在 oldFiber 中的位置索引。如果 oldIndex < lastPlacedIndex，代表本次更新该节点需要向右移动。

lastPlacedIndex 初始为 0，每遍历一个可复用的节点，如果 oldIndex >= lastPlacedIndex，则 lastPlacedIndex = oldIndex。

# 参考文档

https://react.iamkasong.com/diff/prepare.html#diff%E6%98%AF%E5%A6%82%E 4%BD%95%E5%AE%9E%E7%8E%B0%E7%9A%84

https://juejin.cn/post/7202085514400038969#heading-3

https://zhuanlan.zhihu.com/p/525244896

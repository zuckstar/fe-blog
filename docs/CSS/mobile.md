# 移动端适配

## 如何做移动端的样式适配？

1. 响应式设计

- 使用 CSS 媒体查询来根据设备的特征（如屏幕宽度、高度、方向）应用不同的样式

- 通过设置百分比宽度、最大宽度或者相对单位（比如 rem）来确保元素相当于其容器的大小进行适应

```css
@media only screen and (max-width: 768px) {
  /* 小屏的样式 */
}

@media only screen and (min-width: 769px) and (max-width: 1024px) {
  /* 中屏的样式 */
}
@media only screen and (min-width: 1025px) {
  /* 大屏的样式 */
}
```

2. 弹性布局和网格布局

- 利用弹性布局（flex）和网格布局（grid）更灵活地创建布局，使页面元素能够根据屏幕大小宽度自动调整位置

3. 移动端优先

- 先定义移动端的样式，再使用媒体查询添加大屏上的样式

4. 图片和多媒体适配

- 使用 max-width： 100% 保证图片和多媒体在小屏上不会溢出容器

5. 交互友好

- 使用合适的尺寸和间隔，确保链接、按钮等可点击元素在触摸屏上更容易点击

6. 使用浏览器开发者工具检查元素并模拟不同设备的情况

## rem 单位

rem 是相对单位，是相对于 HTML 根元素的字体大小来说的，例如根元素字体大小 font-size = 12px, 则 1rem = 12px

## vw 和 vh 单位

1vw 等于视窗宽度的 1%。 vh 代表 Viewport Height，它是视窗高度的百分比。 1vh 等于视窗高度的 1%。

## 怎么让 Chrome 支持小于 12px 的文字

默认情况下，浏览器最小的字体大小限制是 12px。因此无法设置小于 12px 的文字大小。

1. 使用缩放比例：transform: scale;

```css
.text {
  transform: scale(0.8);
}
```

2. 使用 zoom： 将容器或文本元素的 zoom 属性设置为小于 1 的值，例如 zoom：0.8；

```css
.text {
  zoom: 0.8;
}
```

3. 通过 `-webkit-text-siz-adjust: none;` 可以禁用 Chrome 浏览器的最小字体的限制。

4. 使用图片替代

## 什么是硬件加速？

硬件加速就是将浏览器的渲染过程交给 GPU 处理，而不是使用自带的比较慢的渲染器。这样就可以使得 `animation` 与 `transition` 更加顺畅。

我们可以在浏览器中使用 css 开启硬件加速，使用 GPU 发挥功能，从而提升性能。

现在大多数电脑的显卡都支持硬件加速。鉴于此，我们可以发挥 GPU 力量，从而使我们的网站或应用表现的更为流畅。

## 硬件加速的原理是什么？

首先简单了解下浏览器的渲染过程：

- 渲染进程将 HTML 内容转换为能够读懂的 DOM 树结构

- 渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets, 计算出 DOM 节点的样式。

- 创建布局树，计算元素的布局信息

- 对布局树进行分层，生成分层树

- 为每个图层生成绘制列表，并将其提交到合成线程

- 合成线程将图层分成图块，并将光栅化线程池中将图块转换成位图

- 合成线程发送绘制图块命令 DrawQuad 给浏览器进程

- 浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上

普通图层和复合图层：

- 渲染图层：又称默认复合层，是页面普通的文档流。我们虽然可以通过绝对定位，相对定位，浮动定位脱离文档流，但它仍然属于默认符合层，共用一个绘图上下文对象（GraphicsContext）。

- 复合图层：它会单独分配资源（会脱离普通文档流，这样一来，不管这个复合图层中怎么变化，也不会影响默认复合层里的回流重绘。

某些特殊的渲染层会被提升为复合层，复合图层拥有单独的 GraphicsLayer，而其他不是复合图层的渲染层，则和其第一个拥有 GraphicsLayer 父层共用一个。

硬件加速：

直观上说就是依赖 GPU 实现图形绘制加速，软硬件加速的区别主要是图形的绘制究竟是 GPU 来处理还是 CPU，如果是 GPU，就认为是硬件加速绘制，反之，则为软件绘制。

一般一个元素开启硬件加速后就会变成复合图层，可以独立于普通文档流中，改动后可以避免整个页面重绘，提升性能。

常用的硬件加速方式有：

- 最常用的方式：translate3d, translateZ

- opacity 属性的过度动画

- will-change 属性

- video、iframe、canvas、webgl 等元素

硬件加速的弊端：

- 内存消耗和内存不足

- GPU 渲染影响字体的抗锯齿效果

注意点：使用硬件加速的时候，尽可能的使用 z-index， 防止浏览器默认给后续的元素创建复合层渲染。

简单理解就是隐式合成的概念：如果 a 是一个复合图层，而且 b 在 a 上面，那么 b 也会被隐式转成一个复合图层。

## 如何使用 css 来实现禁止移动端页面左右滑动的手势？

css 属性 touch-action 用于设置触摸屏用户如何操纵元素的区域

```css
html {
  touch-action: none;
  touch-action: pan-y;
}
```

## 什么是响应式设计？响应式设计的基本原理是什么？如何进行实现？

响应式设计的基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理，为了处理移动端，页面头部必须要有 meta 声明 viewport

```html
<meta
  name="viewport"
  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
/>
```

- meta：设置 viewport 不可被缩放

  - name=viewport
  - content
    - width=device-width, height=device-height
    - initial-scale=1
    - maximum-scale=1
    - user-scalable=no

- css3 媒体查询

- rem 单位

- orientationchange 手机旋转事件

- resize 手机窗口大小变化

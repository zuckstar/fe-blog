# 定位

## position: absolute 绝对定位，是相对于谁的定位？

absolute 的元素会被移出正常文档流，并不为元素预留空间。通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。

在父元素没有设置相对定位或绝对定位的情况下，元素相对于根元素定位（即 html 元素）（是父元素没有）。

## position: relative 定位

relative：相对于原来位置移动，元素设置此属性之后仍然处在文档流中，不影响其他元素的布局

## position: fixed 定位

position:fixed 的元素将相对于屏幕视口（viewport）的位置来指定其位置。并且元素的位置在屏幕滚动时不会改变。

### 失效的 position:fixed

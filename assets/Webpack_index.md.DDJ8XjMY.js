import{_ as s,c as a,o as i,a2 as p}from"./chunks/framework.DH221WtE.js";const l="/fe-blog/assets/image.zg68VFEG.png",e="/fe-blog/assets/image-1.CDmrSGyq.png",n="/fe-blog/assets/image-2.DY8zDrN4.png",t="/fe-blog/assets/image-3.CTuDobD4.png",m=JSON.parse('{"title":"Webpack 原理","description":"","frontmatter":{},"headers":[],"relativePath":"Webpack/index.md","filePath":"Webpack/index.md"}'),h={name:"Webpack/index.md"},k=p(`<h1 id="webpack-原理" tabindex="-1">Webpack 原理 <a class="header-anchor" href="#webpack-原理" aria-label="Permalink to &quot;Webpack 原理&quot;">​</a></h1><h2 id="背景" tabindex="-1">背景 <a class="header-anchor" href="#背景" aria-label="Permalink to &quot;背景&quot;">​</a></h2><p>Webpack 最初的目标是实现前端项目的模块化，旨在更高效地管理和维护项目中的每一个资源</p><h2 id="模块化" tabindex="-1">模块化 <a class="header-anchor" href="#模块化" aria-label="Permalink to &quot;模块化&quot;">​</a></h2><p>发展历程：</p><ol><li><p>文件是独立模块，通过 js 文件引入到页面，一个 script 标签对应一个模块</p><ul><li>弊端：模块都是在全局中工作，大量模块成员污染了环境，模块与模块之间并没有依赖关系、维护困难、没有私有空间等问题</li></ul></li><li><p>命名空间</p></li></ol><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">window.moduleA </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  method1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;moduleA#method1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><p>没有解决模块之间依赖关系问题</p><ol start="3"><li>使用立即函数为模块提供私有空间，通过参数的形式作为依赖声明</li></ol><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// module-a.js</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">$</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;module-a&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> method1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;#method1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    $</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;body&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">animate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ margin: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;200px&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  window.moduleA </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    method1: method1,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})(jQuery);</span></span></code></pre></div><p>同样没有解决模块依赖问题</p><h2 id="模块化规范" tabindex="-1">模块化规范 <a class="header-anchor" href="#模块化规范" aria-label="Permalink to &quot;模块化规范&quot;">​</a></h2><p>CommonJS、ES Modules</p><h2 id="开发过程中产生的问题" tabindex="-1">开发过程中产生的问题 <a class="header-anchor" href="#开发过程中产生的问题" aria-label="Permalink to &quot;开发过程中产生的问题&quot;">​</a></h2><p>现代前端开发已经变得十分的复杂，所以我们开发过程中会遇到如下的问题：</p><ul><li><p>需要通过模块化的方式来开发</p></li><li><p>使用一些高级的特性来加快我们的开发效率或者安全性，比如通过 ES6+、TypeScript 开发脚本逻辑，通过 sass、less 等方式来编写 css 样式代码</p></li><li><p>监听文件的变化来并且反映到浏览器上，提高开发的效率</p></li><li><p>JavaScript 代码需要模块化，HTML 和 CSS 这些资源文件也会面临需要被模块化的问题</p></li><li><p>开发完成后我们还需要将代码进行压缩、合并以及其他相关的优化</p></li></ul><h2 id="webpack-解决方案" tabindex="-1">webpack 解决方案 <a class="header-anchor" href="#webpack-解决方案" aria-label="Permalink to &quot;webpack 解决方案&quot;">​</a></h2><p>webpack 是一个用于现代 JavaScript 应用程序的静态模块打包工具</p><ul><li>静态模块</li></ul><p>这里的静态模块指的是开发阶段，可以被 webpack 直接引用的资源（可以直接被获取打包进 bundle.js 的资源）</p><p>当 webpack 处理应用程序时，它会在内部构建一个依赖图，此依赖图对应映射到项目所需的每个模块（不再局限 js 文件），并生成一个或多个 bundle</p><p><img src="`+l+'" alt="alt text"></p><p>webpack 能力</p><p>编译代码能力：提高效率，解决浏览器兼容问题</p><p><img src="'+e+'" alt="alt text"></p><p>模块整合能力：提高性能，可维护性，解决浏览器频繁请求文件的问题</p><p><img src="'+n+'" alt="alt text"></p><p>万物皆可模块：</p><p>项目维护性增强，支持不同种类的前端模块类型，统一的模块化方案，所有资源文件的加载都可以通过代码控制</p><h2 id="webpack-构建流程" tabindex="-1">webpack 构建流程 <a class="header-anchor" href="#webpack-构建流程" aria-label="Permalink to &quot;webpack 构建流程&quot;">​</a></h2><h3 id="_1-运行流程" tabindex="-1">1. 运行流程 <a class="header-anchor" href="#_1-运行流程" aria-label="Permalink to &quot;1. 运行流程&quot;">​</a></h3><p>webpack 的运行流程是一个串行的过程，它的工作流程就是将各个插件串联起来</p><p>在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条 webpack 机制中，去改变 webpack 的运作，使得整个系统扩展性良好</p><p>从启动到结束会依次执行以下三大步骤：</p><ul><li><p>初始化流程：从配置文件和 Shell 语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数</p></li><li><p>编译构建流程：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理</p></li><li><p>输出流程：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统</p></li></ul><p><img src="'+t+`" alt="alt text"></p><h4 id="初始化流程" tabindex="-1">初始化流程 <a class="header-anchor" href="#初始化流程" aria-label="Permalink to &quot;初始化流程&quot;">​</a></h4><p>从配置文件和 Shell 语句中读取与合并参数，得出最终的参数</p><p>配置文件默认下为 webpack.config.js，也或者通过命令的形式指定配置文件，主要作用是用于激活 webpack 的加载项和插件</p><p>webpack 将 webpack.config.js 中的各个配置项拷贝到 options 对象中，并加载用户配置的 plugins</p><p>完成上述步骤之后，则开始初始化 Compiler 编译对象，该对象掌控者 webpack 声明周期，不执行具体的任务，只是进行一些调度工作</p><p>Compiler 对象继承自 Tapable，初始化时定义了很多钩子函数</p><h4 id="编译构建流程" tabindex="-1">编译构建流程 <a class="header-anchor" href="#编译构建流程" aria-label="Permalink to &quot;编译构建流程&quot;">​</a></h4><p>根据配置中的 entry 找出所有的入口文件</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  entry: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./src/file.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h2 id="说说你对-webpack-的理解-解决了什么问题" tabindex="-1">说说你对 webpack 的理解？解决了什么问题？ <a class="header-anchor" href="#说说你对-webpack-的理解-解决了什么问题" aria-label="Permalink to &quot;说说你对 webpack 的理解？解决了什么问题？&quot;">​</a></h2><p>解决了前端项目模块化的问题，编译代码可以解决浏览器兼容性问题，支持模块整合。资源加载也可以模块化。</p>`,47),r=[k];function d(o,E,c,g,u,b){return i(),a("div",null,r)}const F=s(h,[["render",d]]);export{m as __pageData,F as default};

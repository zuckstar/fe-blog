import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "前端面试深入指南",
  description: "一个记录前端面经的个人博客",
  base: "/fe-blog/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "JavaScript", link: "/JavaScript" },
      { text: "React", link: "/React" },
      { text: "数据结构和算法", link: "/Algorithms" },
    ],

    sidebar: {
      "/JavaScript": [
        {
          text: "JavaScript 基础",
          items: [
            { text: "new 运算符", link: "/JavaScript/new" },
            { text: "闭包", link: "/JavaScript/closure" },
            { text: "浅拷贝和深拷贝", link: "/JavaScript/copy" },
            { text: "原型、原型链和继承", link: "/JavaScript/prototype" },
            {
              text: "call、apply、bind 方法",
              link: "/JavaScript/call_apply_bind",
            },
            { text: "事件", link: "/JavaScript/event.md" },
          ],
        },
      ],
      "/CSS": [
        {
          text: "CSS 基础",
          items: [
            { text: "flex 布局", link: "/CSS/flex" },
            { text: "什么是 BFC?", link: "/CSS/bfc" },
          ],
        },
      ],
      "/React": [
        {
          text: "React 技术栈",
          items: [
            { text: "React Router", link: "/React/react_router" },
            { text: "setState", link: "/React/set_state" },
            { text: "fiber 架构", link: "/React/fiber" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/zuckstar/fe-blog" },
    ],
  },
});

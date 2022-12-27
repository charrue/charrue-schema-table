import { defineConfig } from "vitepress";
import type { DefaultTheme } from "vitepress";
import { applyPlugins } from "@ruabick/md-demo-plugins";

const sidebar: DefaultTheme.Config["sidebar"] = [
  {
    text: "开始使用",
    items: [
      {
        text: "介绍",
        link: "/guide/",
      },
      {
        text: "用法",
        link: "/usages/",
      },
    ],
  },
];

export default defineConfig({
  base: "/charrue-schema-table/",
  lastUpdated: true,
  title: "Schema Table",
  description: "基于Element Plus的增强型的表格组件",
  head: [
    [
      "link",
      { rel: "stylesheet", href: "//unpkg.com/element-plus/dist/index.css" },
    ],
  ],
  themeConfig: {
    logo: "/charrue-schema-table/logo.svg",
    nav: [{ text: "开始使用", link: "/guide/" }],
    sidebar,
    socialLinks: [
      { icon: "github", link: "https://github.com/charrue-schema-table" },
    ],
  },
  markdown: {
    config: (md) => {
      applyPlugins(md);
    },
  },
  vite: {
    server: {
      host: true,
      fs: {
        allow: ["../../../"]
      }
    }
  },
});

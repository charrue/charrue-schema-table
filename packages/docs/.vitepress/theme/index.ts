import DefaultTheme from "vitepress/theme";
import DemoBlock from "@ruabick/vitepress-demo-block";
import "@ruabick/vitepress-demo-block/dist/style.css";
import "./var.css";
import "@charrue/schema-form-next/dist/styles/index.css";

export default {
  ...DefaultTheme,

  enhanceApp({ app }) {
    app.component("demo", DemoBlock);
  },
};

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import CharrueSchemaTable from "@charrue/schema-table-next";

const app = createApp(App);

app.use(ElementPlus);
app.use(CharrueSchemaTable);
app.use(router);

app.mount("#app");

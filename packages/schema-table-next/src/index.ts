import { Plugin } from "vue";
import CharrueSchemaTable, { TABLE_INDEX_KEY } from "./SchemaTable";

const plugin: Plugin = {
  install(app) {
    app.component("CharrueSchemaTable", CharrueSchemaTable);
  },
};

export default plugin;
export const { install } = plugin;
export * from "./helper";
export { CharrueSchemaTable, TABLE_INDEX_KEY };
export type { ColumnSchema, ColumnSchemaVO, TableData } from "./props";

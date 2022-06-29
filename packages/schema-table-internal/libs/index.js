import CharrueSchemaTable from "./schema-table.vue";
export default {
  install(Vue) {
    Vue.component(CharrueSchemaTable.name, CharrueSchemaTable);
  },
};

export const SchemaTable = CharrueSchemaTable;

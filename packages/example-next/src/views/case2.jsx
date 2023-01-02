import { defineComponent } from "vue";
import { CharrueSchemaTable, createColumns } from "@charrue/schema-table-next";
import { createData } from "./data";

export default defineComponent({
  name: "Case2",
  setup() {
    const data = createData(1);
    const columns = createColumns([
      ["日期", "date"],
      ["姓名", "name"],
      ["省份", "province"],
      ["id", "id", {}, { hidden: true }],
    ]);

    return () => (
      <CharrueSchemaTable data={data} columns={columns} extraColumnLabel="ID">
        {{
          actions({ row }) {
            return <div>{row.id}</div>;
          },
        }}
      </CharrueSchemaTable>
    );
  },
});

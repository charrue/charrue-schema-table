<script lang="ts" setup>
import { ref } from "vue";
import { ElButton } from "element-plus"
import { CharrueSchemaTable, createColumns } from "@charrue/schema-table-next";

const columns = createColumns([
  ["Date", "date"],
  ["Name", "name"],
  ["Address", "address"],
]);


const createData = () => {
  return Array.from({ length: 40 }).map((_, index) => {
    return {
      date: "2016-05-01",
      name: "Tom" + (index + 1),
      address: "No. 189, Grove St, Los Angeles",
    };
  });
};
const dataSource = createData();


const page = ref(1);
const pageSize = ref(10);
const total = ref(dataSource.length);

const tableData = ref(
  dataSource.slice(
    pageSize.value * (page.value - 1),
    pageSize.value * page.value,
  )
);

const onCurrentChange = (currentPage: number) => {
  page.value = currentPage;
  tableData.value = dataSource.slice(
    pageSize.value * (page.value - 1),
    pageSize.value * page.value,
  );
}

const onPageSizeChange = (size: number) => {
  pageSize.value = size;
  tableData.value = dataSource.slice(
    pageSize.value * (page.value - 1),
    pageSize.value * page.value,
  );
}

</script>

<template>
  <CharrueSchemaTable
    :data="tableData"
    :columns="columns"
    :current-page="page"
    :page-size="pageSize"
    :total="total"
    :pagination="true"
    @current-change="onCurrentChange"
    @size-change="onPageSizeChange"
    >
    <template #action="scope">
      <el-button link type="primary">查看{{ scope.row.name }}的详细数据</el-button>
    </template>
  </CharrueSchemaTable>
</template>

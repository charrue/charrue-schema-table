<script lang="ts" setup>
import { ref } from "vue"
import { ElButton } from "element-plus"
import { CharrueSchemaTable, createColumns } from "@charrue/schema-table-next"

const columns = createColumns([
  ["Date", "date",],
  ["Name", "name",],
  ["Address", "address",]
]);

const tableData = ref([
{
    date: '2016-05-03',
    name: 'Tom1',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom2',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom3',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom4',
    address: 'No. 189, Grove St, Los Angeles',
  },
]);

const indexMethod = (index: number) => {
  return index * 2
}

</script>

<template>
  <CharrueSchemaTable :data="tableData" :columns="columns" :index="indexMethod" :show-extra-column="false">
  </CharrueSchemaTable>
</template>
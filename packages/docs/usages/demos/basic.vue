<script lang="ts" setup>
import { ref } from "vue"
import { CharrueSchemaTable, createColumns } from "@charrue/schema-table-next"

const columns = createColumns([
  ["Date", "date",],
  ["Name", "name",],
  ["Address", "address",]
])
const tableData = ref([

])
</script>

<template>
  <CharrueSchemaTable :data="tableData" :columns="columns"></CharrueSchemaTable>
</template>
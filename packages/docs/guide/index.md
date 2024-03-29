

## 关于
`@charrue/schema-table-next`是一个基于Element Plus的增强型的表格组件，面向配置开发，快速搭建出表格列表页面。支持Vue3.x。

## 特性

- 基于配置的：相对于直接使用`el-table`, `el-table-column`而言，配置一个`ColumnSchema[]`对象即可获得一个表格元素


## 安装

``` bash
npm install element-plus @charrue/schema-table-next --save
```

## 简单示例

``` vue
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

</script>

<template>
  <CharrueSchemaTable :data="tableData" :columns="columns">
    <template #action="scope">
      <el-button link type="primary">查看{{ scope.row.name }}的详细数据</el-button>
    </template>
  </CharrueSchemaTable>
</template>
```

## 版本

[![schema-table-next](https://img.shields.io/npm/v/@charrue/schema-table-next.svg?style=flat-square)](https://www.npmjs.org/package/@charrue/schema-table-next)

[![NPM downloads](https://img.shields.io/npm/dt/@charrue/schema-table-next.svg?style=flat-square)](https://npmjs.org/package/@charrue/schema-table-next)
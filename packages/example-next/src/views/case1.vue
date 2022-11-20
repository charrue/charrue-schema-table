<template>
  <div>
    <div>
      <el-button @click="setLoading">setLoading</el-button>
    </div>
    <charrue-schema-table
      ref="tableRef"
      v-model:current-page="page"
      v-model:page-size="size"
      :data="data"
      :columns="columns"
      selection
      index
      index-header="序号"
      :index-props="{ width: '70px' }"
      :pagination="pagination"
      should-cache-selection
      :total="total"
      @current-change="onPageChange"
      @size-change="onSizeChange"
      @selection-change="onSelectionChange"
    >
      <template #action>
        <el-button type="primary" link>查看详情</el-button>
      </template>
    </charrue-schema-table>
  </div>
</template>
<script>
import { createData, Columns } from "./data";

const defaultData = createData(1);
let size = 10;
let page = 1;
export default {
  name: "Case1Page",
  data() {
    return {
      data: defaultData.slice(size * (page - 1), size * page),
      total: defaultData.length,
      columns: Columns,
      pagination: {
        "page-sizes": [10, 20, 30],
        background: true,
        layout: "sizes, prev, pager, next",
      },
      page: 1,
      size: 10,
    };
  },
  methods: {
    setLoading() {
      this.loading = !this.loading;
    },

    onPageChange(p) {
      this.page = p;
      page = p;
      this.data = defaultData.slice(size * (page - 1), size * page);
    },

    onSizeChange(s) {
      this.size = s;
      size = s;
      this.data = defaultData.slice(size * (page - 1), size * page);
    },

    onSelectionChange(currentSelections, allSelections) {
      console.log(currentSelections, allSelections);
    },
  },
};
</script>

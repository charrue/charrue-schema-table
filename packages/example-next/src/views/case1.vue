<template>
  <div>
    <div>
      <el-button @click="setLoading">setLoading</el-button>
    </div>
    <charrue-schema-table
      ref="tableRef"
      :loading="loading"
      :loading-options="loadingOptions"
      :data="data"
      :columns="columns"
      selection
      index
      index-header="序号"
      :index-props="{ width: '70px' }"
      pagination
      should-cache-selection
      :total="100"
      :page="page"
      @page-change="onPageChange"
    >
      <template #actions>
        <el-button type="text">查看详情</el-button>
      </template>
    </charrue-schema-table>
  </div>
</template>
<script>
import { createData, Columns } from "./data";
export default {
  name: "Case1Page",
  data() {
    return {
      data: createData(1),
      columns: Columns,
      loading: false,
      loadingOptions: {
        text: "拼命加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      },
    };
  },
  methods: {
    setLoading() {
      this.loading = !this.loading;
    },

    onPageChange(page) {
      this.page = page;
      this.data = createData(page);
    },
  },
};
</script>

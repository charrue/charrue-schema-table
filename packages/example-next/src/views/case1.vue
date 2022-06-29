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
      index-header="序号"
      :index-props="{ width: '70px' }"
      :index="1"
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
import { Data, Columns } from "./data";
export default {
  name: "Case1Page",
  data() {
    return {
      data: [].concat(Data),
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
      const random = parseInt(Math.random() * 10, 10) + page;
      this.data = Array.from({ length: random }).map((t, index) => {
        return {
          date: "2016-05-02",
          name: "王小虎" + index,
          province: "上海" + index,
          city: "普陀区" + index,
          address: "上海市普陀区金沙江路 1518 弄" + index,
          zip: 200333,
        };
      });
    },
  },
};
</script>

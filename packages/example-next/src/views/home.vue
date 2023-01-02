<template>
  <div>
    <h1>SchemaTable Examples</h1>
    <el-divider></el-divider>
    <div>
      <el-button type="primary" link @click="toPage('/case1')">基础使用</el-button>
      <el-button type="primary" link @click="toPage('/case2')">隐藏列数据</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const toPage = (path) => {
  router.push({
    path,
  });
};
</script>

<template>
  <el-table-column :label="label" :prop="prop">
    <template v-if="children && children.length > 0">
      <multi-column
        v-for="(child, index) in children"
        :key="`multi-column-${child.prop || ''}-${index}`"
        :label="child.label"
        :prop="child.prop"
        :children="child.children || []"
      ></multi-column>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "MultiColumn",
  props: {
    label: String,
    prop: [String, Number],
    children: Array,
  },
};
</script>

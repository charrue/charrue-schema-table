<template>
  <div class="charrue-schema-table-root">
    <div v-if="computedSlots.header" class="charrue-schema-table-header">
      <slot name="header" />
    </div>
    <div class="charrue-schema-table-body">
      <el-table
        ref="elTableRef"
        v-loading="loading"
        :data="tableData"
        :element-loading-text="loadingOptions && loadingOptions.text"
        :element-loading-spinner="loadingOptions && loadingOptions.spinner"
        :element-loading-background="
          loadingOptions && loadingOptions.background
        "
        v-bind="tableProps"
        @selection-change="onSelectionChange"
        v-on="events"
      >
        <!-- 多选操作 -->
        <el-table-column
          v-if="selection"
          type="selection"
          v-bind="typeof selection === 'boolean' ? {} : selection"
        />

        <!-- 表格首列之前显示索引 -->
        <el-table-column
          v-if="index"
          type="index"
          :index="computedIndex"
          v-bind="indexProps"
        >
          <template #header>
            <span v-if="indexHeader">{{ indexHeader }}</span>
            <slot
              v-if="!indexHeader && computedSlots['index-header']"
              name="index-header"
            ></slot>
          </template>
        </el-table-column>

        <!-- 行展开 -->
        <el-table-column
          v-if="computedSlots['expand']"
          type="expand"
          v-bind="expandProps"
        >
          <template #header>
            <span v-if="expandHeader">{{ expandHeader }}</span>
            <slot
              v-if="!expandHeader && computedSlots['extra-header']"
              name="extra-header"
            ></slot>
          </template>
          <template #default="props">
            <slot name="expand" :scope="props" />
          </template>
        </el-table-column>

        <!-- 遍历columns，渲染行数据 -->
        <!-- key使用name,label,index的拼接，不使用index，防止column的个数没有变化，但是值发生变化后，表头不更新 -->
        <el-table-column
          v-for="(item, idx) in columns"
          v-show="item.hidden !== true"
          :key="`${item.prop}-${item.label}-${idx}`"
          :label="item.label"
          :prop="item.prop"
          v-bind="item.attrs"
        >
          <!-- 自定义表头 -->
          <template #header>
            <!-- 多级表头 -->
            <template v-if="item.children">
              <multi-column
                v-for="(child, i) in item.children || []"
                :key="`${child.prop || ''}-${i}`"
                :label="child.label"
                :prop="child.prop"
                :children="child.children"
              />
            </template>
            <template v-else-if="computedSlots[`${item.prop}-header`]">
              <slot :name="`${item.prop}-header`" :scope="item" />
            </template>
            <span v-else>{{ item.label }}</span>
          </template>

          <!-- 自定义单元格 -->
          <template #default="scope">
            <div class="cell-wrapper">
              <template v-if="computedSlots[item.prop]">
                <slot :name="item.prop" :scope="scope" />
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column v-if="showExtraColumn" v-bind="extraColumnProps">
          <template #header>
            <template v-if="computedSlots.extraColumnHeader">
              <slot name="extraColumnHeader" />
            </template>
            <span v-else>{{ extraColumnTitle }}</span>
          </template>
          <!-- 删除操作 -->
          <template #default="scope">
            <!-- 提供插槽，展示其他的内容 -->
            <slot name="actions" :scope="scope" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="charrue-schema-table-footer">
      <div
        v-if="pagination"
        class="charrue-pagination-wrapper"
        :class="[pagination.class]"
        :style="pagination.style"
      >
        <el-pagination
          v-bind="typeof pagination === 'boolean' ? {} : pagination"
          :current-page="page"
          :total="computedTotal"
          :page-size="size"
          @update:current-page="onCurrentPageChange"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          @prev-click="handlePaginationPrevClick"
          @next-click="handlePaginationNextClick"
        />
      </div>

      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import MultiColumn from "./multi-column.vue";
import createCloneDeep from "rfdc";
const cloneDeep = createCloneDeep();

export default {
  name: "CharrueSchemaTable",
  components: {
    MultiColumn,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    /* el-table的props */
    tableProps: Object,
    /* 如果是boolean，表示启用多选模式，如果是一个对象，表示多选列的props */
    selection: [Boolean, Object],
    /** 分页多选时，是否把非当前页选中的数据记录下来 */
    shouldCacheSelection: {
      type: Boolean,
      default: false,
    },
    /* 如果是boolean，表示启用详细模式，如果是一个数组，表示详细区域需要展示的列 */
    expand: [Array, Boolean],
    /* 表格是否在加载中 */
    loading: Boolean,
    /* 加载效果的选项 */
    loadingOptions: Object,
    /* 详细区域的props */
    expandOptions: Object,
    /**
     * 扩展列表头
     */
    expandHeader: {
      type: String,
    },
    expandProps: {
      type: Object,
      default() {
        return {};
      },
    },
    /* 额外的列的props */
    extraColumnProps: {
      type: Object,
      default() {
        return {};
      },
    },
    /**
     * 如果是boolean，表示启用索引
     * 如果是一个Function，表示自定义索引,它提供当前行的行号（从 0 开始）作为参数，返回值将作为索引展示
     * 该属性传入数字时，将作为索引的起始值
     */
    index: [Function, Boolean, Number],
    /**
     * 索引列表头
     */
    indexHeader: {
      type: String,
    },
    indexProps: {
      type: Object,
      default() {
        return {};
      },
    },
    /**
     * 自定义操作列的表头文案
     */
    extraColumnTitle: {
      type: String,
      default: "操作",
    },
    /**
     * 是否展示额外的列
     */
    showExtraColumn: {
      type: Boolean,
      default: true,
    },
    pagination: [Boolean, Object],
    page: {
      type: Number,
      default: 1,
    },
    total: [Number, String],
    size: {
      type: Number,
      default: 10,
    },
  },
  emits: [
    "cell-mouse-leave",
    "size-change",
    "update:page",
    "page-change",
    "prev-click",
    "next-click",
    "selection-change",
  ],
  data() {
    return {
      events: {},
      prevPage: 0,
      prevSize: 0,
      startSelect: false,
      selectionData: {},
      cachedSelectionData: [],
      currentSelectionData: [],
    };
  },
  computed: {
    tableData() {
      if (this.shouldCacheSelection) {
        return this.data.map((item, index) => {
          return {
            ...item,
            __index__: (this.page - 1) * this.size + index + 1,
          };
        });
      }
      return cloneDeep(this.data);
    },
    computedIndex() {
      // 如果分页了，则索引序号从`size`开始计数
      if (this.index === true) {
        return (index) => this.size * (this.page - 1) + index + 1;
      }
      return this.index;
    },
    computedTotal() {
      return Number(this.total) || 0;
    },
    computedSlots() {
      return this.$slots;
    },
  },
  created() {
    // 将el-table上的公开方法放到schema-table上
    this.proxyElTableMethods();
    this.proxyElTableEvents();
    this.prevSize = this.size;
    this.prevPage = this.page;
    this.cachedSelectionData = [];
  },
  methods: {
    /**
     * @private 派发 el-pagination 的 size-change 事件
     */
    onSizeChange(size) {
      // 记录上一次的分页条数
      this.prevSize = this.size;
      this.$emit("size-change", size);

      this.currentSelectionData.forEach((item) => {
        const index = this.cachedSelectionData.findIndex(
          (t) => t.__index__ === item.__index__
        );
        if (index === -1) {
          this.cachedSelectionData.push(item);
        } else {
          this.cachedSelectionData.splice(index, 1);
        }
      });
      this.currentSelectionData = [];

      if (this.shouldCacheSelection) {
        this.restoreSelection();
      }
    },
    /**
     * el-pagination的`current-change`事件处理函数
     * 并将`update:page`和`page-change`事件 emit
     * @private
     */
    onPageChange(page) {
      // 记录上一次的页码数
      this.prevPage = this.page;
      this.$emit("update:page", page);
      this.$emit("page-change", page);

      // this.cachedSelectionData = this.cachedSelectionData.concat(this.currentSelectionData)
      this.currentSelectionData.forEach((item) => {
        const index = this.cachedSelectionData.findIndex(
          (t) => t.__index__ === item.__index__
        );
        if (index === -1) {
          this.cachedSelectionData.push(item);
        } else {
          this.cachedSelectionData.splice(index, 1);
        }
      });
      this.currentSelectionData = [];

      if (this.shouldCacheSelection) {
        // 换到下一页时，如果下一页有之前选中过的数据，则将其选中
        this.restoreSelection();
      }
    },
    onCurrentPageChange(page) {
      this.currentSelectionData.forEach((item) => {
        const index = this.cachedSelectionData.findIndex(
          (t) => t.__index__ === item.__index__
        );
        if (index === -1) {
          this.cachedSelectionData.push(item);
        } else {
          this.cachedSelectionData.splice(index, 1);
        }
      });
      this.currentSelectionData = [];

      this.$emit("update:page", page);
    },
    /**
     * @private
     */
    handlePaginationPrevClick(page) {
      this.$emit("prev-click", page);
    },
    /**
     * @private
     */
    handlePaginationNextClick(page) {
      this.$emit("next-click", page);
    },
    /**
     * 在向外emit selection-change 事件之前，先将选中的数据缓存起来
     * @private
     */
    onSelectionChange(currentSelections) {
      if (this.shouldCacheSelection) {
        this.currentSelectionData = currentSelections;
      }

      this.$emit("selection-change", currentSelections);
    },

    /**
     * 恢复之前选中的行数据
     */
    restoreSelection() {
      this.$nextTick(() => {
        this.tableData.forEach((row) => {
          const index = this.cachedSelectionData.findIndex(
            (t) => t.__index__ === row.__index__
          );
          if (index !== -1) {
            this.$refs.elTableRef.toggleRowSelection(row, true);
          }
        });
      });
    },

    /**
     * @private 把el-table的事件代理到schema-table上
     */
    proxyElTableEvents() {
      const elTableEvents = [
        "select",
        "select-all",
        "cell-mouse-enter",
        "cell-mouse-leave",
        "cell-click",
        "cell-dblclick",
        "row-click",
        "row-contextmenu",
        "row-dblclick",
        "header-click",
        "header-contextmenu",
        "sort-change",
        "filter-change",
        "current-change",
        "header-dragend",
        "expand-change",
      ];
      elTableEvents.forEach((item) => {
        this.events[item] = (...args) => {
          this.$emit(item, ...args);
        };
      });
    },
    /**
     * @private 把el-table的方法代理到schema-table上
     */
    proxyElTableMethods() {
      const elTableMethods = [
        "clearSelection",
        "toggleAllSelection",
        "toggleRowExpansion",
        "setCurrentRow",
        "clearSort",
        "clearFilter",
        "doLayout",
        "sort",
      ];
      elTableMethods.forEach((item) => {
        this[item] = (...args) => {
          this.$refs.elTableRef[item](...args);
        };
      });
    },
  },
};
</script>
import { ref, computed, defineComponent, h, nextTick } from "vue";
import { ElTable, ElPagination } from "element-plus";
import { schemaTableProps, TableData } from "./props";
import { usePropSync } from "./utils";
import {
  renderExpandColumn,
  renderExtraColumn,
  renderIndex,
  renderSelection,
  renderColumn,
} from "./render-components";

export const TABLE_INDEX_KEY = "__INDEX__";

const SchemaTable = defineComponent({
  name: "CharrueSchemaTable",
  props: schemaTableProps,
  emits: [
    "update:currentPage",
    "update:pageSize",
    "sizeChange",
    "currentChange",
    "prevClick",
    "nextClick",
    "select",
    "selectAll",
    "selectionChange",
    "cellMouseEnter",
    "cellMouseLeave",
    "cellClick",
    "cellDblclick",
    "rowClick",
    "rowContextmenu",
    "rowDblclick",
    "headerClick",
    "headerContextmenu",
    "sortChange",
    "filterChange",
    "headerDragend",
    "expandChange",
  ],
  setup(props, { emit, expose, attrs }) {
    const elTableRef = ref();

    const computedTableData = computed<TableData[]>(() => {
      if (props.shouldCacheSelection) {
        return props.data.map((item, idx) => {
          // 防止给原数组增加TABLE_INDEX_KEY属性
          Object.defineProperty(item, TABLE_INDEX_KEY, {
            configurable: false,
            writable: true,
            enumerable: false,
            value: (props.currentPage - 1) * props.pageSize + idx + 1,
          });

          return item;
        });
      }
      return props.data;
    });

    const indexColumnProps = computed(() => {
      if (typeof props.index === "function") {
        return props.index;
      }
      return (index: number) => {
        return props.pageSize * (props.currentPage - 1) + index + 1;
      };
    });

    let cachedSelectionData: TableData[][] = Array.from({
      length: props.pageSize === 0 ? 0 : Math.ceil(props.total / props.pageSize),
    }).map(() => []);

    // 分页码或条目个数 是否发生了变化
    let paginationChanged = false;
    // 记录当前分页码
    const innerCurrentPage = usePropSync(props, "currentPage");
    // 记录当前条目个数
    const innerPageSize = usePropSync(props, "pageSize");
    // 全部选择的行数据
    let allSelection: TableData[] = [];

    const restoreSelection = () => {
      const index = Math.max(0, innerCurrentPage.value - 1);

      nextTick(() => {
        cachedSelectionData[index].forEach((item) => {
          const updateIndex =
            item[TABLE_INDEX_KEY] - (innerCurrentPage.value - 1) * innerPageSize.value - 1;
          elTableRef.value?.toggleRowSelection(computedTableData.value[updateIndex], true);
        });
      });
    };

    const onSelectionChange = (currentSelections: Array<Record<string, any>>) => {
      if (props.shouldCacheSelection) {
        const index = Math.max(0, innerCurrentPage.value - 1);
        if (
          paginationChanged &&
          cachedSelectionData[index].length > 0 &&
          currentSelections.length === 0
        ) {
          // currentPage, pageSize发生变化，此时currentSelections为空数组，不需要更新cachedSelectionData
        } else {
          cachedSelectionData[index] = currentSelections;
        }

        allSelection = cachedSelectionData.flat(1);
        emit("selectionChange", currentSelections, allSelection);
        paginationChanged = false;
      } else {
        emit("selectionChange", currentSelections, []);
      }
    };

    const onCurrentPageChange = (page: number) => {
      if (props.shouldCacheSelection) {
        paginationChanged = true;
        innerCurrentPage.value = page;
        restoreSelection();
      }
      emit("currentChange", page);
    };
    const onCurrentPageUpdate = (page: number) => {
      innerCurrentPage.value = page;
      emit("update:currentPage", page);
    };

    const onPageSizeChange = (size: number) => {
      paginationChanged = true;
      innerCurrentPage.value = 1;
      innerPageSize.value = size;

      if (props.shouldCacheSelection) {
        const newSelectionData: TableData[][] = Array.from({
          length: props.pageSize === 0 ? 0 : Math.ceil(props.total / size),
        }).map(() => []);

        allSelection.forEach((item) => {
          if (typeof item[TABLE_INDEX_KEY] === "number") {
            // 根据行数据判断，改数据应该处于第几页
            // TABLE_INDEX_KEY 从1开始计算
            const targetIndex = Math.floor((item[TABLE_INDEX_KEY] - 1) / size);
            newSelectionData[targetIndex].push(item);
          }
        });

        cachedSelectionData = newSelectionData;
        restoreSelection();
      }

      emit("sizeChange", innerPageSize.value);
      emit("currentChange", innerCurrentPage.value);
    };
    const onPageSizeUpdate = (size: number) => {
      innerPageSize.value = size;
      emit("update:pageSize", size);
    };

    const onPrevClick = (page: number) => {
      emit("prevClick", page);
    };
    const onNextClick = (page: number) => {
      emit("nextClick", page);
    };

    const elTableEvents = computed(() => {
      return Object.keys(attrs)
        .filter((k) => {
          return k.startsWith("on");
        })
        .reduce((acc, cur: string) => {
          if (typeof attrs[cur] === "function") {
            acc[cur] = attrs[cur];
          }
          return acc;
        }, {} as unknown as Record<string, any>);
    });

    const elTableMethods = [
      "clearSelection",
      "getSelectionRows",
      "toggleRowSelection",
      "toggleAllSelection",
      "toggleRowExpansion",
      "setCurrentRow",
      "clearSort",
      "clearFilter",
      "doLayout",
      "sort",
      "scrollTo",
      "setScrollTop",
      "setScrollLeft",
    ];

    const exposeTableMethods = computed(() => {
      return elTableMethods.reduce((acc, cur) => {
        if (elTableRef.value && elTableRef.value[cur]) {
          acc[cur] = elTableRef.value[cur];
        }
        return acc;
      }, {} as unknown as Record<string, any>);
    });

    expose(exposeTableMethods.value);

    return {
      elTableRef,

      elTableEvents,
      indexColumnProps,
      computedTableData,

      onCurrentPageUpdate,
      onPageSizeUpdate,
      onSelectionChange,
      onCurrentPageChange,
      onPageSizeChange,
      onPrevClick,
      onNextClick,
    };
  },
  render() {
    return h(
      "div",
      {
        class: "charrue-schema-table-root",
      },
      [
        this.$slots.header
          ? h(
              "div",
              {
                class: "charrue-schema-table-header",
              },
              [this.$slots.header()],
            )
          : null,

        h(
          "div",
          {
            class: "charrue-schema-table-body",
          },
          [
            h(
              ElTable,
              {
                ref: "elTableRef",
                data: this.computedTableData,
                ...this.tableProps,
                ...this.elTableEvents,
                onSelectionChange: this.onSelectionChange,
              },
              {
                default: () => {
                  return [
                    renderSelection(this.selection),
                    renderIndex({
                      index: this.index,
                      indexProp: this.indexColumnProps,
                      columnProps: this.indexProps,
                      label: this.indexHeader,
                      $slots: this.$slots,
                    }),
                    renderExpandColumn({
                      label: this.expandHeader,
                      props: this.expandProps,
                      $slots: this.$slots,
                    }),
                    renderColumn({
                      columns: this.columns,
                      $slots: this.$slots,
                    }),
                    renderExtraColumn({
                      showExtraColumn: this.showExtraColumn,
                      label: this.extraColumnLabel,
                      props: this.extraColumnProps,
                      $slots: this.$slots,
                    }),
                  ];
                },
                append: this.$slots.append,
                empty: this.$slots.empty,
              },
            ),
          ],
        ),

        h(
          "div",
          {
            class: "charrue-schema-table-footer",
          },
          [
            this.pagination !== false
              ? h(
                  "div",
                  {
                    class: "charrue-schema-table-pagination",
                  },

                  [
                    h(ElPagination, {
                      currentPage: this.currentPage,
                      total: this.total,
                      pageSize: this.pageSize,
                      "onUpdate:current-page": this.onCurrentPageUpdate,
                      "onUpdate:page-size": this.onPageSizeUpdate,
                      "onPrev-click": this.onPrevClick,
                      "onNext-click": this.onNextClick,
                      "onSize-change": this.onPageSizeChange,
                      "onCurrent-change": this.onCurrentPageChange,
                      ...(typeof this.pagination === "boolean" ? {} : this.pagination),
                    }),
                  ],
                )
              : null,
          ],
        ),
      ],
    );
  },
});

export default SchemaTable;

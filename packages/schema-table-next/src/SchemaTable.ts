import { ref, computed, defineComponent, h, nextTick } from "vue";
import { ElTable, ElTableColumn, ElPagination } from "element-plus";
import { schemaTableProps, TableData } from "./props";
import MultiColumn from "./MultiColumn";
import { usePropSync } from "./utils";

export const TABLE_INDEX_KEY = "__INDEX__";

const SchemaTable = defineComponent({
  name: "CharrueSchemaTable",
  props: schemaTableProps,
  emits: [
    "update:current-page",
    "update:page-size",
    "size-change",
    "current-change",
    "prev-click",
    "next-click",
    "select",
    "select-all",
    "selection-change",
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
        emit("selection-change", currentSelections, allSelection);
        paginationChanged = false;
      } else {
        emit("selection-change", currentSelections, []);
      }
    };

    const onCurrentPageChange = (page: number) => {
      if (props.shouldCacheSelection) {
        paginationChanged = true;
        innerCurrentPage.value = page;
        restoreSelection();
      }
      emit("current-change", page);
    };
    const onCurrentPageUpdate = (page: number) => {
      innerCurrentPage.value = page;
      emit("update:current-page", page);
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

      emit("size-change", innerPageSize.value);
      emit("current-change", innerCurrentPage.value);
    };
    const onPageSizeUpdate = (size: number) => {
      innerPageSize.value = size;
      emit("update:page-size", size);
    };

    const onPrevClick = (page: number) => {
      emit("prev-click", page);
    };
    const onNextClick = (page: number) => {
      emit("next-click", page);
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
    const {
      columns,
      tableProps,
      selection,
      index,
      indexHeader,
      indexProps,
      showExtraColumn,
      extraColumnLabel,
      extraColumnProps,
      expandHeader,
      expandProps,
      pagination,
      currentPage,
      pageSize,
      total,

      indexColumnProps,
      elTableEvents,
      computedTableData,

      onCurrentPageUpdate,
      onPageSizeUpdate,
      onSelectionChange,
      onCurrentPageChange,
      onPageSizeChange,
      onPrevClick,
      onNextClick,

      $slots,
    } = this;

    const renderSelection = () => {
      const columnProps = typeof selection === "boolean" ? {} : selection;
      return selection
        ? h(ElTableColumn, {
            type: "selection",
            ...(columnProps || {}),
          })
        : null;
    };

    const renderExpandColumn = () => {
      return $slots.expand
        ? h(
            ElTableColumn,
            {
              ...(expandProps || {}),
              type: "expand",
            },
            {
              header: () => {
                if (expandHeader) {
                  return h("span", null, expandHeader);
                }

                if (!expandHeader && $slots["expand-header"]) {
                  return $slots["expand-header"]?.();
                }
                return null;
              },
              default: (scope: any) => {
                return $slots.expand ? $slots.expand?.(scope) : null;
              },
            },
          )
        : null;
    };

    const renderIndex = () => {
      return index
        ? h(
            ElTableColumn,
            {
              type: "index",
              index: indexColumnProps,
              ...(indexProps || {}),
            },
            {
              header: () => [
                indexHeader ? h("span", null, indexHeader) : null,
                $slots["index-header"] ? $slots["index-header"]() : null,
              ],
            },
          )
        : null;
    };

    const renderColumn = () => {
      return columns.map((item, idx) => {
        return h(
          ElTableColumn,
          {
            label: item.label,
            prop: item.prop,
            key: `${item.prop}-${item.label}-${idx}`,
            ...(item.uiProps || {}),
          },
          {
            header: () => {
              if (Array.isArray(item.children) && item.children.length > 0) {
                return item.children.map((child, i) => {
                  return h(MultiColumn, {
                    key: `multi-column-${child.prop}-${i}`,
                    label: child.label,
                    prop: child.prop,
                    uiProps: child.uiProps,
                    children: child.children || [],
                  });
                });
              }
              const propHeaderKey = `header:${item.prop}`;
              if ($slots[propHeaderKey]) {
                return $slots[propHeaderKey]?.(item);
              }

              return h("span", null, item.label);
            },
            default: (scope: any) => {
              return h(
                "div",
                {
                  class: "cell-wrapper",
                },
                [$slots[item.prop] ? $slots[item.prop]?.() : h("span", null, scope.row[item.prop])],
              );
            },
          },
        );
      });
    };

    const renderExtraColumn = () => {
      return showExtraColumn
        ? h(
            ElTableColumn,
            {
              ...(extraColumnProps || {}),
            },
            {
              header: () => {
                return $slots["extra-column-header"]
                  ? $slots["extra-column-header"]?.()
                  : h("span", null, extraColumnLabel);
              },
              default: (scope: any) => {
                return $slots.action ? $slots.action?.(scope) : null;
              },
            },
          )
        : null;
    };

    return h(
      "div",
      {
        class: "charrue-schema-table-root",
      },
      [
        $slots.header
          ? h(
              "div",
              {
                class: "charrue-schema-table-header",
              },
              [$slots.header()],
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
                data: computedTableData,
                ...tableProps,
                ...elTableEvents,
                "onSelection-change": onSelectionChange,
              },
              {
                default: () => {
                  return [
                    renderSelection(),
                    renderIndex(),
                    renderExpandColumn(),
                    renderColumn(),
                    renderExtraColumn(),
                  ];
                },
                append: $slots.append,
                empty: $slots.empty,
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
            pagination !== false
              ? h(
                  "div",
                  {
                    class: "charrue-schema-table-pagination",
                  },

                  [
                    h(ElPagination, {
                      currentPage,
                      total,
                      pageSize,
                      "onUpdate:current-page": onCurrentPageUpdate,
                      "onUpdate:page-size": onPageSizeUpdate,
                      "onPrev-click": onPrevClick,
                      "onNext-click": onNextClick,
                      "onSize-change": onPageSizeChange,
                      "onCurrent-change": onCurrentPageChange,
                      ...(typeof pagination === "boolean" ? {} : pagination),
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

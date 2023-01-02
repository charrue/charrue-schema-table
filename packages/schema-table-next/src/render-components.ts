import { h } from "vue";
import { ElTableColumn } from "element-plus";
import MultiColumn from "./MultiColumn";

import { ElTableColumnProps, ColumnSchemaVO } from "./props";

export const renderIndex = (options: {
  index: ElTableColumnProps["index"] | boolean;
  indexProp: ElTableColumnProps["index"];
  columnProps: Omit<Partial<ElTableColumnProps>, "index" | "props">;
  label: string;
  $slots: Record<string, any>;
}) => {
  const { index, indexProp, columnProps, label, $slots } = options;
  return index
    ? h(
        ElTableColumn,
        {
          type: "index",
          index: indexProp,
          ...(columnProps || {}),
        },
        {
          header: (scope: any) => [
            $slots["index-header"]
              ? $slots["index-header"](scope)
              : label
              ? h("span", null, label)
              : null,
          ],
        },
      )
    : null;
};

export const renderExtraColumn = (options: {
  showExtraColumn: boolean;
  label: string;
  props: Record<string, any>;
  $slots: Record<string, any>;
}) => {
  const { showExtraColumn = true, label = "", props = {}, $slots = {} } = options;
  return showExtraColumn
    ? h(ElTableColumn, props, {
        header: () => {
          return $slots["extra-column-header"]
            ? $slots["extra-column-header"]?.()
            : h("span", null, label);
        },
        default: (scope: any) => {
          return $slots.actions ? $slots.actions?.(scope) : null;
        },
      })
    : null;
};

export const renderSelection = (selection: boolean) => {
  const columnProps = typeof selection === "boolean" ? {} : selection;
  return selection
    ? h(ElTableColumn, {
        type: "selection",
        ...(columnProps || {}),
      })
    : null;
};

export const renderExpandColumn = (options: {
  label: string;
  props: Record<string, any>;
  $slots: Record<string, any>;
}) => {
  const { label = "", props = {}, $slots = {} } = options;
  return $slots.expand
    ? h(
        ElTableColumn,
        {
          ...props,
          type: "expand",
        },
        {
          header: (scope: any) => {
            if (label) {
              return h("span", null, label);
            }

            if (!label && $slots["expand-header"]) {
              return $slots["expand-header"]?.(scope);
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

export const renderColumn = (options: {
  columns: ColumnSchemaVO[];
  $slots: Record<string, any>;
}) => {
  const { columns = [], $slots = {} } = options;
  const visibleColumns = columns.filter((item) => {
    return item.hidden !== true;
  });
  return visibleColumns.map((item, idx) => {
    return h(
      ElTableColumn,
      {
        label: item.label,
        prop: item.prop,
        key: `${item.prop}-${item.label}-${idx}`,
        ...(item.uiProps || {}),
      },
      {
        header: (scope: any) => {
          // 多级表头
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
          // 表头动态插槽名
          const propHeaderKey = `header:${item.prop}`;
          if ($slots[propHeaderKey]) {
            return $slots[propHeaderKey]?.(scope);
          }

          return h("span", null, item.label);
        },
        default: (scope: any) => {
          return h(
            "div",
            {
              class: "cell-wrapper",
            },
            [
              $slots[item.prop]
                ? $slots[item.prop]?.(scope)
                : h("span", null, scope.row[item.prop]),
            ],
          );
        },
      },
    );
  });
};

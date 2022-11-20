import { defineComponent, h } from "vue";
import { ElTableColumn } from "element-plus";
import { multiColumnProps } from "./props";

export type ElTableColumnProps = InstanceType<typeof ElTableColumn>;

const MultiColumn = defineComponent({
  name: "MultiColumn",
  props: multiColumnProps,
  render() {
    const { label, prop, uiProps, children } = this;

    return h(
      ElTableColumn,
      {
        label,
        prop,
        ...(uiProps || {}),
      } as unknown as ElTableColumnProps,
      children?.length > 0
        ? children.map((item, index) =>
            h(MultiColumn, {
              prop: item.prop,
              label: item.label,
              key: `multi-column-${item.prop || ""}-${index}`,
              uiProps: item.uiProps || {},
              children: item.children || [],
            }),
          )
        : [],
    );
  },
});

export default MultiColumn;

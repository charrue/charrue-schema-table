import { ColumnSchema, ElTableColumnProps, ColumnViewObject } from "./props";

type Label = string;
type Prop = string;
export const createColumns = (
  configs: Array<[Label, Prop, Partial<ElTableColumnProps>?, ColumnViewObject?]>,
): ColumnSchema[] => {
  return configs.map((t) => {
    const [label, prop, props = {}, vo = {}] = t;
    return {
      label,
      prop,
      uiProps: props,
      ...vo,
    };
  });
};

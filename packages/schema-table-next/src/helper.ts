import { ColumnSchema, ElTableColumnProps } from "./props";

export const createColumn = (
  configs: Array<[string, string, Partial<ElTableColumnProps>?]>,
): ColumnSchema[] => {
  return configs.map((t) => {
    const [label, prop, props = {}] = t;
    return {
      label,
      prop,
      uiProps: props,
    };
  });
};

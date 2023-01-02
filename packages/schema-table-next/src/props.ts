import { PropType } from "vue";
import { ElTable, ElTableColumn, ElPagination } from "element-plus";

type TableProps = Omit<InstanceType<typeof ElTable>["$props"], "data">;

export type ElTableColumnProps = Omit<
  InstanceType<typeof ElTableColumn>["$props"],
  "label" | "prop"
>;

export type PaginationObjectProps = Omit<
  InstanceType<typeof ElPagination>["$props"],
  "current-page" | "page-size" | "total"
>;

export interface ColumnSchema {
  label: string;
  prop: string;
  uiProps?: Record<string, any>;
  children?: ColumnSchema[];
}

export interface ColumnViewObject {
  hidden?: boolean;
}
export interface ColumnSchemaVO extends ColumnSchema, ColumnViewObject {}

export type TableData = Record<string, any>;

export const schemaTableProps = {
  data: {
    type: Array as PropType<TableData[]>,
    default() {
      return [];
    },
  },
  columns: {
    type: Array as PropType<ColumnSchemaVO[]>,
    default() {
      return [];
    },
  },
  tableProps: {
    type: Object as PropType<TableProps>,
    default() {
      return {};
    },
  },
  shouldCacheSelection: {
    type: Boolean,
    default: false,
  },
  showExtraColumn: {
    type: Boolean,
    default: true,
  },
  extraColumnLabel: {
    type: String,
    default: "操作",
  },
  extraColumnProps: {
    type: Object as PropType<ElTableColumnProps>,
    default() {
      return {};
    },
  },
  expandHeader: {
    type: String,
    default: "",
  },
  expandProps: {
    type: Object as PropType<ElTableColumnProps>,
    default() {
      return {};
    },
  },
  selection: {
    type: [Boolean, Object] as PropType<boolean | any>,
    default: false,
  },
  index: {
    type: [Boolean, Number, Function] as PropType<
      NonNullable<ElTableColumnProps["index"]> | boolean
    >,
    default: false,
  },
  indexHeader: {
    type: String,
    default: "",
  },
  indexProps: {
    type: Object,
    default() {
      return {};
    },
  },
  pagination: {
    type: [Boolean, Object] as PropType<boolean | PaginationObjectProps>,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
};

export const multiColumnProps = {
  label: {
    type: String,
    default: "",
  },
  prop: {
    type: String,
    default: "",
  },
  uiProps: {
    type: Object,
    default() {
      return {};
    },
  },
  children: {
    type: Array as PropType<ColumnSchema[]>,
    default() {
      return [];
    },
  },
};

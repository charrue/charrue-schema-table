export const Columns = [
  { label: "日期", prop: "date" },
  { label: "姓名", prop: "name" },
  { label: "省份", prop: "province" },
  { label: "地址", prop: "city" },
  { label: "邮编", prop: "zip" },
];

export const createData = (page) => {
  return Array.from({ length: 10 }).map((_, index) => {
    return {
      id: (page - 1) * 10 + index,
      date: "2016-05-03",
      name: `第${page}页第${index + 1}行`,
      province: "上海",
      city: "普陀区",
      address: "上海市普陀区金沙江路 1516 弄",
      zip: 200333,
    };
  });
};

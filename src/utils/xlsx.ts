// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-with-styles";

export const get_excel_to_json = (file: any) => {
  return new Promise((resove) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e: any) {
      const wb = XLSX.read(e.target.result, { type: "binary", cellStyles: true });
      const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      resove(json);
    };
  });
};

export const export_json_to_excel = ({
  header = {},
  list = [],
  sheetName = 'sheetName',
  fileName = 'filename',
  autoWidth = true,
}) => {
  const book = XLSX.utils.book_new();
  let sheetItem = XLSX.utils.json_to_sheet([header, ...list], {
    // header: Object.keys(header),
    cellDates: true,
    skipHeader: true,
  });

  // const style = {
  //   fill: {
  //     fgColor: { rgb: "FF9bc2e6" },
  //     bgColor: { rgb: "FF9bc2e6" },
  //   },
  // }

  // const range = sheetItem['!ref']

  // const start = '1'
  // const end = range?.split(':')[1].slice(1)

  // Object.keys(sheetItem).forEach(key => {
  //   if ((key.length === 2 && key.endsWith(start)) || key.endsWith(end!)) {
  //     sheetItem[key].s = style
  //   }
  // })

  autoWidth && auto_width(sheetItem, json_to_array(Object.keys(header), list));
  XLSX.utils.book_append_sheet(book, sheetItem, sheetName);
  XLSX.writeFile(book, fileName + ".xlsx");
};

const auto_width = (sheetItem: any, data: any[]) => {
  const maxWidth = 50;
  /*set worksheet max width per col*/
  const colWidth = data.map((row: string[]) =>
    row.map((val) => {
      let width = 0;
      /*if null/undefined*/
      if (val !== null && val !== undefined) {
        if (val.toString().charCodeAt(0) > 255) {
          width = val.toString().length * 2;
        } else {
          width = val.toString().length;
        }
      } else {
        width = 10;
      }
      return {
        wch: width > maxWidth ? maxWidth : width,
      };
    })
  );
  /*start in the first row*/
  const result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j].wch < colWidth[i][j].wch) {
        result[j].wch = colWidth[i][j].wch;
      }
    }
  }
  sheetItem["!cols"] = result;
};

const json_to_array = (key: string[], jsonData: any[]) => {
  const data = jsonData.map((v) => key.map((j) => v[j] + "站位"));
  return data;
};

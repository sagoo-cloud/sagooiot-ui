import { get, post, del, put } from "/@/utils/request";
export default {
  config: {
    getList: (params: object) => get("/notice/config/list", params),
    add: (data: object) => post("/notice/config/add", data),
    delete: (ids: number) => del("/notice/config/delete", { ids }),
    edit: (data: object) => put("/notice/config/edit", data),
    detail: (id: number) => get("/notice/config/get", { id }),
    save: (data: object) => post("/system/plugins_config/save", data),
    getbyname: (data: object) => get("/system/plugins_config/getbyname", data),
  },
  template: {
    getList: (params: object) => get("/notice/template/list", params),
    add: (data: object) => post("/notice/template/add", data),
    delete: (ids: number) => del("/notice/template/delete", { ids }),
    edit: (data: object) => put("/notice/template/edit", data),
    save: (data: object) => put("/notice/template/save", data),
    detail: (id: number) => get("/notice/template/get", { id }),
    configIddetail: (configId: number) => get("/notice/template/getbyconfig", { configId }),
  },
};

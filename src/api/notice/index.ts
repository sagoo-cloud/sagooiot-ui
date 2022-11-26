import { get, post, del, put } from "/@/utils/request";

export default {
  config: {
    getList: (params: object) => get("/notice/config/list", params),
    add: (data: object) => post("/notice/config/add", data),
    delete: (ids: number) => del("/notice/config/delete", { ids }),
    edit: (data: object) => put("/notice/config/edit", data),
    detail: (id: number) => get("/notice/config/get", { id }),
  },
  template: {
    getList: (params: object) => get("/notice/template/list", params),
    add: (data: object) => post("/notice/template/add", data),
    delete: (ids: number) => del("/notice/template/del", { ids }),
    edit: (data: object) => put("/notice/template/edit", data),
    detail: (id: number) => get("/notice/template/get", { id }),
  },
};

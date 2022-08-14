export interface MenuBtnRow {
  id?: number; // ID
  parentId: number; // 父ID
  menuId?: number | undefined; // 菜单ID
  name: string;// 名称
  types: string | 'add' | 'edit' | 'del'; // 自定义 add添加 edit编辑 del 删除
  description?: string; // 描述
  status: 0 | 1; // 0 停用 1启用
}

export interface MenuListRow {
  id?: number; // ID
  parentId: number; // 父ID
  menuId?: number | undefined; // 菜单ID
  name: string;// 名称
  code: string; // 列表 key
  description?: string; // 描述
  status: 0 | 1; // 0 停用 1启用
}
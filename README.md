# sagoo-admin-ui

业务管理系统前端

### 依赖安装方式

用 yarn 安装依赖

1. 全局安装yarn： npm i yarn -g ,如果是非windows环境需要加 sudo
2. 用yarn在项目中安装依赖： yarn i

### 环境变量配置

**.env** 

| 为默认环境配置，不可修改，会导致线上使用异常

**.env.development**

| 开发环境配置，可在此配置开发环境，开发使用时会覆盖默认配置

**.env.development.local**

| 可在本地添加此文件进行配置，会覆盖默认配置及【.env.development】的配置，并且git会忽略这个文件，不会对其他的开发者的环境造成影响


<el-form :model="params" inline ref="queryRef" @submit.prevent @keyup.enter="queryList">

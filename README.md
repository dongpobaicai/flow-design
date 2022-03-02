# flow-design

- 因为 `@antv/x6` 不支持 vue3，故采用 vue2 + @antv/x6 + element ui
- 需要 vue 开启运行包含编辑器的版本 `runtimeCompiler: true`

## 展示效果

![界面效果](https://dongpobaicai.github.io/vuepress-githubpages/flow.png)

## 项目结构

- src/components
  - src/components/node  节点实例
  - src/components/FlowDesign  设计器
  - src/components/Menu  菜单栏
- src/hooks
  - src/hooks/nodeConfigs 节点配置
  - src/hooks/nodeConfigs 设计器实例
  - src/hooks/nodeUtil 节点操作工具类

## 扩展新的节点

1. 提供配置文件
2. 注册节点配置 `registerNode(getConditionConfig(this));`
3. 创建节点 `createNode()`


## 功能

- [+]添加开始节点，发起人
- [+]审核节点
- [+]条件节点
- [+]结束节点

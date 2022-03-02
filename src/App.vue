<template>
  <div class="flow-container">
    <Menu />
    <FlowDesign />
  </div>
</template>

<script lang="ts">
import Menu from "./components/Menu.vue";
import FlowDesign from "./components/FlowDesign.vue";

export default {
  components: {
    Menu,
    FlowDesign,
  },
  data() {
    return {};
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style lang="less">
.x6-node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .line {
    width: 2px;
    height: 20px;
    background-color: #a2b1c3;
  }
  .el-icon-circle-plus-outline {
    font-size: 25px;
    margin-top: -2px;
    cursor: pointer;
  }
}
.x6-node-card {
  width: 100%;
  height: 100%;
  /deep/ .el-card__body {
    padding: 5px;
  }
}
// node节点选中高亮
.x6-node-selected {
  .x6-node-card {
    box-shadow: 0px 0px 8px rgba(1, 113, 241, 1) !important;
  }
}
.x6-node-card-pass {
  box-shadow: 0px 0px 8px rgb(103, 194, 58);
}

.x6-node-card-not-pass {
  box-shadow: 0px 0px 8px rgb(245, 108, 108);
}

.x6-node-card-not-repulse {
  box-shadow: 0px 0px 8px rgb(230, 162, 60);
}
</style>

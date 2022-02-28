<template>
  <div class="x6-end-node">结束</div>
</template>


<script>
export default {
  inject: ["getGraph", "getNode"],
  props: {
    isEdit: {}
  },
  data() {
    return {
      data: this.getNode().data
    };
  }
};
</script>


<style lang="less" scoped>
.x6-end-node{
  width: 100px;
  height: 50px;
  border-radius: 50px;
  border: 2px solid #eee;
  text-align: center;
  line-height: 50px;
}

// node节点选中高亮
.x6-node-selected {
  .x6-end-node {
    box-shadow: 0px 0px 8px rgba(1, 113, 241, 1)!important;
  }
}


</style>














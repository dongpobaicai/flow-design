<template>
  <el-popover
    v-if="isEdit"
    placement="top"
    trigger="click"
    ref="addBtn"
  >
    <div>
      <el-button
        size="mini"
        type="primary"
        :disabled="!data.isShowAddApprovalBtn"
        @click="addApprovalNode('ApprovalNode')"
        >审核节点</el-button
      >
      <el-button size="mini" type="primary" @click="addLaunchNode"
        >发起人</el-button
      >
    </div>
    <div slot="reference" class="x6-end-node">
      <i class="el-icon-circle-plus-outline"></i>
    </div>
  </el-popover>
  <div v-else class="x6-end-node disabled">
    <i class="el-icon-circle-plus-outline"></i>
  </div>
</template>

<script>
export default {
  inject: ["getGraph", "getNode"],
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data: this.getNode().data,
    };
  },
  methods: {
    addApprovalNode(key) {
      this.$refs.addBtn.$data.showPopper = false;

      this.$parent.addApprovalNode({
        key: key,
        node: this.getNode(),
        graph: this.getGraph(),
      });
    },
    addLaunchNode() {
      this.$refs.addBtn.$data.showPopper = false;
      this.$parent.addLaunchNode({
        node: this.getNode(),
        graph: this.getGraph(),
      });
    },
  },
};
</script>

<style lang="less" scoped>
.x6-end-node {
  display: flex;
  justify-content: center;
  width: 100px;
  height: 25px;
  &.disabled {
    .el-icon-circle-plus-outline {
      color: #ccc;
      cursor: not-allowed;
    }
  }
  .el-icon-circle-plus-outline {
    font-size: 25px;
    cursor: pointer;
  }
}
</style>

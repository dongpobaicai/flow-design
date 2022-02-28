<template>
  <div class="x6-start-node">
    <div style="max-width: 70px; overflow: hidden">{{ data.name }}</div>
    <!-- 发起人节点 -->
    <template v-if="isEdit">
      <el-popover placement="top" trigger="click" ref="addBtn">
        <div>
          <el-button size="mini" type="primary" :disabled="!data.isShowAddApprovalBtn" @click="addApprovalNode('approvalNode')">审核节点</el-button>
          <el-button size="mini" type="primary" :disabled="!data.isShowConditionBtn" @click="addApprovalNode('conditionNode')">条件</el-button>
          <el-button size="mini" type="primary" @click="addLaunchNode">发起人</el-button>
        </div>

        <i slot="reference" class="el-icon-folder-add" style="cursor: pointer; color: #409eff"></i>
      </el-popover>
      <!-- 不是第一个发起人才有删除发起人节点功能 -->
      <el-popover placement="top" trigger="click" ref="deleteBtn" v-if="!data.isFirstLaunchNode && !data.isStartNode">
        <div>
          是否确认删除
          <el-button size="mini" @click="deleteNode" type="danger">确认</el-button>
        </div>

        <i slot="reference" class="el-icon-delete" style="cursor: pointer; color: red; margin-left: 3px"></i>
      </el-popover>
    </template>
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
    addLaunchNode() {
      this.$refs.addBtn.$data.showPopper = false;
      this.$parent.addLaunchNode({
        node: this.getNode(),
        graph: this.getGraph(),
      });
    },
    deleteNode() {
      this.$refs.deleteBtn.$data.showPopper = false;
      this.$parent.removeNode({
        node: this.getNode(),
        graph: this.getGraph(),
      });
    },
    addApprovalNode(key) {
      this.$refs.addBtn.$data.showPopper = false;
      this.$parent.addApprovalNode({
        key: key,
        node: this.getNode(),
        graph: this.getGraph(),
      });
    },
  },
};
</script>

<style lang="less" scoped>
.x6-start-node {
  width: 100px;
  height: 50px;
  border-radius: 50px;
  border: 2px solid #eee;
  text-align: center;
  line-height: 50px;
  display: flex;
  justify-content: center;
}

// node节点选中高亮
.x6-node-selected {
  .x6-start-node {
    box-shadow: 0px 0px 8px rgba(1, 113, 241, 1) !important;
  }
}
</style>

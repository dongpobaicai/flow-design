<!-- 审批节点 -->
<template>
  <div class="x6-node-content">
    <template v-if="viewMode">
      <el-popover placement="top-start" title="" width="400" trigger="hover">
        <div>{{ data.name }}:</div>
        <div style="word-wrap: break-word">
          审核人：
          <span
            style="width: auto; margin-left: 5px"
            :style="{ color: item.colorStatus == 1 ? '#00982D' : item.colorStatus == 2 ? 'rgb(230, 162, 60)' : item.color == 3 ? 'rgb(245, 108, 108)' : '#606266' }"
            v-for="(item, index) in data.auditUsers"
            :key="index"
            >{{ item.name }};</span
          >
        </div>
        <div style="word-wrap: break-word">
          抄送人：
          <span v-for="(item, index) in data.noticeUsers" :key="index">{{ item.name }};</span>
        </div>
        <div style="word-wrap: break-word">
          审核意见：
          <span style="width: auto; margin-left: 5px" v-for="(item, index) in data.auditUsers" :key="index">
            <span v-if="item.reviewComments"> {{ item.reviewComments }}({{ item.name }}); </span>
          </span>
        </div>
        <el-card
          slot="reference"
          class="x6-approval-node-card x6-node-card"
          :class="{ 'x6-node-card-pass': data.reviewStatus == 1, 'x6-node-card-not-pass': data.reviewStatus == 2, 'x6-node-card-not-repulse': data.reviewStatus == 3 }"
          shadow="hover"
        >
          <el-row class="approval-title" type="flex" justify="space-between">
            <div>
              <i class="el-icon-s-custom" style="color: #409eff"></i>
              {{ data.name ? data.name : "" }}
            </div>

            <div>
              <template v-if="isEdit">
                <el-popover placement="top" trigger="click" ref="deleteBtn">
                  <div>
                    是否确认删除
                    <el-button size="mini" @click="deleteNode" type="danger">确认</el-button>
                  </div>

                  <i slot="reference" class="el-icon-delete" style="cursor: pointer; color: red"></i>
                </el-popover>
              </template>
            </div>
          </el-row>
        </el-card>
      </el-popover>
    </template>
    <el-card v-else slot="reference" class="x6-approval-node-card x6-node-card" shadow="hover">
      <el-row class="approval-title" type="flex" justify="space-between">
        <div>
          <i class="el-icon-s-custom" style="color: #409eff"></i>
          {{ data.name ? data.name : "" }}
        </div>

        <div>
          <template v-if="isEdit">
            <el-popover placement="top" trigger="click" ref="deleteBtn">
              <div>
                是否确认删除
                <el-button size="mini" @click="deleteNode" type="danger">确认</el-button>
              </div>

              <i slot="reference" class="el-icon-delete" style="cursor: pointer; color: red"></i>
            </el-popover>
          </template>
        </div>
      </el-row>
    </el-card>

    <div class="line" :style="{ height: isEdit ? '20px' : '52px' }"></div>
    <el-popover placement="top" trigger="click" ref="addBtn">
      <div>
        <el-button size="mini" type="primary" :disabled="!data.isShowAddApprovalBtn" @click="addApprovalNode('approvalNode')">审批节点</el-button>
        <el-button size="mini" type="primary" :disabled="!data.isShowConditionBtn" @click="addApprovalNode('conditionNode')">条件</el-button>
        <el-button size="mini" type="primary" @click="addLaunchNode">发起人</el-button>
      </div>
      <i v-if="isEdit" slot="reference" class="el-icon-circle-plus-outline" data-name="plus-btn"></i>
    </el-popover>
  </div>
</template>

<script>
export default {
  inject: ["getGraph", "getNode"],
  props: {
    isEdit: {},
    viewMode: {},
  },
  data() {
    return {
      nodes: [],
      data: this.getNode().data,
    };
  },
  methods: {
    deleteNode() {
      this.$refs.deleteBtn.$data.showPopper = false;

      this.$parent.removeNode({
        node: this.getNode(),
        graph: this.getGraph(),
      });
    },
    addLaunchNode() {
      this.$refs.addBtn.$data.showPopper = false;
      this.$parent.addLaunchNode({ node: this.getNode(), graph: this.getGraph() });
    },
    addApprovalNode(key) {
      this.$refs.addBtn.$data.showPopper = false;

      this.$parent.addApprovalNode({
        key: key,
        node: this.getNode(),
        graph: this.getGraph(),
      });
    },
  }
};
</script>

<style lang="less" scoped>
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

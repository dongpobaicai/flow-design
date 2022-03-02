<!-- 审批节点 -->

<template>
  <div class="x6-node-content">
    <!-- 预览模式 -->
    <template v-if="viewMode">
      <el-popover placement="top-start" title="" width="400" trigger="hover">
        <div>{{ data.name }}:</div>
        <div>
          发起人属于：<template v-for="item in data.studentType">{{ item.value }};</template><br />
          <!-- 且专业类型为：{{ data.professionalType.key == 88888 ? "不限" : data.professionalType.value }}；<br /> -->
          且专业类型为：<template v-for="item in data.professionalType">{{ item.value }};</template><br />
          且请假时长满足:{{ data.option != "option1" ? `请假${data.option}${data.days}天` : `${data.leftSymbol}${data.minDays}且${data.rightSymbol}${data.maxDays}天` }}
        </div>

        <el-card slot="reference" class="x6-approval-node-card x6-node-card" shadow="hover">
          <el-row class="approval-title" type="flex" justify="space-between">
            <div>
              <svg t="1642595227813" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1999" width="14" height="14">
                <path
                  d="M244.9408 881.2544l-58.7776-57.0368 285.4912-294.2976V41.1648h81.92v521.9328L244.9408 881.2544zM547.75808 640.73728l59.20768-56.6272 228.096 238.53056-59.20768 56.6272z"
                  fill="#1296db"
                  p-id="2000"
                ></path>
                <path d="M81.92 982.8352l230.4-42.5984-187.8016-187.6992L81.92 982.8352zM942.1824 983.04l-230.4-42.5984 187.8016-187.6992L942.1824 983.04z" fill="#1296db" p-id="2001"></path>
              </svg>
              <!-- <i class="el-icon-s-custom" style="color:#409eff"></i> -->
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
    <el-card v-else class="x6-approval-node-card x6-node-card" shadow="hover">
      <el-row class="approval-title" type="flex" justify="space-between">
        <div>
          <svg t="1642595227813" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1999" width="14" height="14">
            <path
              d="M244.9408 881.2544l-58.7776-57.0368 285.4912-294.2976V41.1648h81.92v521.9328L244.9408 881.2544zM547.75808 640.73728l59.20768-56.6272 228.096 238.53056-59.20768 56.6272z"
              fill="#1296db"
              p-id="2000"
            ></path>
            <path d="M81.92 982.8352l230.4-42.5984-187.8016-187.6992L81.92 982.8352zM942.1824 983.04l-230.4-42.5984 187.8016-187.6992L942.1824 983.04z" fill="#1296db" p-id="2001"></path>
          </svg>
          <!-- <i class="el-icon-s-custom" style="color:#409eff"></i> -->
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
    isEdit: {
      type: Boolean,
      default: true
    },
    viewMode: {},
  },
  data() {
    return {
      nodes: [],
      data: Object.assign(this.getNode().data),
      toNode: null,
    };
  },
  methods: {
    getstatus(type) {
      if (type == 1) {
        return "";
      } else if (type == 2) {
        return "";
      } else if (type == 3) {
        return "";
      }
    },
    showSelect(e) {
      if (e) {
        this.nodes = this.getGraph().getNodes();
      }
    },
    addLaunchNode() {
      this.$refs.addBtn.$data.showPopper = false;
      this.$parent.addLaunchNode({ node: this.getNode(), graph: this.getGraph() });
    },
    changeToNode(toNode) {
      // this.$emit('createNode',)
      this.getGraph().addEdge({
        source: { cell: this.getNode().id, port: "bottom" },
        target: { cell: toNode.id, port: "top" },
        // source: { cell: this.getNode().id },
        // target: { cell: toNode.id },
        router: {
          name: "manhattan",
        },
      });
      this.$parent.layout();
      this.$refs.addBtn.$data.showPopper = false;
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

      // console.log(this.getGraph(),this.getNode())
      this.$parent.addApprovalNode({
        key: key,
        node: this.getNode(),
        graph: this.getGraph(),
      });
    },
  },
  mounted() {
    console.log("条件执行了");
  },
};
</script>

<style lang="less" scoped></style>

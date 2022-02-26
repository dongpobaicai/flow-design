<script lang="ts">
import FlowDesign from "../hooks/flowDesign";
import { FlowDesignInstance } from "#/flowNode";

export default {
  name: "FlowDesign",
  data() {
    return {
      design: null,
    };
  },
  mounted() {
    let design: FlowDesignInstance | null = null;
    design = new FlowDesign({
      id: "antv-x6-container",
    });
    design.initNode();
    design.layout();
  },
};
</script>

<template>
  <el-card class="content-box" id="antv-x6-container"></el-card>
</template>

<style>
.content-box {
  margin-top: 20px;
  height: calc(100vh - 190px);
}
</style>

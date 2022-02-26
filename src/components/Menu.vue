<script lang="ts">
export default {
  data() {
    const buttons = ["内容居中"];
    return {
      buttons,
    };
  },
};
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>功能区</span>
      </div>
    </template>
    <div class="button-list">
      <el-button v-for="btn in buttons" type="primary" :key="btn">{{
        btn
      }}</el-button>
    </div>
  </el-card>
</template>

<style>
.box-card {
  width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button-list {
  display: flex;
}
</style>

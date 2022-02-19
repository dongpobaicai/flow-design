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

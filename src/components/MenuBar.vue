<template>
  <div class="progressHolder">
    <div class="progress">
      <div
        class="progress-bar bg-success"
        role="progressbar"
        :style="{ width: parM*100 + '%' }"
        :aria-valuenow="parM"
        aria-valuemin="0"
        :aria-valuemax="1"
      >Mickiewicz</div>
      <div
        class="progress-bar bg-secondary"
        role="progressbar"
        :style="{ width: parS*100 + '%' }"
        :aria-valuenow="parS"
        aria-valuemin="0"
        :aria-valuemax="1"
      >Słowacki</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    let rand = Math.random();
    const parM = ref(rand);
    const parS = ref(1 - rand);
    return {
      parM,
      parS,
    };
  },
  mounted() {
    setInterval(() => {
      let rand = Math.random();
      this.parM = rand;
      this.parS = 1 - rand;
    }, 3000);
  }
};
</script>

<style scoped>
.progress{
  -bs-progress-height: unset;
  min-width: 280px;
}
.progress-bar{
  transition: width 2s;
} 
</style>

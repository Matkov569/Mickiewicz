<template>
  <div class="progressHolder">
    <div class="progress">
      <div
        class="progress-bar bg-success"
        role="progressbar"
        :style="mStyle"
        :aria-valuenow="parM"
        aria-valuemin="0"
        :aria-valuemax="max"
      >
        {{ perM }}%
      </div>
      <div
        class="progress-bar bg-secondary"
        role="progressbar"
        :style="sStyle"
        :aria-valuenow="parS"
        aria-valuemin="0"
        :aria-valuemax="max"
      >
        {{ perS }}%
      </div>
    </div>
    <p style="text-align: center">{{ titleText }}</p>
  </div>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  props: {
    title: String,
    micek: Number,
    slowak: Number,
  },
  setup(props) {
    const parM = ref(props.micek);
    const parS = ref(props.slowak);
    if(parM.value === 0 && parS.value === 0){
      parM.value = 0.5;
      parS.value = 0.5;
    }
    const max = parM.value + parS.value;
    const perM = ((100 * parM.value) / max).toFixed(2);
    const perS = ((100 * parS.value) / max).toFixed(2);
    const titleText = ref(props.title);
    const mStyle = reactive({ width: perM + "%" });
    const sStyle = reactive({ width: perS + "%" });
    return {
      titleText,
      perM,
      perS,
      parM,
      parS,
      max,
      mStyle,
      sStyle,
    };
  },
};
</script>

<style scoped>
.progress{
  -bs-progress-height: unset;
  min-width: 280px;
}
</style>

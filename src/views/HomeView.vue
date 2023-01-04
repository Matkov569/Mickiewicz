<template>
  <main>
    <div class="input-group mb-3">
      <input @submit="compute" v-model="input" type="text" class="form-control" placeholder="Wpisz zdanie" aria-label="Wpisz zdanie" aria-describedby="basic-addon2">
      <div class="input-group-append">
        <button @click="compute" class="btn btn-outline-secondary" type="button">Sprawdź</button>
      </div>
    </div>
  </main>
</template>

<script>
import router from "../router";
import { ref } from "vue";

export default {
  setup() {
    const input = ref("");
    const compute = () => {
      router.push({ name: "computing", query: { inputText: input.value } });
    };

    return {
      input,
      compute,
    };
  },
};
</script>

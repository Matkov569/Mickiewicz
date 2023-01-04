<template>
  <div class="about">
    <div class="spinner"></div>
    <h1>{{ textToDisplay }}</h1>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { AI } from "../../AI/readysoft.js";
import router from "../router";
export default {
  setup() {
    const textToDisplay = ref("Uruchamiam AI...");

    // expose to template and other options API hooks
    return {
      textToDisplay,
    };
  },

  async mounted() {
    const route = useRoute();
    var param = route.query.inputText;
    if (param == undefined || param == "") {
      router.back();
      return;
    }
    //"testowy tekst od tak se";
    var ai = new AI(param);
    var func = ai.start();

    do {
      this.textToDisplay = func[0];
      func = await ai[func[1]]();
    } while (func[0] != "STOP");

    this.textToDisplay = "Pobieram wyniki...";
    let results = ai.getResults();
    this.textToDisplay = "Wyświetlam wyniki...";

    router.push({ name: "result", query: { result: JSON.stringify(results) } });
    //MicekVSSlowak("Litwo wasza, waść przecie moja");
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.about {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  padding: 10px;
}
.spinner {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.spinner:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #00bd7e transparent #fff transparent;
  animation: spinner 1.2s linear infinite;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

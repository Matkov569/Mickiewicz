<script setup>
import ProgressBarVue from "../components/ProgressBar.vue";
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";

var MoS;
var votesM;
var votesS;
var softM;
var softS;
var dictM;
var dictS;
var dictMapM;
var dictMapS;
var detailM;
var detailS;

console.log("AAAAA");

onBeforeMount(() => {
  const route = useRoute();
  const results = JSON.parse(route.query.result);

  MoS = results[0];
  votesM = results[1][0];
  votesS = results[1][1];
  softM = results[2][0];
  softS = results[2][1];
  dictM = results[3][0];
  dictS = results[3][1];
  dictMapM = results[4][0];
  dictMapS = results[4][1];
  //const knnM = results[5][0];
  //const knnS = results[5][1];
  detailM = results[6][0];
  detailS = results[6][1];
});
</script>

<template>
  <div class="about">
    <h1>{{ MoS }}</h1>
    <h4>Ogólnie</h4>
    <ProgressBarVue
      title="Wyniki głosowania"
      :micek="votesM"
      :slowak="votesS"
    />
    <h4>Użyte słowa</h4>
    <ProgressBarVue title="" :micek="dictM" :slowak="dictS" />
    <h4>Mapa słów</h4>
    <ProgressBarVue title="" :micek="dictMapM" :slowak="dictMapS" />
    <h4>Zbiory miękkie</h4>
    <div>
      <ProgressBarVue title="Głosowanie" :micek="softM" :slowak="softS" />
      <ProgressBarVue
        title="Długość tekstu"
        :micek="detailM[0]"
        :slowak="detailS[0]"
      />
      <ProgressBarVue
        title="Ilość słów"
        :micek="detailM[1]"
        :slowak="detailS[1]"
      />
      <ProgressBarVue
        title="Średnia długość słowa"
        :micek="detailM[2]"
        :slowak="detailS[2]"
      />
      <ProgressBarVue
        title="Polskie znaki"
        :micek="detailM[3]"
        :slowak="detailS[3]"
      />
      <ProgressBarVue
        title="Średnio na słowo"
        :micek="detailM[4]"
        :slowak="detailS[4]"
      />
      <ProgressBarVue
        title="Znaki interpunkcyjne"
        :micek="detailM[5]"
        :slowak="detailS[5]"
      />
      <ProgressBarVue
        title="Średnio na słowo"
        :micek="detailM[6]"
        :slowak="detailS[6]"
      />
    </div>
    <!--<ProgressBarVue title="KNN" :micek="knnM" :slowak="knnS" />-->
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.about {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: column;
  overflow: auto;
}
</style>

<template>
    <div class="dataAnalysis">
    </div>
</template>

<script>
export default {
  name: "dataAnalysis",
  data() {
    return {};
  },
  mounted() {
    /* eslint-disable */
    let element = $(".mol-container");
    let config = { backgroundColor: "white" };
    let viewer = $3Dmol.createViewer(element, config);
    this.$http.get("dataAnalysis/readFile").then(data => {
      let v = viewer;
      v.addModel(data["data"], "pdb"); /* load data */
      v.setStyle({}, { cartoon: { color: "spectrum" } }); /* style all atoms */
      v.zoomTo(); /* set camera */
      v.render(); /* render scene */
      v.zoom(1, 1000);
    });
  }
};
</script>


<style scoped lang="scss">
.mol-container {
  width: 60%;
  height: 400px;
  position: relative;
}
</style>


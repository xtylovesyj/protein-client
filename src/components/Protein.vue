<template>
  <div ref="mol" class="mol-container protein">
  </div>
</template>

<script>
export default {
  name: "Protein",
  props: {
    url: String,
    data: String
  },
  data: function() {
    return {
      folderName: "dfads"
    };
  },
  created() {
    this.folderName = this.$route.query.fileName;
  },
  watch: {
    /* eslint-disable */
    data: function(val) {
      let element = this.$refs.mol;
      element = $(element);
      let config = { backgroundColor: "white" };
      let viewer = $3Dmol.createViewer(element, config);
      let v = viewer;
      v.addModel(val, "pdb"); /* load data */
      v.setStyle({}, { cartoon: { color: "spectrum" } }); /* style all atoms */
      v.zoomTo(); /* set camera */
      v.render(); /* render scene */
      v.zoom(1, 1000);
    }
  }
};
</script>
<style>
.protein {
  position: relative;
  display: inline-block;
}
</style>

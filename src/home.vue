<template>
    <div class="home">
        <router-view/>
        <div :class="{'hidden':loading}" class="cover">
            <Icon class="loading" type="ios-loading" />
        </div>
    </div>

</template>

<script>
import { mapState } from "vuex";
export default {
  name: "home",
  computed: mapState(["loading"])
};
</script>

<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.cover {
  position: fixed;
  top: 0;
  left: 0;
  display: inline-block;
  width: 100vw;
  height: 100vh;
  background-color: rgba(8, 8, 8, 0.8);
  z-index: 10000;
  .loading {
    -webkit-animation: spin 1s linear 1s 5 alternate;
    animation: spin 1s linear infinite;
    font-size: 100px;
    position: relative;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
    width: 100px;
    height: 100px;
    color: #ccc2c2;
    display: inline-block;
    transform: translate(-50px, -50px);
  }
}
.hidden{
    display: none;
}
</style>

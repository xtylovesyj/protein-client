<template>
  <div class="protein3D">
    <header>
      <span class="back-area">
        <Icon type="ios-arrow-back" :size="30" @click="back" />
      </span>
      <span class="folderName">{{folderName}}</span>
    </header>
    <div class="protein3D-body">
      <div class="image">
        <Protein :data="combo1" v-show="combo1" class="protein" />
        <div class="no-content" v-show="!combo1">
          <span class="text">No Content</span>
        </div>
        <div class="textName">Combo1</div>
      </div>
      <div class="image">
        <Protein :data="combo2" v-show="combo2" class="protein" />
        <div class="no-content" v-show="!combo2">
          <span class="text">No Content</span>
        </div>
        <div class="textName">Combo2</div>
      </div>
      <div class="image">
        <Protein :data="combo3" v-show="combo3" class="protein" />
        <div class="no-content" v-show="!combo3">
          <span class="text">No Content</span>
        </div>
        <div class="textName">Combo3</div>
      </div>
      <div class="image">
        <Protein :data="combo4" v-show="combo4" class="protein border-top" />
        <div class="no-content border-top" v-show="!combo4">
          <span class="text">No Content</span>
        </div>
        <div class="textName">Combo4</div>
      </div>
      <div class="image">
        <Protein :data="combo5" v-show="combo5" class="protein border-top" />
        <div class="no-content border-top" v-show="!combo5">
          <span class="text">No Content</span>
        </div>
        <div class="textName">Combo5</div>
      </div>
    </div>
  </div>
</template>

<script>
import Protein from "@/components/Protein.vue";
export default {
  name: "protein3D",
  components: {
    Protein
  },
  data: function() {
    return {
      folderName: "dfads",
      combo1: "",
      combo2: "",
      combo3: "",
      combo4: "",
      combo5: ""
    };
  },
  created() {
    this.folderName = this.$route.query.fileName;
    this.$http
      .get(`protein3D/readFile/${this.folderName}`)
      .then(data => {
        if (data["status"] === 200) {
          data = data["data"]["data"];
          this.combo1 = data[0]["data"];
          this.combo2 = data[1]["data"];
          this.combo3 = data[2]["data"];
          this.combo4 = data[3]["data"];
          this.combo5 = data[4]["data"];
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  mounted() {
    /* eslint-disable */
  },
  methods: {
    back() {
      this.$router.push("/app");
    }
  }
};
</script>
<style scoped lang="scss">
.protein3D {
  height: calc(100vh - 58px);
  width: 100%;
  & > header {
    text-align: left;
    height: 50px;
    background: white;
    line-height: 50px;
    border-bottom: 1px solid #e9e9e9;
    & > .back-area {
      display: inline-block;
      height: 100%;
      width: 50px;
      text-align: center;
      cursor: pointer;
    }
    & > .folderName {
      color: black;
      font-size: 16px;
      position: relative;
      font-weight: 400;
      top: 2px;
    }
  }
  & > .protein3D-body {
    height: calc(100% - 71px);
    width: 100%;
    & > .image {
      float: left;
      height: 50%;
      width: 33.333%;
      & > .protein,
      & > .no-content {
        height: calc(100% - 20px);
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 3px;
        border-left-width: 0;
        border-top-width: 0;
        & > .text {
          position: relative;
          font-size: 18px;
          color: #ddd;
          height: 16px;
          display: inline-block;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      & > .border-top {
        border-top-width: 1px;
      }
      & > .textName {
        position: relative;
        top: -3px;
        width: 100%;
        // line-height: 20px;
        text-align: center;
        font-size: 14px;
        font-size: 1.4rem;
        font-weight: bolder;
      }
    }
  }
}
</style>


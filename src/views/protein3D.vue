<template>
    <div class="protein3D">
        <div class="header">
            <Icon type="ios-arrow-back" :size="30" @click="back" />
            <span class="folderName">{{folderName}}</span>
        </div>
        <div class="protein3D-body">
            <Protein  class="image" url="readFile"/>
            <Protein class="image" url="readFile2"/>
            <Protein class="image" url="readFile2"/>
            <Protein  class="image" url="readFile"/>
            <Protein  class="image" url="readFile"/>
        </div>
    </div>
</template>

<script>
import Protein from '@/components/Protein.vue'
export default {
  name: "protein3D",
  components:{
      Protein
  },
  data: function() {
    return {
      folderName: "dfads"
    };
  },
  created() {
    this.folderName = this.$route.query.fileName;
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
  & > .header {
    text-align: left;
    height: 65px;
    line-height: 65px;
    border-bottom: 1px solid #e9e9e9;
    &:hover {
      cursor: pointer;
    }
    & > .folderName {
      color: #007aff;
      font-size: 16px;
      position: relative;
      top: 2px;
    }
  }
  & > .protein3D-body {
    height: calc(100% - 66px);
    width: 100%;
    &>.image{
        float:left;
        height:50%;
        width:33.333%;
    }
    
  }
}
</style>


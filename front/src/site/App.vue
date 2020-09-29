<template>
    <div id="appWrapper" class="ph100">
        <div id="app" class="wrapper">
            <div style="width: 100%;height: 50px;line-height: 50px;background-color: #33aaff">
              <div style="width: 20%;float: left;"><div>SK telecom</div></div>
              <div style="width: 20%;float: left;"><div><router-link to="contentmetainput">콘텐츠 메타 등록</router-link></div></div>
              <div style="width: 20%;float: left;"><div><router-link to="contentmetamanagement">콘텐츠 메타 관리</router-link></div></div>
              <div style="width: 20%;float: left;"><div><router-link to="objectmetaedit">객체 트래킹 메타 편집</router-link></div></div>
              <div style="width: 20%;float: left;"><div><router-link to="anglemetaedit">앵글 트래킹 메타 편집</router-link></div></div>
            </div>
            <div style="background-color: #9eabfd">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
  }
}
</script>
<style scoped>
  .menu{
    width:200px; height:30px;
  }
  .menu a {
     font-size:15px;
    width:100%; height: 100%;
     background-color: #dddddd;
    text-align: center;
    line-height: 27px;
    display: inline-block;

   }
  .menu a:hover {
    background-color: #6b6b6b;
  }
</style>

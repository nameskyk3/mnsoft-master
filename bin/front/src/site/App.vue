<template>
    <div id="appWrapper" class="ph100">
        <div id="app" class="wrapper">
            <!-- GNB -->
            <div class="menu">
                <router-link to="/login">Login</router-link>
                <router-link to="/login/kakao-login">Kakao</router-link>
                <router-link to="/login/naver-login">Naver</router-link>
                <router-link to="/component">Component</router-link>
                <router-link to="/test">Test</router-link>
                <router-link to="/menu">Menu</router-link>
            </div>
            <div class="container">
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

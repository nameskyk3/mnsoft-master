<template>
    <form class="login-form">
        <input :value="username" type="text" placeholder="username" @input="username = $event.target.value" />
        <input :value="password" type="password" placeholder="password" @input="password = $event.target.value" />
        <button @click.prevent="doLogin">login</button>
    </form>
</template>

<script>
import axios from 'axios'
export default {
  name: 'default-login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    doLogin () {
      document.location.href = 'main.html'
      if (this.username && this.password) {
        let user = {}
        axios.post('/api/auth/login', user)
          .then((res) => {
            console.log(res)
          })
          .catch((res) => {
            console.log(res)
          })
      } else {
        // alert('로그인 정보를 입력하십시오.')
      }
    }
  }
}
</script>

<style scoped>

</style>

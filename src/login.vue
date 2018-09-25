<template>
  <div class="login-container">
    <div class="login">
      <h1>PPMS</h1>
      <form method="post" ref="form" @submit="clickHandler">
        <input type="text" v-model="user" name="username" placeholder="用户名" required="required">
        <input type="password" v-model="pass" name="password" placeholder="密码" required="required">
        <button type="submit" @click="formSubmit" class="btn-block">登录</button>
      </form>
    </div>
  </div>
</template>
<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  font-family: "Open Sans", sans-serif;
  background: -webkit-radial-gradient(
      0% 100%,
      rgba(104, 128, 138, 0.4) 10%,
      rgba(138, 114, 76, 0) 40%
    ),
    linear-gradient(
      to bottom,
      rgba(57, 173, 219, 0.25) 0%,
      rgba(42, 60, 87, 0.4) 100%
    ),
    linear-gradient(135deg, #670d10 0%, #092756 100%);
  // background-image: url("./assets/background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  & > .login {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -150px 0 0 -150px;
    width: 300px;
    height: 300px;
  }
  .login h1 {
    color: white;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
    text-align: center;
  }

  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  form {
    display: block;
    margin-top: 0em;
  }
  input {
    width: 100%;
    margin-bottom: 10px;
    background: rgba(0, 0, 0, 0.3);
    border: none;
    outline: none;
    padding: 10px;
    font-size: 13px;
    color: #fff;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    box-shadow: inset 0 -5px 45px rgba(100, 100, 100, 0.2),
      0 1px 1px rgba(255, 255, 255, 0.2);
    -webkit-transition: box-shadow 0.5s ease;
    -moz-transition: box-shadow 0.5s ease;
    -o-transition: box-shadow 0.5s ease;
    -ms-transition: box-shadow 0.5s ease;
    transition: box-shadow 0.5s ease;
  }
  .btn-block {
    width: 100%;
    display: block;
    background-color: #6eb6de;
    border: 1px solid #3762bc;
    height: 41px;
    border-radius: 3px;
    font-size: 15px;
    color: white;
    &:hover {
      cursor: pointer;
    }
    &:focus {
      outline: none;
    }
    &:active {
      background-color: #4a77d4;
    }
  }
}
</style>

<script>
export default {
  name: "Login",
  data() {
    return {
      user: "",
      pass: ""
    };
  },
  mounted() {},
  methods: {
    clickHandler(event) {
      event.preventDefault();
      return false;
    },
    formSubmit() {
      if (this.user && this.pass) {
        this.$http
          .post("login", {
            username: this.user,
            password: this.pass
          })
          .then(data => {
            this.$router.push("./app");
            console.log(11111111,data);
            data = data["data"];
            if (data["code"] === 200) {
              sessionStorage.setItem("user", data["data"]);
            }
          })
          .catch(err => {
            console.error(err);
            this.$router.push("./app");
          });
      }
    }
  }
};
</script>


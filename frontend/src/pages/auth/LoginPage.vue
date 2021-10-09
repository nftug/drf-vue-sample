<template>
  <div id="login-page">

    <!-- メインエリア -->
    <div class="col-xl-4 col-lg-5 col-md-6 col-sm-10 mx-auto">
      <p class="h2 mt-4 mb-5">ログイン</p>
      
      <b-form v-on:submit.prevent="submitLogin">
	<b-form-group label="ユーザー名" label-for="username">
	  <b-input type="text" v-model="form.username" id="username" placeholder="ユーザー名" required />
	</b-form-group>
	<b-form-group label="パスワード" label-for="password">
	  <b-input type="password" v-model="form.password" id="password" placeholder="パスワード" required />
	</b-form-group>

	<div class="mt-4">
	  <b-button type="submit" variant="primary" class="w-100">
	    <font-awesome-icon icon="sign-in-alt" />
	    ログイン
	  </b-button>
	</div>

	<div class="text-right mt-4 small">
	  <div class="mb-1">
	    <router-link class="button secondaryAction" to="/password/reset/">パスワードを忘れましたか？</router-link>
	  </div>
	  <div class="mb-1">
	    <router-link class="button secondaryAction" to="/signup/">アカウントを新規作成</router-link>
	  </div>
	</div>
      </b-form>
    </div>
  </div>
</template>

<script>
 export default {
   metaInfo: {
     title: "ログイン"
   },
   data() {
     return {
       form: {
	 username: "",
	 password: ""
       }
     }
   },
   methods: {
     // ログインボタン押下
     submitLogin: function() {
       // ログイン実行
       this.$store
	   .dispatch("auth/login", {
	     username: this.form.username,
	     password: this.form.password
	   })
	   .then(() => {
	     console.log("Login succeeded.")
	     // クエリ文字列にnextがなければホーム画面へ
	     const next = this.$route.query.next || "/"
	     this.$router.replace(next)
	     this.$store.dispatch("message/setInfoMessage", {
	       message: "ユーザー " + this.$store.state.auth.username + " としてログインしました。"
	     })
	   })
     }
   }
 }
</script>

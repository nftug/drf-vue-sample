<template>
  <div id="password-reset-page">
    <!-- リセットページ -->
    <template v-if="$route.params.uid && $route.params.token">
      <GlobalHeader />
      <GlobalMessage />

      <!-- メインエリア -->
      <b-container class="py-5">
	<b-row>
	  <div class="col-lg-5 col-md-6 col-sm-10 mx-auto">
	    <p class="h2 mt-4 mb-5">パスワードのリセット</p>
	    <p>パスワードをリセットします。</p>
	    
	    <b-form v-on:submit.prevent="submitPasswordResetConfirm">
	      <b-form-group label="新しいパスワード" label-for="new_password">
		<b-input
		  type="password"
		  v-model="form.values.new_password"
		  id="new_password"
		  placeholder="新しいパスワード"
		  required
		  :state="form.warnings.new_password.length ? false : null" 
		  @input="form.warnings.new_password = []" />
		<b-form-invalid-feedback
		  v-for="(warning, index) in form.warnings.new_password"
		  :key="index">
		  {{ warning }}
		</b-form-invalid-feedback>
	      </b-form-group>
	      <b-form-group label="新しいパスワード (確認用)" label-for="re_new_password">
		<b-input
		  type="password"
		  v-model="form.values.re_new_password"
		  id="re_new_password"
		  placeholder="新しいパスワード (確認用)"
		  required
		  :state="form.warnings.re_new_password.length ? false : null"
		  @input="form.warnings.re_new_password = []" />
		<b-form-invalid-feedback
		  v-for="(warning, index) in form.warnings.re_new_password"
		  :key="index">
		  {{ warning }}
		</b-form-invalid-feedback>
	      </b-form-group>

	      <div class="mt-4">
		<b-button type="submit" variant="primary" class="w-100">
		  パスワードのリセット
		</b-button>
	      </div>
	    </b-form>
	  </div>
	</b-row>
      </b-container>
    </template>

    <!-- ユーザー登録フォームページ -->
    <template v-else>
      <GlobalHeader />
      <GlobalMessage />

      <!-- メインエリア -->
      <b-container class="py-5">
	<b-row>
	  <div class="col-lg-5 col-md-6 col-sm-10 mx-auto">
	    <p class="h2 mt-4 mb-5">パスワードのリセット</p>
	    <p>パスワードリセット用のメールを送信します。</p>

	    <b-form v-on:submit.prevent="submitPasswordReset">
	      <b-form-group label="メールアドレス" label-for="email">
		<b-input
		  type="email"
		  v-model="form.values.email"
		  id="email"
		  placeholder="メールアドレス"
		  required
		  :state="form.warnings.email.length ? false: null" 
		  @input="form.warnings.email = []" />
		<b-form-invalid-feedback
		  v-for="(warning, index) in form.warnings.email"
		  :key="index">
		  {{ warning }}
		</b-form-invalid-feedback>
	      </b-form-group>

	      <div class="mt-4">
		<b-button type="submit" variant="primary" class="w-100">
		  <font-awesome-icon icon="envelope" />
		  メールを送信
		</b-button>
	      </div>
	    </b-form>
	  </div>
	</b-row>
      </b-container>
    </template>

  </div>
</template>

<script>
 import api from "@/services/api"
 import GlobalHeader from "@/components/GlobalHeader.vue"
 import GlobalMessage from "@/components/GlobalMessage.vue"

 export default {
   metaInfo: {
     title: "パスワードのリセット"
   },
   components: {
     GlobalHeader,
     GlobalMessage
   },
   data() {
     return {
       form: {
	 values: {  
	   email: this.$store.state.auth.email,
	   new_password: "",
	   re_new_password: ""
	 },
	 warnings: { 
	   email: [],
	   new_password: [],
	   re_new_password: []
	 }
       }
     }
   },
   methods: {
     // メール送信押下
     submitPasswordReset: function() {
       api({
	 method: "post",
	 url: "/auth/users/reset_password/",
	 data: {
	   email: this.form.values.email
	 }
       }).then(() => {
	 if (this.$store.state.auth.isLoggedIn) {
	   // ログイン時はアカウント設定メニューに遷移
	   this.$router.push("/account")
	 } else {
	   // ログアウト時はログイン画面に遷移
	   this.$router.push("/login")
	 }
	 this.$store.dispatch("message/setInfoMessage", {
	   message: "パスワードリセット用のメールを送信しました。"
	 })
       }).catch(error => {
	 // バリデーションNG
	 Object.keys(error.response.data).forEach(function (key) {
	   this.form.warnings[key] = error.response.data[key]
	 }, this)
       })
     },
     // パスワードリセット押下
     submitPasswordResetConfirm: function() {
       api({
	 method: "post",
	 url: "/auth/users/reset_password_confirm/",
	 data: {
	   uid: this.$route.params.uid,
	   token: this.$route.params.token,
	   new_password: this.form.values.new_password,
	   re_new_password: this.form.values.re_new_password
	 }
       }).then(() => {
	 // ログイン時は強制的にログアウト
	 if (this.$store.state.auth.isLoggedIn) {
	   console.log("Logout.")
	   this.$store.dispatch("auth/logout")
	 }
	 
	 this.$router.push("/login")
	 this.$store.dispatch("message/setInfoMessage", {
	   message: "パスワードのリセットが完了しました。"
	 })
       }).catch(error => {
	 // バリデーションNG
	 Object.keys(error.response.data).forEach(function (key) {
	   if (key === 'token') {
	     this.$router.push("/login")
	     this.$store.dispatch("message/setErrorMessage", {
	       message: "不正なトークンです。"
	     })
	   } else if (key === 'non_field_errors') {
	     this.form.warnings['new_password'].push("パスワードが一致しません。")
	     this.form.warnings['re_new_password'].push("パスワードが一致しません")
	   } else {
	     this.form.warnings[key] = error.response.data[key]
	   }
	 }, this)
       })
     }
   }
 }
</script>

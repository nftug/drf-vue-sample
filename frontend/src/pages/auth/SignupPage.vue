<template>
  <div id="signup-page">
    <!-- 認証ページ -->
    <template v-if="$route.params.uid && $route.params.token">
      <p>認証中…</p>
    </template>

    <!-- 認証済みページ -->
    <template v-if="verificationSent">
      <GlobalHeader />
      <GlobalMessage />
      
      <!-- メインエリア -->
      <b-container class="py-5">
	<p class="h2 mt-4 mb-5">確認メールを送信しました</p>
	<p>
	  ユーザー登録確認のメールを送信しました。<br />
	  メールに記載されたリンクをクリックして、ユーザー登録を完了させてください。<br />
	  数分待っても確認のメールが届かない場合はご連絡ください。
	</p>
      </b-container>
    </template>
      
    <!-- 登録フォームページ -->
    <template v-else>
      <GlobalHeader />
      <GlobalMessage />

      <!-- メインエリア -->
      <b-container class="py-5">
	<b-row>
	  <div class="col-lg-5 col-md-6 col-sm-10 mx-auto">
	    <p class="h2 mt-4 mb-5">ユーザー登録</p>
	    
	    <b-form v-on:submit.prevent="submitSignup">
	      <b-form-group label="ユーザー名" label-for="username">
		<b-input
		  type="text"
		  v-model="form.values.username"
		  id="username"
		  placeholder="ユーザー名"
		  required
		  :state="form.warnings.username.length ? false : null"
	      	  @input="form.warnings.username = []"/>
		<b-form-invalid-feedback
		  v-for="(warning, index) in form.warnings.username"
			 :key="index">
		  {{ warning }}
		</b-form-invalid-feedback>
	      </b-form-group>
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
	      <b-form-group label="パスワード" label-for="password">
		<b-input
		  type="password"
		  v-model="form.values.password"
		  id="password"
		  placeholder="パスワード"
		  required
		  :state="form.warnings.password.length ? false : null" 
		  @input="form.warnings.password = []" />
		<b-form-invalid-feedback
		  v-for="(warning, index) in form.warnings.password"
			 :key="index">
		  {{ warning }}
		</b-form-invalid-feedback>
	      </b-form-group>
	      <b-form-group label="パスワード (確認用)" label-for="re_password">
		<b-input
		  type="password"
		  v-model="form.values.re_password"
		  id="re_password"
		  placeholder="パスワード (確認用)"
		  required
		  :state="form.warnings.re_password.length ? false : null"
		  @input="form.warnings.re_password = []" />
		<b-form-invalid-feedback
		  v-for="(warning, index) in form.warnings.re_password"
			 :key="index">
		  {{ warning }}
		</b-form-invalid-feedback>
	      </b-form-group>
	      
	      <div class="mt-4">
		<b-button type="submit" variant="primary" class="w-100">
		  <font-awesome-icon icon="user-plus" />
		  ユーザー登録
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
     title: "ユーザー登録"
   },
   components: {
     GlobalHeader,
     GlobalMessage
   },
   data() {
     return {
       form: {
	 values: {
	   username: "",  
	   email: "",
	   password: "",
	   re_password: ""
	 },
	 warnings: {
	   username: [],  
	   email: [],
	   password: [],
	   re_password: []
	 }
       },
       verificationSent: false
     }
   },
   created() {
     // UIDとトークンを指定→ユーザーのアクティベーションに進む
     if (this.$route.params.uid && this.$route.params.token) {
       this.activateUser()
     }
   },
   methods: {
     // サインアップ押下
     submitSignup: function() {
       api({
	 method: "post",
	 url: "/auth/users/",
	 data: this.form.values
       }).then(() => {
	 // 認証メール送信済み
	 this.verificationSent = true
       }).catch(error => {
	 // バリデーションNG
	 Object.keys(error.response.data).forEach(function (key) {
	   if (key === 'non_field_errors') {
	     this.form.warnings['password'].push("パスワードが一致しません。")
	     this.form.warnings['re_password'].push("パスワードが一致しません")
	   } else {
	     this.form.warnings[key] = error.response.data[key]
	   }
	 }, this)
       })
     },
     // ユーザーのアクティベーション
     activateUser: function() {
       api({
	 method: "post",
	 url: "/auth/users/activation/",
	 data: {
	   uid: this.$route.params.uid,
	   token: this.$route.params.token
	 }
       })
	 .then(() => {
	   this.$router.replace("/login")
	   this.$store.dispatch("message/setInfoMessage", {
	     message: "アカウントが承認されました。"
	   })
	 }).catch(error => {
	   this.$router.replace("/login")
	   const status = error.response ? error.response.status : 500
	   let message

	   if (status === 403) {
	     message = "アカウントは既に承認されています。"
	   } else {
	     message = "不正なトークンです。"
	   }
	   this.$store.dispatch("message/setErrorMessage", { message: message })
	 })
     }
   }
 }
</script>

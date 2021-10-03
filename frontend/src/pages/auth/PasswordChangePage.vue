<template>
  <div id="password-change-page">
    <GlobalHeader />
    <GlobalMessage />

    <!-- メインエリア -->
    <b-container class="py-5">
      <b-row>
	<div class="col-lg-5 col-md-6 col-sm-10 mx-auto">
	  <p class="h2 mt-4 mb-5">パスワードの変更</p>
	  <p>パスワードを変更します。</p>
	  
	  <b-form v-on:submit.prevent="submitPasswordChange">
	    <b-form-group label="現在のパスワード" label-for="current_password">
	      <b-input
		type="password"
		v-model="form.values.current_password"
		id="current_password"
		placeholder="現在のパスワード"
		required
		:state="form.warnings.current_password.length ? false : null" 
		@input="form.warnings.current_password = []" />
	      <b-form-invalid-feedback
		v-for="(warning, index) in form.warnings.current_password"
		:key="index">
		{{ warning }}
	      </b-form-invalid-feedback>
	    </b-form-group>
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
		パスワードの変更
	      </b-button>
	    </div>

	    <div class="text-right mt-4 small">
	      <div class="mb-1">
		<router-link class="button secondaryAction" to="/password/reset">パスワードを忘れましたか？</router-link>
	      </div>
	    </div>
	  </b-form>
	</div>
      </b-row>
    </b-container>

  </div>
</template>

<script>
 import api from "@/services/api"
 import GlobalHeader from "@/components/GlobalHeader.vue"
 import GlobalMessage from "@/components/GlobalMessage.vue"

 export default {
   metaInfo: {
     title: "パスワードの変更"
   },
   components: {
     GlobalHeader,
     GlobalMessage
   },
   data() {
     return {
       form: {
	 values: {  
	   current_password: "",
	   new_password: "",
	   re_new_password: ""
	 },
	 warnings: { 
	   current_password: [],
	   new_password: [],
	   re_new_password: []
	 }
       }
     }
   },
   methods: {
     // パスワード変更押下
     submitPasswordChange: function() {
       api({
	 method: "post",
	 url: "/auth/users/set_password/",
	 data: this.form.values
       }).then(() => {
	 this.$router.push("/account")
	 this.$store.dispatch("message/setInfoMessage", {
	   message: "パスワードを変更しました。"
	 })
       }).catch(error => {
	 // バリデーションNG
	 Object.keys(error.response.data).forEach(function (key) {
	   if (key === 'non_field_errors') {
	     this.form.warnings['new_password'].push("パスワードが一致しません。")
	     this.form.warnings['re_new_password'].push("パスワードが一致しません")
	   } else if (key === 'current_password') {
	     this.form.warnings[key].push("パスワードが正しくありません。")
	   } else {
	     this.form.warnings[key] = error.response.data[key]
	   }
	 }, this)
       })
     }
   }
 }
</script>

<template>
  <div id="send-form">
    <b-form @submit.prevent="submitForm">
      <b-form-group
	v-for="(field, key) in form" :key="key"
	:label="field.label" :label-for="key">
	<b-input
	  :type="field.type"
	  :value="form[key].value"
	  :id="key"
	  :placeholder="field.label"
	  :required="field.required"
	  :state="field.warnings.length ? false : null"
	  :readonly="field.readonly"
	  @input="onInputField($event, key)" />
	<b-form-invalid-feedback
	  v-for="(warning, index) in field.warnings" :key="index">
	  {{ warning }}
	</b-form-invalid-feedback>
      </b-form-group>

      <slot name="footer">
	<div class="mt-4">
	  <b-button type="submit" variant="primary" class="w-100">
	    送信
	  </b-button>
	</div>
      </slot>
    </b-form>
  </div>
</template>

<script>
 import api from "@/services/api"
 
 export default {
   props: {
     value: Object,
     action: String,
     method: String,
     additionalData: Object
   },
   data() {
     return {
       form: this.value
     }
   },
   watch: {
     value: function(val) {
       this.form = val
     }
   },
   methods: {
     submitForm: async function() {
       // データを取り出し
       let data = {}
       Object.keys(this.form).forEach(key => {
	 data[key] = this.form[key].value
       })
       if (this.additionalData) {
	 Object.assign(data, this.additionalData)
       }
       
       // フォーム送信
       await api({
	 method: this.method,
	 url: this.action,
	 data: data
       }).then(response => {
	 // フォーム送信完了イベント発火
	 this.$emit("form-success", response.data)
       }).catch(error => {
	 // バリデーションNG
	 Object.keys(error.response.data).forEach(key => {
	   if (key === 'token' || key === 'uid') {
	     this.$store.dispatch("message/setErrorMessage", {
	       message: "不正なトークンです。"
	     })
	   } else if (key === 'non_field_errors') {
	     const prefix = this.form.new_password ? "new_" : ""
	     this.form[`${prefix}password`].warnings.push("パスワードが一致しません。")
	     this.form[`re_${prefix}password`].warnings.push("パスワードが一致しません。")
	   } else if (key === 'current_password') {
	     this.form.warnings[key].push("パスワードが正しくありません。")
	   } else {
	     this.form[key].warnings = error.response.data[key]
	   }
	 })
	 
	 // バリデーションNGイベント発火
	 this.$emit("form-error", error.response.data)
	 return Promise.reject(error)
       })
       
       this.$emit("input", this.form)
     },
     onInputField: function(event, key) {
       // dataに反映
       this.form[key].value = event
       // v-modelで指定されたformにinputする
       this.$emit("input", this.form)
       // warningsをクリア
       this.form[key].warnings = []
     }
   }
 }
</script>

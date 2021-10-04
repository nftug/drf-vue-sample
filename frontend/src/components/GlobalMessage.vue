<template>
  <!-- メッセージエリア -->
  <div id="message">
    <b-alert variant="danger" v-if="this.$store.state.auth.isSuperuser" class="mb-0 text-center" show>
      スーパーユーザーでログイン中です。
    </b-alert>
    <b-alert variant="danger" v-model="showError" class="mb-0" dismissible>
      {{ message.error }}
    </b-alert>
    <b-alert variant="warning" v-model="showWarnings" class="mb-0" dismissible>
      <p v-for="warning in message.warnings" :key="warning" class="mb-0">
	{{ warning }}
      </p>
    </b-alert>
    <b-alert variant="info" v-model="showInfo" class="mb-0" dismissible>
      {{ message.info }}
    </b-alert>
  </div>
</template>

<script>
 export default {
   computed:{
     message: function() {
       return this.$store.state.message
     },
     showError: {
       get() {
	 return this.$store.state.message.error.length > 0
       },
       set(value) {
	 this.$store.dispatch("message/setErrorMessage", { message: value })
       }
     },
     showWarnings: {
       get() {
	 return this.$store.state.message.warnings.length > 0
       },
       set(values) {
	 this.$store.dispatch("message/setWarningMessages", { messages: values })
       }
     },
     showInfo: {
       get() {
	 return this.$store.state.message.info.length > 0
       },
       set(value) {
	 this.$store.dispatch("message/setInfoMessage", { message: value })
       }
     }
   }
 }
</script>

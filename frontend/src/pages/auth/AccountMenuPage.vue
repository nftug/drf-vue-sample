<template>
  <div id="account-menu-page">
    <GlobalHeader />
    <GlobalMessage />

    <!-- メインエリア -->
    <b-container class="py-5">
      <b-row>
	<div class="col-lg-5 col-md-6 col-sm-10 mx-auto">
	  <p class="h2 mt-4 mb-5">アカウントの設定</p>
	  <p>操作を選択してください。</p>
	  <div class="list-group">
	    <a class="list-group-item list-group-item-action" href="#">名前の設定</a>
	    <router-link class="list-group-item list-group-item-action" to="/password/change">パスワードの変更</router-link>
	    <a class="list-group-item list-group-item-action" href="#">メールアドレスの変更</a>
	  </div>
	</div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
 import GlobalHeader from "@/components/GlobalHeader.vue"
 import GlobalMessage from "@/components/GlobalMessage.vue"

 export default {
   metaInfo: {
     title: "アカウントの設定"
   },
   components: {
     GlobalHeader,
     GlobalMessage
   },
 }
</script>

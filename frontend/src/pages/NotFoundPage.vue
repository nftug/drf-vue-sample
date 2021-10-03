<template>
  <div id="not-found-page">
    <GlobalHeader />
    <GlobalMessage />
    
    <!-- メインエリア -->
    <b-container class="py-5">
      <p class="h2 mt-4 mb-5">ページが見つかりません</p>
      <p>URLが間違っているか、ページが削除された可能性があります。</p>
      <div class="py-2 mb-2">
	<a href="javascript:void(0)" onclick="history.back()" class="mr-3">戻る</a>
	<router-link to="/">トップページへ</router-link>
      </div>
    </b-container>
  </div>
</template>

<script>
 import GlobalHeader from "@/components/GlobalHeader.vue"
 import GlobalMessage from "@/components/GlobalMessage.vue"

 export default {
   metaInfo: {
     title: "404 Not Found"
   },
   components: {
     GlobalHeader,
     GlobalMessage
   },
 }
</script>

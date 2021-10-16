<template>
  <div id="pagination">
    <div class="d-flex justify-content-center pt-3 pb-4">
      <span class="mr-2">
        <a
          href="javascript:void(0)"
          v-if="previous"
          @click="gotoPageNum(currentPage - 1)"
        >
          &lt;&lt;
        </a>
        <span v-else class="text-muted">&lt;&lt;</span>
      </span>
      <span class="mr-2">Page {{ currentPage }}/{{ totalPages }}</span>
      <span class="mr-2">
        <a
          href="javascript:void(0)"
          v-if="next"
          @click="gotoPageNum(currentPage + 1)"
        >
          &gt;&gt;
        </a>
        <span v-else class="text-muted">&gt;&gt;</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    next: String,
    previous: String,
    totalPages: Number,
    currentPage: Number,
  },
  methods: {
    gotoPageNum: function (n) {
      let query = Object.assign({}, this.$route.query)
      query.page = Number(n)
      this.$router.push({
        path: this.$route.path,
        query: query,
      })
    },
  },
}
</script>

import api from '@/services/api'

const ListGettable = {
  data() {
    return {
      apiURL: '',
      objs: [],
      loading: false,
      searchKeyword: decodeURI(this.$route.query.q || ''),
      pagination: {
        next: null,
        previous: null,
        count: 0,
        totalPages: 0,
        currentPage: 0,
      },
    }
  },
  watch: {
    $route: 'setPageFromRoute',
  },
  methods: {
    // 検索ページ表示
    searchQuery: function () {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: encodeURI(this.searchKeyword),
        },
      })
    },
    // routeからページ更新
    setPageFromRoute: function () {
      this.searchKeyword = decodeURI(this.$route.query.q || '')
      this.getListFromAPI()
    },
    // APIから情報更新
    getListFromAPI: function () {
      this.loading = true
      let page = Number(this.$route.query.page || 1)

      api({
        method: 'get',
        url: this.apiURL + '?search=' + this.searchKeyword + '&page=' + page,
      })
        .then((response) => {
          Object.keys(response.data).forEach(function (key) {
            if (key !== 'results') {
              this.pagination[key] = response.data[key]
            }
          }, this)
          this.objs = response.data.results
          this.loading = false
        })
        .catch((error) => {
          // 存在しないページNoを指定→最後のページにジャンプ
          let status = error.response ? error.response.status : 500
          if (status === 404) {
            api({
              method: 'get',
              url: this.apiURL,
            }).then((response) => {
              let query = Object.assign({}, this.$route.query)
              query.page = page > 1 ? response.data.totalPages : 1
              this.$router.replace({
                path: this.$route.path,
                query: query,
              })
            })
          }
          this.loading = false
        })
    },
  },
}

export default ListGettable

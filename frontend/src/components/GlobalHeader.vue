<template>
  <!-- ヘッダーナビゲーション -->
  <div id="header">
    <b-navbar type="dark" variant="dark">
      <router-link class="navbar-brand" to="/">DRF Sample</router-link>
      <b-navbar-nav class="ml-auto">
        <template v-if="isLoggedIn">
          <b-nav-item-dropdown right>
            <template v-slot:button-content>{{ username }}</template>
            <b-dropdown-item to="/account/">アカウントの設定</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item href="#" v-on:click="clickLogout">
              ログアウト
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </template>

        <template v-else>
          <b-nav-item to="/signup/">登録</b-nav-item>
          <b-nav-item to="/login/">ログイン</b-nav-item>
        </template>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  computed: {
    username: function () {
      return this.$store.state.auth.username
    },
    isLoggedIn: function () {
      return this.$store.state.auth.isLoggedIn
    },
  },
  methods: {
    // ログアウトリンク押下
    clickLogout: function () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
      this.$store.dispatch('message/setInfoMessage', {
        message: 'ログアウトしました。',
      })
    },
  },
}
</script>

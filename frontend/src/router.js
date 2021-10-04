import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"
import HomePage from "@/pages/HomePage.vue"
import LoginPage from "@/pages/auth/LoginPage.vue"
import SignupPage from "@/pages/auth/SignupPage.vue"
import PasswordResetPage from "@/pages/auth/PasswordResetPage.vue"
import PasswordChangePage from "@/pages/auth/PasswordChangePage.vue"
import AccountMenuPage from "@/pages/auth/AccountMenuPage.vue"
import NotFoundPage from "@/pages/NotFoundPage.vue"

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  // ログインが必要な画面には「requiresAuth」フラグを付けておく
  // ログイン時には表示しない画面には「requiresNotAuth」フラグを付けておく
  routes: [
    { path: "/", component: HomePage, meta: { requiresAuth: true } },
    { path: "/login", component: LoginPage, meta: { requiresNotAuth: true } },
    { path: "/signup", component: SignupPage, meta: { requiresNotAuth: true } },
    { path: "/activate/:uid/:token", component: SignupPage, meta: { requiresNotAuth: true } },
    { path: "/password/reset", component: PasswordResetPage },
    { path: "/password/reset/confirm/:uid/:token", component: PasswordResetPage },
    { path: "/password/change", component: PasswordChangePage, meta: { requiresAuth: true } },
    { path: "/account", component: AccountMenuPage, meta: { requiresAuth: true } }, 
    { path: "*", component: NotFoundPage }
  ]
})

// 画面遷移の直前に毎回実行されるナビゲーションガード
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.state.auth.isLoggedIn
  const token = localStorage.getItem("access")
  console.log("to.path=", to.path)
  console.log("isLoggedIn=", isLoggedIn)

  // エラーなし→通知をクリア
  if (!store.state.message.error) {
    store.dispatch("message/clearMessages")
  }

  if (!isLoggedIn) {
    // 未ログイン時→ユーザー情報取得を試行
    console.log("User is not logged in.")
    if (token != null) {
      // 認証用トークンが残っていればユーザー情報を再取得
      console.log("Trying to reload user info.")
      store.dispatch("auth/reload")
	     .then(() => {
	       console.log("Succeeded to reload.")
	       goNextOrHome(to, next)
	     })
	     .catch(() => {
	       goLoginOrPublic(to, next)
	     })
    } else {
      // 認証用トークンが残っていなければ、ログイン画面へ強制遷移 or そのまま続行
      goLoginOrPublic(to, next)
    }
  } else {
    // ログインしている場合、そのまま続行
    goNextOrHome(to, next)
  }
})

function goNextOrHome(to, next) {
  // ログイン済み かつ requiresNotAuthがtrue→ホーム画面にリダイレクト
  const isLoggedIn = store.state.auth.isLoggedIn
  if (isLoggedIn && to.matched.some(element => element.meta.requiresNotAuth)) {
    console.log("Force to Home page.")
    next("/")
  } else {
    console.log("Go to next page.")
    next()
  }
}

function goLoginOrPublic(to, next) {
  // requiresAuthがtrueなら、ログイン画面へ遷移
  if (to.matched.some(element => element.meta.requiresAuth)) {
    console.log("Force to Login page.")
    next({
      path: "/login",
      query: { next: to.fullPath }
    })
  } else {
    // ログインが不要であればそのまま次へ
    console.log("Go to public page.")
    next()
  }
}

export default router

<template>
  <div id="signup-page">
    <!-- 認証ページ -->
    <template v-if="$route.params.uid && $route.params.token">
      <spinner size="large" />
    </template>

    <!-- 認証済みページ -->
    <template v-else-if="verificationSent">
      <!-- メインエリア -->
      <p class="h2 mt-4 mb-5">確認メールを送信しました</p>
      <p>
        ユーザー登録確認のメールを送信しました。
        <br />
        メールに記載されたリンクをクリックして、ユーザー登録を完了させてください。
        <br />
        数分待っても確認のメールが届かない場合はご連絡ください。
      </p>
    </template>

    <!-- 登録フォームページ -->
    <template v-else>
      <!-- メインエリア -->
      <div class="col-xl-4 col-lg-5 col-md-6 col-sm-10 mx-auto">
        <p class="h2 mt-4 mb-5">ユーザー登録</p>

        <SendForm
          v-model="formSignup"
          action="/auth/users/"
          method="post"
          @form-success="onSucceedSend"
        >
          <template v-slot:footer>
            <div class="mt-4">
              <b-button type="submit" variant="primary" class="w-100">
                <font-awesome-icon icon="user-plus" />
                ユーザー登録
              </b-button>
            </div>
          </template>
        </SendForm>
      </div>
    </template>
  </div>
</template>

<script>
import api from '@/services/api'
import Spinner from 'vue-simple-spinner'
import SendForm from '@/components/SendForm.vue'

export default {
  metaInfo: {
    title: 'ユーザー登録',
  },
  components: {
    Spinner,
    SendForm,
  },
  data() {
    return {
      formSignup: {
        username: {
          label: 'ユーザー名',
          type: 'text',
          required: true,
          value: '',
          warnings: [],
        },
        email: {
          label: 'メールアドレス',
          type: 'email',
          required: true,
          value: '',
          warnings: [],
        },
        password: {
          label: 'パスワード',
          type: 'password',
          required: true,
          value: '',
          warnings: [],
        },
        re_password: {
          label: 'パスワード (確認用)',
          type: 'password',
          required: true,
          value: '',
          warnings: [],
        },
      },
      verificationSent: false,
    }
  },
  created() {
    // UIDとトークンを指定→ユーザーのアクティベーションに進む
    if (this.$route.params.uid && this.$route.params.token) {
      this.activateUser()
    }
  },
  methods: {
    // フォーム送信成功
    onSucceedSend: function (response) {
      this.verificationSent = true
    },
    // ユーザーのアクティベーション
    activateUser: function () {
      api({
        method: 'post',
        url: '/auth/users/activation/',
        data: {
          uid: this.$route.params.uid,
          token: this.$route.params.token,
        },
      })
        .then(() => {
          this.$router.replace('/login/')
          this.$store.dispatch('message/setInfoMessage', {
            message: 'アカウントが承認されました。',
          })
        })
        .catch((error) => {
          this.$router.replace('/login/')
          const status = error.response ? error.response.status : 500
          let message

          if (status === 403) {
            message = 'アカウントは既に承認されています。'
          } else {
            message = '不正なトークンです。'
          }
          this.$store.dispatch('message/setErrorMessage', { message: message })
        })
    },
  },
}
</script>

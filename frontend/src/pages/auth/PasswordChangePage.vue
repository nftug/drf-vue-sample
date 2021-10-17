<template>
  <div id="password-change-page">
    <!-- メインエリア -->
    <div class="col-lg-5 col-md-6 col-sm-10 mx-auto">
      <p class="h2 mt-4 mb-5">パスワードの変更</p>
      <p>パスワードを変更します。</p>

      <SendForm
        v-model="formChangePassword"
        action="/auth/users/set_password/"
        method="post"
        @form-success="onSucceedChangePassword"
      >
        <template v-slot:footer>
          <div class="mt-4">
            <b-button type="submit" variant="primary" class="w-100">
              パスワードの変更
            </b-button>
          </div>
          <div class="text-right mt-4 small">
            <div class="mb-1">
              <router-link class="button secondaryAction" to="/password/reset/">
                パスワードを忘れましたか？
              </router-link>
            </div>
          </div>
        </template>
      </SendForm>
    </div>
  </div>
</template>

<script>
import SendForm from '@/components/SendForm.vue'

export default {
  metaInfo: {
    title: 'パスワードの変更',
  },
  components: {
    SendForm,
  },
  data() {
    return {
      formChangePassword: {
        current_password: {
          label: '現在のパスワード',
          type: 'password',
          required: true,
          value: '',
          warnings: [],
        },
        new_password: {
          label: '新しいパスワード',
          type: 'password',
          required: true,
          value: '',
          warnings: [],
        },
        re_new_password: {
          label: '新しいパスワード (確認用)',
          type: 'password',
          required: true,
          value: '',
          warnings: [],
        },
      },
    }
  },
  methods: {
    // パスワード変更押下
    onSucceedChangePassword: function () {
      this.$router.push('/account/')
      this.$store.dispatch('message/setInfoMessage', {
        message: 'パスワードを変更しました。',
      })
    },
  },
}
</script>

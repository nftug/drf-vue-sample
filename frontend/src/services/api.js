import axios from 'axios'
import store from '@/store'

const api = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// 共通前処理
api.interceptors.request.use(
  (config) => {
    // 認証用トークンがあればリクエストヘッダに加える
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = 'JWT ' + token
      return config
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 共通エラー処理
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log('error.response=', error.response)
    const status = error.response ? error.response.status : 500

    // エラー内容に応じてstoreのメッセージを更新
    let message
    if (status === 400 || status === 404) {
      // バリデーションNG
      // const messages = [].concat.apply([], Object.values(error.response.data))
      // store.dispatch("message/setWarningMessages", { messages: messages })
      // バリデーションNGと404の処理は各コンポーネントに任せる
    } else {
      if (status === 401) {
        // 認証エラー
        const token = localStorage.getItem('access')
        const refresh = localStorage.getItem('refresh')

        if (refresh != null && token != null) {
          // トークンのリフレッシュ
          // 必ずしも結果はエラーではない→returnは必須
          console.log('Access token expired. Trying to refresh...')
          return store.dispatch('auth/refresh').then(() => {
            console.log('Refresh succeeded. Retrying to request...')
            // JSON文字列を正しいオブジェクト型に再整形
            let config = Object.assign({}, error.config)
            if (typeof config.data === 'string') {
              config.data = JSON.parse(config.data)
            }
            // リトライ
            return api(config)
          })
        } else {
          if (refresh) {
            // リフレッシュ失敗時
            message = 'ログインの有効期限切れです。'
          } else {
            // 認証エラー
            message = '認証エラーです。'
          }
          store.dispatch('auth/logout')
        }
      } else if (status === 403) {
        // 権限エラー
        message = '権限エラーです。'
      } else {
        // その他のエラー
        message = 'その他のエラーです。'
      }
      store.dispatch('message/setErrorMessage', { message: message })
    }
    return Promise.reject(error)
  }
)

export default api

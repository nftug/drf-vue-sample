<template>
  <div id="home-page">
    <!-- メインエリア -->
    <b-row class="justify-content-between">
      <b-col cols="12" md="4">
        <b-button
          variant="primary"
          @click="showBookAddModal"
          :disabled="!$store.state.auth.isLoggedIn"
        >
          <font-awesome-icon icon="plus" />
          新規作成
        </b-button>
      </b-col>
      <b-col col xl="4" md="auto">
        <form @submit.prevent="searchQuery">
          <div class="input-group">
            <b-form-input
              v-model="searchKeyword"
              placeholder="リスト内を検索"
            />
          </div>
        </form>
      </b-col>
    </b-row>

    <div class="my-5">
      <table class="table table-hover" v-if="objs.length > 0">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">タイトル</th>
            <th scope="col">価格</th>
            <th scope="col">ユーザー</th>
            <th scope="col" width="250">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in objs" :key="book.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ book.title }}</td>
            <td>{{ book.price }}</td>
            <td>{{ book.username }}</td>
            <td>
              <b-button
                class="mr-1"
                size="sm"
                variant="primary"
                @click="showBookEditModal(book.id)"
                :disabled="
                  book.username !== $store.state.auth.username &&
                  !$store.state.auth.isSuperuser
                "
              >
                <font-awesome-icon icon="edit" />
                編集
              </b-button>
              <b-button
                class="mr-1"
                size="sm"
                variant="danger"
                @click="showBookDeleteModal(book.id)"
                :disabled="
                  book.username !== $store.state.auth.username &&
                  !$store.state.auth.isSuperuser
                "
              >
                <font-awesome-icon icon="trash-alt" />
                削除
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else-if="loading">読み込み中…</div>
      <div v-else>結果が見つかりません。</div>
    </div>

    <Pagination
      :next="pagination.next"
      :previous="pagination.previous"
      :total-pages="pagination.totalPages"
      :current-page="pagination.currentPage"
    />

    <!-- モーダル定義 -->
    <b-modal
      id="modal-book-add-edit"
      :title="isCreated ? '本の編集' : '本の新規作成'"
      @ok="handleBookFormOk"
    >
      <b-form-group
        label="タイトル"
        label-for="title"
        label-cols-sm="3"
        content-cols-sm="8"
      >
        <b-form-input
          id="title"
          v-model="form.values.title"
          :state="form.warnings.title.length ? false : null"
          @input="form.warnings.title = []"
        />
        <b-form-invalid-feedback
          v-for="(warning, index) in form.warnings.title"
          :key="index"
        >
          {{ warning }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        label="価格"
        label-for="price"
        label-cols-sm="3"
        content-cols-sm="8"
      >
        <b-form-input
          id="price"
          v-model="form.values.price"
          :state="form.warnings.price.length ? false : null"
          @input="form.warnings.price = []"
        />
        <b-form-invalid-feedback
          v-for="(warning, index) in form.warnings.price"
          :key="index"
        >
          {{ warning }}
        </b-form-invalid-feedback>
      </b-form-group>

      <template #modal-footer="{ cancel, ok }">
        <b-button variant="secondary" @click="cancel()">キャンセル</b-button>
        <b-button :variant="isCreated ? 'success' : 'primary'" @click="ok()">
          {{ isCreated ? '更新' : '登録' }}
        </b-button>
      </template>
    </b-modal>

    <b-modal id="modal-book-delete" title="本の削除" @ok="handleBookDeleteOk">
      <p class="my-4">本を削除しますか？</p>
      <template #modal-footer="{ cancel, ok }">
        <b-button variant="secondary" @click="cancel()">キャンセル</b-button>
        <b-button variant="danger" @click="ok()">削除</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import api from '@/services/api'
import ListGettable from '@/mixins'
import Pagination from '@/components/Pagination.vue'

export default {
  metaInfo: {
    title: 'ホーム',
  },
  components: {
    Pagination,
  },
  mixins: [ListGettable],
  data() {
    return {
      form: {
        values: {
          title: '',
          price: 0,
        },
        warnings: {
          title: [],
          price: [],
        },
      },
      apiURL: '/books/',
    }
  },
  computed: {
    isCreated: function () {
      return this.form.values.id !== undefined
    },
  },
  created: function () {
    this.getListFromAPI()
  },
  methods: {
    // フォームをクリア
    clearForm: function () {
      this.form.values = {
        id: undefined,
        title: '',
        price: 0,
      }
      // バリデーションをクリア
      Object.keys(this.form.values).forEach((key) => {
        this.form.warnings[key] = []
      }, this)
    },
    // 書籍追加モーダル表示
    showBookAddModal: function () {
      this.clearForm()
      this.$bvModal.show('modal-book-add-edit')
    },
    // 書籍編集モーダル表示
    showBookEditModal: function (id) {
      this.clearForm()
      this.form.values = Object.assign(
        {},
        this.objs.find((e) => e.id === id)
      )
      this.$bvModal.show('modal-book-add-edit')
    },
    // 書籍削除モーダル表示
    showBookDeleteModal: function (id) {
      this.form.values = Object.assign(
        {},
        this.objs.find((e) => e.id === id)
      )
      this.$bvModal.show('modal-book-delete')
    },
    // 作成・更新ボタン押下
    handleBookFormOk: function (bvModalEvt) {
      bvModalEvt.preventDefault()
      this.submitForm().then(() => {
        this.$nextTick(() => {
          this.$bvModal.hide('modal-book-add-edit')
        })
      })
    },
    // 削除確定ボタン押下
    handleBookDeleteOk: function () {
      api({
        method: 'delete',
        url: '/books/' + this.form.values.id + '/',
      }).then(() => {
        const message = this.form.values.title + 'を削除しました。'
        this.$store.dispatch('message/setInfoMessage', { message: message })
        this.clearForm()
        this.getListFromAPI()
      })
    },
    // フォーム送信
    submitForm: function () {
      return api({
        // 作成済みかどうかでエンドポイントを切り替える
        method: this.isCreated ? 'put' : 'post',
        url: this.isCreated ? '/books/' + this.form.values.id + '/' : '/books/',
        data: this.form.values,
      })
        .then(() => {
          const message =
            this.form.values.title +
            (this.isCreated ? 'を更新しました。' : 'を登録しました。')
          this.$store.dispatch('message/setInfoMessage', { message: message })
          this.getListFromAPI()
        })
        .catch((error) => {
          // バリデーションNG
          Object.keys(error.response.data).forEach(function (key) {
            this.form.warnings[key] = error.response.data[key]
          }, this)
          return Promise.reject(error)
        })
    },
  },
}
</script>

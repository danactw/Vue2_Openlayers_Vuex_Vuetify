<template>
  <v-card width="80%" class="mx-auto mt-10 pa-4" outlined>
    <v-tabs v-model="tabs" grow>
      <v-tab><v-icon>mdi-bullhorn</v-icon>個資宣告</v-tab>
      <v-tab><v-icon>mdi-account</v-icon>帳號資訊</v-tab>
      <v-tab><v-icon>mdi-lock</v-icon>密碼變更</v-tab>
      <v-tab><v-icon>mdi-clipboard-text</v-icon>訂單資訊</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-card class="mt-4">
          <v-card-title class="headline"
            >本系統之帳號資訊所記載個人資料僅供農林航空測量所辦理民眾申請航照圖資業務使用，不另作其他用途。</v-card-title
          >
          <v-card-text>
            <p>
              (依據99年5月26日修正個人資料保護法第5、8、15條規定)
            </p>

            <div class="text--primary">
              個資當事人對本所保有之個人資料如需:<br />
              1.查詢或請求閱覽<br />
              2.請求製給複製本<br />
              3.請求補充或更正<br />
              4.請求停止蒐集、處理或利用<br />
              5.請求刪除<br />
              請逕利用首長信箱申請辦理。(完整資訊請見本所個資宣告頁)<br />
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card class="mt-4">
          <v-row>
            <v-col cols="2" align-self="center">
              <v-subheader>姓名</v-subheader>
            </v-col>
            <v-col>
              <v-text-field
                v-model="user.userName"
                prepend-icon="mdi-account-box"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" align-self="center">
              <v-subheader>機關 / 公司行號</v-subheader>
            </v-col>
            <v-col>
              <v-text-field
                v-model="user.company"
                prepend-icon="mdi-office-building"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" align-self="center">
              <v-subheader>登記地址</v-subheader>
            </v-col>
            <v-col>
              <v-text-field
                v-model="user.address"
                prepend-icon="mdi-home"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" align-self="center">
              <v-subheader>聯絡電話</v-subheader>
            </v-col>
            <v-col>
              <v-text-field
                v-model="user.phone"
                prepend-icon="mdi-phone"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" align-self="center">
              <v-subheader>電子郵件</v-subheader>
            </v-col>
            <v-col>
              <v-text-field
                v-model="user.email"
                prepend-icon="mdi-email"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn 
                color="primary"
                @click="editable=true"
                :disabled="editable"
              >
                編輯
              </v-btn>
              <v-btn 
                class="ml-3"
                color="primary"
                @click="editable=false"
                :disabled="!editable"
              >
                儲存
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card class="mt-4">
          <v-form ref="passwordForm">
            <v-text-field
              label="原密碼"
              required
              :rules="oldPasswordRule"
              :type="showPasswordOld ? 'text' : 'password' "
              prepend-icon="mdi-lock"
              :append-icon="showPasswordOld ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPasswordOld=!showPasswordOld"
            />
            <v-text-field
              label="新密碼"
              v-model="newPassword"
              value=""
              :rules="newPasswordRule"
              :type="showPasswordNew ? 'text' : 'password' "
              hint="至少8個字元，可以混合使用英文字母、數字"
              prepend-icon="mdi-lock"
              :append-icon="showPasswordNew ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPasswordNew=!showPasswordNew"
            />
            <v-text-field
              label="新密碼確認"
              :rules="confirmPasswordRule"
              :type="showPasswordConfirm ? 'text' : 'password' "
              prepend-icon="mdi-lock"
              :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPasswordConfirm=!showPasswordConfirm"
            />
            <v-btn
              class="ml-3"
              color="primary"
              @click="updatePassword"
            >
              變更密碼
            </v-btn>
          </v-form>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card class="mt-4 pa-4">
          <v-card-title class="headline">最新訂單狀態</v-card-title>
          <v-data-table
            :headers="headers"
            :items="$store.state.orderRecords"
            show-expand
            :expanded.sync="expanded"
            hide-default-footer
          >
            <template v-slot:[`item.date`]="{ item }">
              {{ format_date(item.date) }}
            </template>
          </v-data-table>
          <v-card-title class="headline">注意事項</v-card-title>
          <v-card-text>
            <div class="text--primary">
              1. 確認訂單內容無誤後，請直接依訂單結算之總金額繳納圖資費用。<br />
              2. 繳納圖資費用有以下二種方式：<br />
              <span style="margin-left:10px;">(1) 利用臨櫃匯款請使用下列帳號：</span><br />
              <span style="margin-left:20px;">戶名：「林務局農林航空測量所302專戶」</span><br />
              <span style="margin-left:20px;">帳號：「033037091207臺灣銀行南門分行」</span><br />
              <span style="margin-left:10px;">(2) 利用網路ATM或實體ATM匯款者請連結下列網址操作繳費：</span><br />
              <span style="margin-left:20px;">https://sap.bot.com.tw/sap/sap1030s?MID=S00093</span><br />
              3. 選擇至現場領圖者，可於完成匯款後先電洽本所約定領圖時間，以便本所先行備圖，屆時至現場可免抽號碼牌等候，逕至繳費窗口告知訂單號碼即可領取圖資及收據。若是選擇至現場繳款者，仍請抽取號碼牌等候服務。<br />
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import moment from 'moment';
export default {
  data () {
    return {
      expanded: [],
      tabs: null,
      editable: false,
      showPasswordOld: false,
      showPasswordNew: true,
      showPasswordConfirm: false,
      newPassword: '',
      headers: [
        { text: '訂單編號', align: 'left', sortable: false, value: 'orderNo'},
        { text: '訂單日期', value: 'date' },
        { text: '訂單總額', value: 'amount' },
        { text: '訂單狀態', value: 'status' },
        { text: '繳款方式', value: 'payment' },
        { text: '取件方式', value: 'delivery' },
        { text: '收件人', value: 'recipient' },
        { text: '', value: 'data-table-expand' }
      ],
    }
  },
  computed: {
    user() {
      return this.$store.state.users[0]
    },
    oldPasswordRule () {
      return [
        v => !!v || '原密碼 為必填欄位！',
        v => v===this.user.password || '原密碼錯誤！'
      ]
    },
    newPasswordRule () {
      return [
        v => v.length >= 8 || '至少8個字元',
        v => v!==this.user.password || '新密碼不得與原密碼相同'
      ]
    },
    confirmPasswordRule () {
      return [
        v => !!v || '此欄位必填！',
        v => v===this.newPassword || '與新密碼不符'
      ]
    }
  },
  methods: {
    format_date(value){
      if (value) {
        return moment(value).format('YYYY/MM/DD')
      }
    },
    updatePassword () {
      this.user.password = this.newPassword
      this.$refs.passwordForm.reset()
      this.newPassword = ''
    }
  }
}
</script>

<style>

</style>
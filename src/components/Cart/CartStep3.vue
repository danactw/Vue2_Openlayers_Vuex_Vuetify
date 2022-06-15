<template>
  <v-stepper-content step="3" id="CartStep3">
    <v-card>
      <v-card-title class="pa-2">選擇繳款方式</v-card-title>
      <v-card-actions>
        <v-radio-group 
          v-model="paymentMethod" 
          c1lass="d-flex flex-row" 
          :rules="[v => !!v || '取件方式 為必填欄位！']"
        >      
          <v-radio
            v-for="paymentMethod in paymentMethodConfig"
            :key="paymentMethod"
            :label="paymentMethod"
            :value="paymentMethod"
            class="mb-2 mr-4"
          >
          </v-radio>
        </v-radio-group>
      </v-card-actions>
      <v-expansion-panels flat>
        <v-expansion-panel >
          <v-expansion-panel-header class="title pa-2">訂單內容一覽：影像清單</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :headers="simpleHeaders"
              :items="$store.state.itemsToBuy"
              item-key="filename"
              hide-default-footer
              fixed-header
            >
              <template v-slot:[`item.formatStatus`]="{ item }">
                <tr 
                  v-for="format in item.formatStatus"
                  :key="format.id"
                >
                  <td>
                    <v-chip
                      v-show="format.checked"
                      small
                      class="ma-1"
                    >
                    {{ format.label }}
                    </v-chip>
                  </td>
                </tr>
              </template>
              <template v-slot:[`item.quantity`]="{item}">
                <tr 
                  v-for="format in item.formatStatus"
                  :key="format.id"
                >
                  <td v-show="format.quantity">
                    <span class="d-inline-block ma-1">{{ format.quantity }}</span>
                  </td>
                </tr>
              </template>
              <template v-slot:[`item.total`]="{ item }">
                <span class="font-weight-bold">$ {{ getItemTotal(item).toLocaleString('en-US') }}</span>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-text>

      </v-card-text>
      <v-card-title class="pa-2">付款方式與寄送資訊</v-card-title>
      <v-card width="400" flat id="paymentInfo">
        <v-simple-table dense>
          <tbody>
            <tr>
              <td>付款方式</td>
              <td>{{ paymentMethod }} <v-btn 
                  plain class="pa-0"
                  @click="showBankInfo=true"
                >(查看匯款資訊)</v-btn></td>
            </tr>
            <tr>
              <td>配送方式</td>
              <td>{{ $store.state.orderedInfo.deliver }}</td>
            </tr>
            <tr>
              <td>取件人</td>
              <td>{{ $store.state.orderedInfo.orderby }}</td>
            </tr>
            <tr>
              <td>聯絡電話</td>
              <td>{{ $store.state.orderedInfo.mobile || $store.state.orderedInfo.landline }}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{{ $store.state.orderedInfo.email }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>
      <v-dialog v-model="showBankInfo" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            臨櫃匯款 帳號資訊
          </v-card-title>
          <v-card-text>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>臨櫃匯款請使用下列帳號：</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon>mdi-bank</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="`銀行名稱及分行`"></v-list-item-title>
                    <v-list-item-subtitle class="title" v-html="`臺灣銀行 南門分行`"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title v-html="`銀行代碼`"></v-list-item-title>
                    <v-list-item-subtitle class="title" v-html="`004`"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-account</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="`戶名`"></v-list-item-title>
                <v-list-item-subtitle class="title" v-html="`林務局農林航空測量所302專戶`"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-wallet</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="`匯款帳號`"></v-list-item-title>
                <v-list-item-subtitle class="title" v-html="`033037091207`"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="showBankInfo=false">瞭解</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card-title class="pa-2 mt-2">付款金額</v-card-title>
      <v-card-text class="pt-2">
        <span class="subheading">圖資: $ {{ $store.getters.getCartSubtotal.toLocaleString('en-US') }}</span><br />
        <span class="subheading">運費: $ {{ $store.state.freight.toLocaleString('en-US') }} (選擇宅配方式取件者, 實際費用另計)</span><br />
        <span class="title my-1"><strong>本訂單應付款金額：新台幣 {{ $store.getters.getCartTotal.toLocaleString('en-US') }} 元</strong></span><br />
        <span class="subheading red--text">本訂單圖資於繳款完成後開始進行備圖作業，俟備圖完成後另行通知領件。</span>
      </v-card-text>
      <v-textarea
        name="comment"
        label="訂單備註"
        prepend-inner-icon="mdi-comment"
        v-model="comment"
        no-resize
        class="pl-4"
        single-line
        rows="2"
      ></v-textarea>
      <v-btn text plain :ripple="false" color="primary" @click="showReturnPolicy = true">退款 / 換貨政策</v-btn>
      <v-dialog v-model="showReturnPolicy" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            退款 / 換貨政策
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="showReturnPolicy=false">瞭解</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card-actions class="pa-0">
        <v-btn 
          block
          color="primary"
          class="mt-2"
          :disabled="paymentMethod===''"
        >
          [確認無誤] 送出訂單
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-stepper-content>
</template>

<script>
export default {
  data() {
    return {
      paymentMethod: '',
      paymentMethodConfig: ['臨櫃匯款', '臺灣銀行虛擬帳號匯款', '線上信用卡繳款'],
      simpleHeaders: [
        { text: '圖名 / 檔名', value: 'filename', width: '30%', sortable: false },
        { text: '產品類別', value: 'image', width: '25%' },
        { text: '輸出', value: 'formatStatus', width: '15%', sortable: false },
        { text: '數量', value: 'quantity', width: '15%', sortable: false },
        { text: '小計', value: 'total', width: '15%', sortable: false },
      ],
      itemsToBuy: [
        {
          filename: "Frozen Yogurt",
          image: 159,
          shootingdate: 2022/1/1,
          cloudrate: 24,
          formatStatus: [
            {id:1 , pricing: 600, label: '紙圖', checked: false, quantity: 0},
            {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 1},
          ]
        },
        {
          filename: "Eclair",
          image: 159,
          shootingdate: 2022/1/1,
          cloudrate: 24,
          formatStatus: [
            {id:1 , pricing: 600, label: '紙圖', checked: true, quantity: 1},
            {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 2},
          ]
        },
        {
          filename: "95204027_081128d_Yogurt",
          image: 159,
          shootingdate: 2022/1/1,
          cloudrate: 24,
          formatStatus: [
            {id:1 , pricing: 600, label: '紙圖', checked: false, quantity: 0},
            {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 1},
          ]
        }
      ],
      showBankInfo: false,
      comment: '',
      showReturnPolicy: false
    }
  },
  methods: {
    getItemTotal (item) {
      return item.formatStatus.reduce((acc, cur) => {
        acc += cur.quantity*cur.pricing
        return acc
      },0 )
    },
  }
}
</script>

<style>
#CartStep3 .v-input--radio-group--column .v-input--radio-group__input {
  flex-direction: row;
}
#CartStep3 .v-input--selection-controls {
  margin-top: 0;
}
#CartStep3 .v-expansion-panel-header__icon {
  margin-left: 10px;
}
#paymentInfo td {
  border: none;
}
#paymentInfo tr:hover {
  background-color: transparent;
}

#CartStep3 td:first-child {
  width: 100px;
}
</style>
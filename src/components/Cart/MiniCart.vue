<template>
  <v-dialog
      v-model="$store.state.showMiniCart"
      max-width="80%"
    >
      <v-card>
        <v-card-title class="text-h5">
          選擇影像的輸出方式 ({{ $store.state.addToMiniCart.length }})
        </v-card-title>
        <v-card-subtitle>
          線上購圖製作期程約5個工作日，大量申購圖資(正射影像紙圖50幅以上或檔案100幅以上)視申購狀況調整期程。
        </v-card-subtitle>

        <v-card-text>
          <v-data-table
            id="miniCart"
            :headers="miniCartHeaders"
            :items="$store.state.addToMiniCart"
            item-key="filename"
            class="elevation-0"
            hide-default-footer
          >
            <template v-slot:[`item.formatStatus`]="{ item }">
              <tr 
                v-for="format in formatTemps"
                :key="format.id"
              >
                <td>
                  <v-checkbox
                    v-model="item.formatStatus[format.id-1].checked"
                    :label="format.name"
                    :value="format.name"
                    hide-details
                    class="flex-wrap"
                    @click="updateQuantity(item.formatStatus[format.id-1])"
                  >
                    <template v-slot:append>
                      <span class="ml-6 grey--text subtitle-2">{{ format.detail }}</span>
                    </template>
                  </v-checkbox>
                </td>
              </tr>
            </template>
            <template v-slot:[`item.quantity`]="{ item }">
              <tr 
                v-for="format in item.formatStatus"
                :key="format.id"
                class="addMargin"
              >
                <td>
                  <v-text-field
                    v-model="item.formatStatus[format.id-1].quantity"
                    hide-details
                    single-line
                    dense
                    class="mb-2 text-center"
                    type="number"
                    min="0"
                    @click="updateFormat(item.formatStatus[format.id-1])"
                    :disabled="!format.checked"
                  />
                </td>
              </tr>
            </template>
            <template v-slot:[`item.pricing`]="{item}">
              <tr 
                v-for="format in item.formatStatus"
                :key="format.id"
                class="addMargin"
              >
                <td class="py-2">
                  <span> $ {{ format.pricing.toLocaleString('en-US') }} </span>
                </td>
              </tr>
            </template>
            <template v-slot:[`item.total`]="{ item }">
              <span class="font-weight-bold">$ {{ getItemTotal(item).toLocaleString('en-US') }}</span>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-icon @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="$store.state.showMiniCart=false"
          >
            繼續瀏覽
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="addToCart"
          >
            加入購物車
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      miniCartHeaders: [
        { text: '圖名 / 檔名', value: 'filename', width: '0%', sortable: false },
        { text: '產品類別', value: 'image', width: '35%' },
        { text: '輸出方式', value: 'formatStatus', width: '35%', sortable: false },
        { text: '數量', value: 'quantity', width: '10%', sortable: false },
        { text: '單價', value: 'pricing', width: '10%', sortable: false },
        { text: '刪除', value: 'action', width: '10%', sortable: false }
      ],
      formatTemps: [{
        id: '1',
        name: '紙圖',
        detail: '60 cm x 76 cm 紙圖',
        price_tag: '600',
        checked: false,
        amount: '0'
      }, {
        id: '2',
        name: '實體檔案',
        detail: '內含 TIF 格式影像電子檔 (附帶 TFW 坐標檔及 DXF 圖框註記檔)',
        price_tag: '1200',
        checked: false,
        amount: '0'
      }],
    }
  },
  methods: {
    addToCart () {
      this.$store.state.addToMiniCart.forEach(item => {
        // 檢查是否有已經在itemsToBuy的item
        let index = 0
        this.$store.state.itemsToBuy.forEach(itemToBuy => {
          index++
          if (Object.values(itemToBuy).indexOf(item.filename)!= -1) return
        })
        this.$store.state.itemsToBuy.splice((index-1),1)
        // 檢查是否有addToMiniCart都沒有選輸出方式的item
        if (item.formatStatus[0].checked === null && item.formatStatus[1].checked === null) {
          this.$store.state.addToMiniCart.splice(this.$store.state.addToMiniCart.indexOf(item),1)
        }
      })
      this.$store.state.itemsToBuy.push(...this.$store.state.addToMiniCart)
      this.$store.state.addToMiniCart = []
      this.$store.state.showMiniCart = false
    },
    updateFormat (format) {
      if (format.quantity === '0') format.checked = null
    },
    updateQuantity (format) {
      if (!format.checked) format.quantity = 0
      else format.quantity = 1
    },
    deleteItem(item) {
      if (confirm(`確定要從新增清單裡刪除${item.filename}嗎？`)) {
        this.$store.state.addToMiniCart.splice(this.$store.state.addToMiniCart.indexOf(item),1)
      } else return 
    },
  }
}
</script>

<style>
#miniCart tr.addMargin {
  display: inline-block;
  padding-bottom: 30px;
}
</style>
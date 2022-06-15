<template>
  <v-stepper-content step="1" id="step1">
    <v-data-table
      height="55vh"
      v-model="selected"
      :headers="headers"
      :items="$store.state.itemsToBuy"
      item-key="filename"
      :single-select="false"
      show-select
      class="elevation-1"
      :items-per-page="5"
      :page.sync="page"
      hide-default-footer
      @page-count="pageCount = $event"
    >
      <template v-slot:[`item.shootingdate`]="{ item }">
        {{ format_date(item.shootingdate) }}
      </template>
      <template v-slot:[`item.formatStatus`]="{ item }">
        <tr 
          v-for="format in item.formatStatus"
          :key="format.id"
        >
          <td>
            <v-chip
              :input-value="format.checked"
              filter
              filter-icon="mdi-checkbox-marked-circle"
              @click="updateQuantity(format)"
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
          <td>
            <v-text-field
              v-model="format.quantity"
              hide-details
              single-line
              dense
              class="mb-2 text-center"
              type="number"
              min="0"
              @change="getItemTotal(item)"
              :disabled="!format.checked"
            />
          </td>
        </tr>
      </template>
      <template v-slot:[`item.pricing`]="{item}">
        <tr 
          v-for="format in item.formatStatus"
          :key="format.id"
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
    <div class="text-center pt-2 elevation-0">
      <v-pagination
        v-model="page"
        :length="pageCount"
        class="elevation-0"
        color="secondary"
      ></v-pagination>
    </div>
    <v-card>
        <v-card class="ml-auto pa-2">
          <v-card-text class="pa-0">
            <span class="subheading">圖資: $ {{ $store.getters.getCartSubtotal.toLocaleString('en-US') }}</span><br />
            <span class="subheading">運費: $ {{ $store.state.freight.toLocaleString('en-US') }} (選擇宅配方式取件者, 實際費用另計)</span><br />
            <span class="title my-1"><strong>訂單金額: {{ $store.getters.getCartTotal.toLocaleString('en-US') }}</strong></span>
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn 
              block
              color="primary"
              class="mt-2"
              @click="$store.state.cartProgress = 2" 
            >
              [下一步] 填寫訂單資訊
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-card>
  </v-stepper-content>
</template>

<script>
import moment from 'moment';
export default {
  data () {
    return {
      pageCount: 0,
      page: 1,
      selected: [],
      headers: [
        { text: '圖名 / 檔名', value: 'filename', width: '15%', sortable: false },
        { text: '產品類別', value: 'image', width: '15%' },
        { text: '拍攝日期', value: 'shootingdate', width: '10%' },
        { text: '含雲量', value: 'cloudrate', width: '10%' },
        { text: '輸出', value: 'formatStatus', width: '15%', sortable: false },
        { text: '數量', value: 'quantity', width: '10%', sortable: false },
        { text: '單價', value: 'pricing', width: '10%', sortable: false },
        { text: '小計', value: 'total', width: '10%', sortable: false },
        { text: '刪除', value: 'action', width: '5%', sortable: false }
      ],
      freight: 0
    }
  },
  methods: {
    deleteItem(item) {
      if (confirm(`確定要從購物車裡刪除${item.filename}嗎？`)) {
        this.$store.state.itemsToBuy.splice(this.$store.state.itemsToBuy.indexOf(item),1)
      } else return 
    },
    format_date(value){
      if (value) {
        return moment(String(value)).format('YYYY/MM/DD')
      }
    },
    getItemTotal (item) {
      return item.formatStatus.reduce((acc, cur) => {
        acc += cur.quantity*cur.pricing
        return acc
      },0 )
    },
    updateQuantity (format) {
      format.checked = !format.checked
      if (!format.checked) format.quantity = 0
      else format.quantity = 1
    },
  }
}
</script>

<style>
#step1 .v-text-field input {
  text-align: center;
}
</style>
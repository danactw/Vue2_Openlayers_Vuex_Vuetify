<template>
  <v-stepper-content step="1">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="itemsToBuy"
      item-key="filename"
      :single-select="false"
      show-select
      :page.sync="page"
      @page-count="pageCount = $event"
      class="elevation-1"
      :items-per-page="5"
      hide-default-footer
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
              class="mb-2"
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
          <td>
            <span> $ {{ format.pricing.toLocaleString('en-US') }} </span>
          </td>
        </tr>
      </template>
      <template v-slot:[`item.total`]="{ item }">
        $ {{ getItemTotal(item).toLocaleString('en-US') }}
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
    <div class="d-flex justify-space-between mt-4" >
      <v-btn text color="primary" :to="{ name: 'Home' }">
        回首頁
      </v-btn>
      <v-btn
        color="primary"
        @click="$store.state.cartProgress = 2"
      >
        下一步
      </v-btn>
    </div>
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
        { text: '圖名 / 檔名', value: 'filename', width: 100, sortable: false },
        { text: '產品類別', value: 'image', width: 120 },
        { text: '拍攝日期', value: 'shootingdate', width: 120 },
        { text: '含雲量', value: 'cloudrate', width: 100 },
        { text: '輸出', value: 'formatStatus', width: 80, sortable: false },
        { text: '數量', value: 'quantity', width: 80, sortable: false },
        { text: '單價', value: 'pricing', width: 80, sortable: false },
        { text: '小計', value: 'total', width: 80, sortable: false },
        { text: '刪除', value: 'action', width: 60, sortable: false }
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
        }
      ],
    }
  },
  methods: {
    deleteItem(item) {

    },
    format_date(value){
      if (value) {
        return moment(String(value)).format('YYYY/MM/DD')
      }
    },
    getItemTotal (item) {
      // console.log(item);
      return item.formatStatus.reduce((acc, cur) => {
        acc += cur.quantity*cur.pricing
        return acc
      },0 )
    },
    updateQuantity (format) {
      format.checked = !format.checked
      if (!format.checked) format.quantity = 0
      else format.quantity = 1
    }
  },
  mounted () {
    this.$store.state.cartBadge = this.itemsToBuy.length
  }
}
</script>

<style>

</style>
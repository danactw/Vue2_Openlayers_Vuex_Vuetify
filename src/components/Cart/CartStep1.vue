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
    >
      <template v-slot:[`item.formatStatus`]="{ item }">
        <v-chip
          v-for="format in formatConfig"
          :key="format.id"
        >
        {{ format.label }}
        </v-chip>
      </template>
      <template v-slot:[`item.total`]="{ item }">
        {{ item.quantity * item.pricing }}
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
          shootingdate: 6,
          cloudrate: 24,
          formatStatus: 1,
          quantity: 2,
          pricing: 100
        },
        {
          filename: "Eclair",
          image: 262,
          shootingdate: 16,
          cloudrate: 23,
          formatStatus: 2,
          quantity: 2,
          pricing: 100
        },
        {
          filename: "Cupcake",
          image: 305,
          shootingdate: 3.7,
          cloudrate: 67,
          formatStatus: 1,
          quantity: 2,
          pricing: 100
        },
        {
          filename: "Lollipop",
          image: 392,
          shootingdate: 0.2,
          cloudrate: 98,
          formatStatus: 1,
          quantity: 2,
          pricing: 100
        },
        {
          filename: "Honeycomb",
          image: 408,
          shootingdate: 3.2,
          cloudrate: 87,
          formatStatus: 2,
          quantity: 2,
          pricing: 100
        },
        {
          filename: "Donut",
          image: 452,
          shootingdate: 25,
          cloudrate: 51,
          formatStatus: 2,
          quantity: 2,
          pricing: 100
        },
        {
          filename: "KitKat",
          image: 518,
          shootingdate: 26,
          cloudrate: 65,
          formatStatus: 1,
          quantity: 2,
          pricing: 100
        },
      ],
      formatConfig: [{
        id: 1, pricing: 600, label: '紙圖'
      }, {
        id: 2, pricing: 1200, label: '實體檔案'
      }],
    }
  },
  methods: {
    deleteItem(item) {

    },
    formatGetter (id) {
      return this.formatConfig.filter(function (format) {
        return parseInt(format.id) === parseInt(id)
      })[0]
    },
  },
  mounted () {
    this.$store.state.cartBadge = this.itemsToBuy.length
  }
}
</script>

<style>

</style>
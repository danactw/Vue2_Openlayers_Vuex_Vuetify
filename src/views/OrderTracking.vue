<template>
  <v-container style="max-width: 900px;">
    <v-timeline
      dense
      clipped
    >
      <v-timeline-item
        fill-dot
        class="white--text mb-4"
        color="orange"
        large
      >
        <template v-slot:icon>
          <span>UN</span>
        </template>
        <div class="black--text mt-4">TODAY</div>
      </v-timeline-item>

      <v-timeline-item
        class="mb-4"
        color="grey"
        icon-color="grey lighten-2"
        small
      >
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-row justify="space-between">
              <v-col cols="5">
                訂購日期：
              </v-col>
              <v-col cols="4">
                訂購數量：
              </v-col>
              <v-col cols="3">
                總金額：
              </v-col>
            </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card>
                <v-card-title>
                  訂單編號：123456
                </v-card-title>
                  <v-data-table
                    :headers="headers"
                    :items="items"
                    :items-per-page='5'
                  ></v-data-table>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        headers: [
          {
            text: '產品編號',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: '單價', value: 'price' },
          { text: '備註', value: 'memo' },
        ],
        items: [
          {
            name: 'Pic 1',
            price: 159,
            memo: 6.0,
          },
          {
            name: 'Pic 2',
            price: 237,
            memo: 9.0,
          },
          {
            name: 'Pic 3',
            price: 262,
            memo: 16.0,
          },
        ],
      }
    },
  }
</script>

<style>
.v-sheet.v-card:not(.v-sheet--outlined){
  box-shadow: none;
}
</style>
<template>
  <v-data-table
    id="resultsTable"
    v-model="$store.state.itemsInMiniCart"
    :headers="searchResultsHeader"
    :items="$store.state.searchResults"
    item-key="filename"
    show-select
    show-expand
    :expanded.sync="expanded"
    class="elevation-0"
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat dense>
        <v-spacer></v-spacer>
        <v-btn plain @click="expanded=$store.state.searchResults">全部展開</v-btn>
        <v-btn plain @click="expanded=[]">全部收合</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:[`item.filename`]="{ item }">
      {{ item.filename }}
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <div class="box d-flex">
          <div class="imgContainer" style="width: 40%; height: 0; padding-bottom: 40%; position: relative">
            <img :src="item.image" style="width: 100%; height: 100%; position: absolute; object-fit: cover">
          </div>
          <div class="textContainer pa-4" style="width: 60%">
            <h4>{{ item.filename }}</h4>
            <span>{{ item.shootingdate }}</span>
            <v-divider></v-divider>
            <span class="text-subtitle-2 ml-1">影像主題標籤:</span><br/>
            <v-chip v-for="feature in 3" :key="feature.id" class="ma-1" small label :ripple="false"><v-icon left>mdi-label</v-icon>#{{ feature }} tags</v-chip>
            <v-divider></v-divider>
            <div class="btnContainer d-flex mt-2 blue--text subtitle-2">
              <div>
                <v-btn
                  outlined
                  fab
                  small
                  color="rgba(68,138,255,0.85)"
                  elevation="0"
                >
                  <v-icon>mdi-cart</v-icon>
                </v-btn>
                直接購買
              </div>
              <div>
                <v-btn
                  class="ml-6"
                  outlined
                  fab
                  small
                  color="rgba(68,138,255,0.85)"
                  elevation="0"
                >
                  <v-icon>mdi-magnify-scan</v-icon>
                </v-btn>
                標記放大
              </div>
            </div>
          </div>
        </div>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data () {
    return {
      expanded: [],
      searchResultsHeader: [
        { text: '圖名 / 檔名', value: 'filename', width: '50%', align: 'start',sortable: false },
        { text: '拍攝日期', value: 'shootingdate', width: '25%' },
        { text: '含雲量', value: 'cloudrate', width: '25%' },
        { value: 'data-table-expand' },
      ]
    }
  }
}
</script>

<style>
#resultsTable tr th:first-child,
#resultsTable tr td:first-child {
  padding: 0 8px;
}

#resultsTable {
  margin: 0 -8px;
}

#resultsTable .v-data-table__wrapper {
  max-height: calc(100vh - 380px);
  overflow: scroll;
}
</style>
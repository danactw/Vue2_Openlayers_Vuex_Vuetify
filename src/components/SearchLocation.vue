<template>
  <v-menu offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        dark
        v-bind="attrs"
        v-on="on"
        color="grey darken-1"
        class="align-self-center"
      >
        <v-icon>mdi-map-marker-radius</v-icon>
        Search Location
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-tabs v-model="tabs">
        <v-tab v-for="searchMethod in searchMethods" :key="searchMethod.text"> {{ searchMethod.text }} </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card>
            <v-card-text>
              <v-text-field
                v-model="fullAddress"
                label="請輸入門牌地址"
                hide-details="auto"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn class="mx-auto">搜尋</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-text>
              <v-form class="d-flex">
                <v-autocomplete
                  class="mx-2"
                  v-model="selectedCity"
                  :items="cities"
                  label="請選擇縣市">
                </v-autocomplete>
                <v-autocomplete
                  class="mx-2"
                  v-model="selectedDistrict"
                  :items="districts"
                  label="請選擇行政區">
                </v-autocomplete>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn class="mx-auto">搜尋</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-text>
              <v-text-field
                v-model="pictureInfo"
                label="請輸入圖號(8碼)或圖名"
                hide-details="auto"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn class="mx-auto">搜尋</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-text>
              <v-form class="d-flex">
                <v-autocomplete
                  class="mx-2"
                  v-model="selectedCity"
                  :items="cities"
                  label="請選擇縣市">
                </v-autocomplete>
                <v-autocomplete
                  class="mx-2"
                  v-model="selectedDistrict"
                  :items="districts"
                  label="請選擇行政區">
                </v-autocomplete>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn class="mx-auto">搜尋</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      selectedSearchMethod: '',
      searchMethods: [
        { id: 1, text: '門牌位置比對（含地標定位）', source: '服務來源: 內政部地理資訊圖資雲服務平台', hint: '請輸入 門牌地址', apiRef: 10, icon: '' },
        { id: 2, text: '地籍定位', source: '服務來源: 地政司地籍圖資網路便民服務系統', hint: '請選擇 段號查詢條件', apiRef: 20, icon: 'architecture' },
        { id: 3, text: '五千分之一圖幅圖號定位', hint: '請輸入 圖號(8碼) 或 圖名', apiRef: 30, icon: '' },
        { id: 4, text: '行政區定位', hint: '請選擇 縣市/鄉鎮市區名稱', apiRef: 50, icon: '' }
      ],
      tabs: null,
      showPassword: false,
      cityAndDistrict: [],
      selectedCity: '',
      selectedDistrict: '',
      fullAddress: '',
      pictureInfo: ''
    }
  },
  computed: {
    searchMethodsText() {
      return this.searchMethods.filter(searchMethod => searchMethod.text)
    },
    cities() {
      const city = []
      this.cityAndDistrict.map(place => city.push(place.city))
      return city
    },
    districts() {
      const district = []
      this.cityAndDistrict.filter(place => {
        if(place.city===this.selectedCity) {
          place.districts.forEach(place => district.push(place.name))
        }
      })
      return district
    }
  },
  methods: {
    fetchAddress() {
      const url = 'https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json'
      fetch(url)
        .then(res => res.json())
        .then(data => {
          data.forEach(city => {
            this.cityAndDistrict.push({city: city.name, districts: city.districts})
          });
        })
    },
  },
  mounted() {
    this.fetchAddress()
  }
}
</script>

<style>
#app .v-toolbar .v-input {
  margin-top: 6px;
}
</style>
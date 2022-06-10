<template>
  <v-menu 
    top 
    offset-y 
    :nudge-right="10"
    max-width="600"
    max-height="600"
    :close-on-content-click="false" 
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        id="selectLayerBtn"
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        Dropdown
      </v-btn>
    </template>
    <v-card class="pa-4">
      <v-row v-for="(layer, index) in layerOpt" :key="index">
        <v-col cols="3" align-self="center">
          <v-img
            max-height="150"
            max-width="250"
            :src="layer.img"
          ></v-img>
        </v-col>
        <v-col>
          <v-radio-group>
            <v-radio
              :label="layer.label"
              :value="layer.title"
              dense
            ></v-radio>
            <template v-slot:append>
              <v-row class="flex-column">
                <v-col>                  
                  <v-card-text>
                    {{ layer.desc }}
                  </v-card-text>
                </v-col>
                <v-col>
                  <v-card flat width="300">
                    <v-card-text>
                      <v-subheader> Opacity </v-subheader>
                      <v-slider
                        step="0.1"
                        min="0"
                        max="1"
                        thumb-label
                        ticks
                      ></v-slider>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script>
import { OSM, Vector as VectorSource, TileWMS } from 'ol/source'
export default {
  data() {
    return {
      layerOpt: [
        {
          type: 'baselayer',
          title: 'ATIS_MNC',
          label: '全臺鑲嵌無雲正射影像',
          visable: true,
          opacity: 100,
          readonly: false,
          desc:
            '應用5000圖幅框與正射影像詮釋資料進行「雲量」、「拍攝日期」條件式空間比對之成果，將各圖幅最新版次及無雲之正射影像拼接而成的主題圖組。',
          img: 'https://picsum.photos/id/11/150/150',
          // img:
          //   'https://gis.afasi.gov.tw/map/viewMap/reflect?LAYERS=ATIS_MNC&FORMAT=image/gif&TRANSPARENT=true&HEIGHT=150',
          source: new TileWMS({
            url: 'https://gis.afasi.gov.tw/map/viewMap/wms',
            params: {
              LAYERS: 'ATIS_MNC',
              FORMAT: 'image/gif',
              VERSION: '1.1.0'
            },
            transition: 0
          })
        },
        {
          type: 'baselayer',
          title: 'NSPO_FS5',
          label: '福爾摩沙衛星影像 (福衛5號)',
          visable: false,
          opacity: 100,
          readonly: false,
          desc: '由國家太空中心提供之全島融合自然色衛星影像。',
          img: 'https://picsum.photos/id/11/150/150',
          // img:
          //   'https://gis.afasi.gov.tw/map/viewMap/fs2ref?LAYERS=FS5_NSPO_2020:fs2020-2nc_masked&FORMAT=image/gif&TRANSPARENT=true&WIDTH=110&HEIGHT=110',
          source: new TileWMS({
            url: 'https://gis.afasi.gov.tw/map/viewMap/fs2',
            params: {
              LAYERS: 'FS5_NSPO_2020:fs2020-2nc_masked',
              FORMAT: 'image/gif',
              VERSION: '1.1.0'
            },
            transition: 0
          })
        },
        {
          type: 'basemap',
          title: 'OSM',
          label: '開放街圖',
          visable: true,
          opacity: false,
          readonly: true,
          desc:
            '是自由而且開源的全球地圖，於2004年由英國的 Steve Coast 發起，採用類似 Wiki 的協作編輯以及開放的授權與格式。',
          img: 'https://picsum.photos/id/11/150/150',
          // img: '',
          source: new OSM()
        },
        {
          type: 'baselayer',
          title: 'EMAP',
          label: '通用版電子地圖',
          visable: false,
          opacity: 75,
          readonly: false,
          desc:
            '為政府機關自行產製的電子地圖，於民國100年建置完成並持續辦理更新維護，更新頻率以2年為週期，並針對全國重要道路與地標、重大工程及使用者反應局部區域變動部分進行動態更新。',
          img: 'https://picsum.photos/id/11/150/150',
          // img:
          //   'https://gis.afasi.gov.tw/map/viewMap/reflect?LAYERS=TGOS:EMAP&FORMAT=image/gif&TRANSPARENT=true&WIDTH=500&HEIGHT=500',
          source: ''
        }
      ],
    }
  }
}
</script>

<style scoped>
#selectLayerBtn {
  position: absolute;
  bottom: 0;
  right: 10px;
  z-index: 10;
}
.v-input--selection-controls.v-input{
  flex-direction: column;
}
.v-card__text{
  padding: 0 16px;
}
.v-subheader{
  height: auto;
  padding: 0;
}
.col {
  padding: 5px 12px;
}
</style>
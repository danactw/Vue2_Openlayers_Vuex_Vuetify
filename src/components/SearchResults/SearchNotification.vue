<template>
  <v-expansion-panels id="searchNotification">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <p class="mb-0">
          共找到了 <span style="color:#C62828;">{{ $store.state.searchResults.length }}</span> 筆影像檔案<span v-if="open">，已選取 <span style="color:#C62828;">{{ $store.state.addToMiniCart.length }}</span> 筆。</span><br>
          <span class="d-inline-block mt-1">@ {{ $store.state.clickedCoordinateX}} , {{ $store.state.clickedCoordinateY }}</span>
        </p>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-select
          :items="['不限雲量','小於10%']"
          label="雲量"
        ></v-select>
        <v-range-slider
          v-model="range"
          :max="max"
          :min="min"
          step="1"
          hide-details
          class="align-center mt-4"
          thumb-label
        >
          <template v-slot:prepend>
            <span style="width: max-content">民國</span>
            <v-text-field
              v-model="startYear"
              class="mt-0 pt-0"
              :max="max"
              :min="min"
              hide-details
              single-line
              type="number"
              style="width: 45px"
              @change="$set(range, 0, $event)"
            ></v-text-field>
            <span>年</span>
          </template>
          <template v-slot:append>
            <span style="width: max-content">民國</span>
            <v-text-field
              v-model="endYear"
              class="mt-0 pt-0"
              hide-details
              :max="max"
              :min="min"
              single-line
              type="number"
              style="width: 60px"
              @change="$set(range, 1, $event)"
            ></v-text-field>
            <span>年</span>
          </template>
        </v-range-slider>
        <v-divider class="mt-4"></v-divider>
        <ResutlsTableVue />
        <v-bottom-navigation horizontal absolute>
          <v-btn color="primary" text @click="$store.state.searchResults=[]">
            <span color="primary">清除搜尋</span>
            <v-icon>mdi-restart</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text>
            <span color="primary">匯出</span>
            <v-icon>mdi-tray-arrow-down</v-icon>
          </v-btn>
          <v-btn color="primary" text @click="$store.state.showMiniCart=true">
            <span color="primary">下單</span>
            <v-icon>mdi-cart</v-icon>
          </v-btn>
        </v-bottom-navigation>
        <MiniCartVue />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import ResutlsTableVue from './ResutlsTable.vue'
import MiniCartVue from '../Cart/MiniCart.vue';
export default {
  data() {
    return {
      open: true,
      min: 67,
      max: 108,
      startYear: 80,
      endYear: 100,
    };
  },
  computed: {
    range: {
      get() {
        return [this.startYear, this.endYear];
      },
      set(value) {
        [this.startYear, this.endYear] = value;
      }
    }
  },
  components: { ResutlsTableVue, MiniCartVue }
}
</script>

<style>
.v-input__append-outer,
.v-input__prepend-outer {
  align-items: center;
}
#searchNotification .v-text-field input {
  text-align: center;
}
#searchNotification .v-item-group.v-bottom-navigation--absolute {
  bottom: -8%;
}
</style>
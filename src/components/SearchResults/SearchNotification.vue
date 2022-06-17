<template>
  <v-expansion-panels id="searchNotification" v-model="$store.state.searchExpend">
    <v-expansion-panel>
      <v-expansion-panel-header v-show="$store.state.search">
        <p class="mb-0">
          共找到了 <span style="color:#C62828;">{{ $store.state.searchResults.length }}</span> 筆影像檔案<span v-if="open">，已選取 <span style="color:#C62828;">{{ $store.state.itemsInMiniCart.length }}</span> 筆。</span><br>
          <span class="d-inline-block mt-1">
            @ {{ $store.state.clickedCoordinate }}
          </span>
        </p>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="d-flex">
          <v-select
            style="width: 25%; padding-top: 12px;"
            :items="['不限雲量','小於10%']"
            label="雲量"
            dense
            rounded
            outlined
            flat
            solo
            hide-details
          ></v-select>
          <v-spacer></v-spacer>
          <v-range-slider
            style="width: 60%"
            v-model="range"
            :max="max"
            :min="min"
            step="1"
            hide-details
            class="align-center flex-column"
          >
            <template v-slot:prepend>
              <div class="d-flex justify-center align-center" style="width:100%">
                <span> 拍攝年份：民國</span>
                <v-text-field
                  v-model="startYear"
                  class="mt-0 pt-0"
                  :max="max"
                  :min="min"
                  hide-details
                  single-line
                  type="number"
                  @change="$set(range, 0, $event)"
                ></v-text-field>
                <span>年至民國</span>
                <v-text-field
                  v-model="endYear"
                  class="mt-0 pt-0"
                  hide-details
                  :max="max"
                  :min="min"
                  single-line
                  type="number"
                  @change="$set(range, 1, $event)"
                ></v-text-field>
                <span>年</span>
              </div>
            </template>
          </v-range-slider>
        </div>
        <v-divider class="mt-2"></v-divider>
        <ResutlsTableVue />
        <v-bottom-navigation horizontal absolute>
          <v-btn color="primary" text @click="$emit('clearSearch')">
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
  components: { ResutlsTableVue, MiniCartVue },
  data() {
    return {
      open: true,
      min: 67,
      max: 108,
      startYear: 67,
      endYear: 108,
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
  }
}
</script>

<style>
#searchNotification .v-text-field input {
  text-align: center;
}
#searchNotification .v-item-group.v-bottom-navigation--absolute {
  bottom: -50px;
}
#searchNotification .v-input__prepend-outer {
  width: 100%;
}
</style>
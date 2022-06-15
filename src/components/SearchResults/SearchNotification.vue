<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <p class="mb-0">
          共找到了 <span style="color:#C62828;">{{ $store.state.searchResults.length }}</span> 筆影像檔案<span v-if="open">，已選取 <span style="color:#C62828;">{{ $store.state.selectedSearchResults.length }}</span> 筆。</span><br>
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
            class="align-center"
            thumb-label
          >
            <template v-slot:prepend>
              <span class="d-flex">
                <span>民國</span>
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
              </span>
            </template>
            <template v-slot:append>
              <span>民國</span>
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
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  data () {
    return {
      open: true,
      min: 67,
      max: 108,
      startYear: 80,
      endYear: 100,
      // range: [80,100]
    }
  },
  computed: {
    range: {
      get() {
        return [this.startYear, this.endYear]
      },
      set(value) {
        [this.startYear, this.endYear] = value
      }
    }
  },
  watch: {
    range() {
      return [this.startYear, this.endYear]
    }
  }
}
</script>

<style>

</style>
<template>
  <v-menu 
    transition="slide-x-transition"
    v-model="$store.state.showMenu"
    :close-on-content-click="false"
    :close-on-click="false"
    :position-x="$store.state.clickedPositionX"
    :position-y="$store.state.clickedPositionY"
    :nudge-bottom="55"
    top
    >
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>City & District</v-list-item-title>
            <v-list-item-subtitle>
              {{$store.state.clickedCoordinateX}}, {{$store.state.clickedCoordinateY}}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action class="ma-0 pa-0">
            <v-btn
              v-model="fav"
              :class="fav ? 'red--text' : ''"
              icon
              @click="fav=!fav"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-subheader class="mr-0 pb-2 pl-0">半徑</v-subheader>
          <v-slider
            v-model="$store.state.homeMap.updateRadius"
            class="ma-n2 pa-n2"
            :max="5"
            step="1"
            ticks="always"
            tick-size="4"
            hide-details
            thumb-color="blue lighten-2"
            dense
          >
            <template v-slot:append>
              <v-select
                v-model="$store.state.homeMap.updateRadius"
                :items="distanceTable"
                item-text="label"
                item-value="value"
                class="mt-0 pt-0"
                hide-details
                single-line
                dense
                style="width: 90px; font-size: small"
              ></v-select>
            </template>
          </v-slider>
        </v-list-item>
        <v-divider></v-divider>
<v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title mb-4">影像組合：</v-list-item-title>
          <v-container class="py-0">
            <v-row
              justify="start"
            >
              <v-col
                v-for="(selection, i) in selections"
                :key="selection.text"
                class="shrink"
              >
                <v-chip
                  :disabled="loading"
                  close
                  @click:close="selected.splice(i, 1)"
                >
                  <v-icon
                    left
                    v-text="selection.icon"
                  ></v-icon>
                  {{ selection.text }}
                </v-chip>
              </v-col>

              <v-col
                v-if="!allSelected"
                cols="12"
              >
                <v-text-field
                  class="pt-0"
                  ref="search"
                  v-model="search"
                  full-width
                  hide-details
                  label="Search"
                  single-line
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>

      <v-divider v-if="!allSelected" class="mb-4"></v-divider>

      <template v-for="item in categories">
        <v-list-item
          v-if="!selected.includes(item)"
          :key="item.text"
          :disabled="loading"
          @click="selected.push(item)"
        >
          <v-list-item-avatar>
            <v-icon
              :disabled="loading"
              v-text="item.icon"
            ></v-icon>
          </v-list-item-avatar>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </template>
      </v-list>
      <v-card-actions class="mt-0 pt-0">
        <v-spacer></v-spacer>
        <v-btn text @click="$store.state.showMenu=false">關閉</v-btn>
        <v-btn :disabled="selected.length===0" color="primary" text >找影像</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      fav: false,
      distanceTable: [
        // { label: '50 公尺', value: 0 },
        // { label: '250 公尺', value: 1 },
        // { label: '500 公尺', value: 2 },
        // { label: '1 公里', value: 3 },
        // { label: '1.5 公里', value: 4 },
        // { label: '2 公里', value: 5 }
        { label: '50 公里', value: 0 },
        { label: '100 公里', value: 1 },
        { label: '200 公里', value: 2 },
        { label: '500 公里', value: 3 },
        { label: '1000 公里', value: 4 },
        { label: '1500 公里', value: 5 }
      ],
      items: [
      {
        text: '正射影像',
        icon: 'mdi-image-area',
      },
      {
        text: '衛星影像',
        icon: 'mdi-satellite-variant',
      },
    ],
    loading: false,
    search: '',
    selected: [],
    }
  },
  computed: {
    allSelected () {
      return this.selected.length === this.items.length
    },
    categories () {
      const search = this.search.toLowerCase()

      if (!search) return this.items

      return this.items.filter(item => {
        const text = item.text.toLowerCase()

        return text.indexOf(search) > -1
      })
    },
    selections () {
      const selections = []

      for (const selection of this.selected) {
        selections.push(selection)
      }

      return selections
    },
  },

  watch: {
    selected () {
      this.search = ''
    },
  },
}
</script>

<style>

</style>
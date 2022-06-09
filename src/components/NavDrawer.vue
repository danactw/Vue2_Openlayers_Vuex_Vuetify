<template>
  <v-navigation-drawer clipped :app="$store.state.showNavDrawer">
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">找影像?</v-list-item-title>
          <v-list-item-subtitle><a href="/atisweb/WebProvide/UserManual" target="_blank">使用手冊</a><v-icon class="ml-2 mb-2">mdi-book-open-blank-variant</v-icon></v-list-item-subtitle>
        </v-list-item-content>
        <v-btn icon @click.stop="toggleNavDrawer">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider class="pb-4"></v-divider>
      
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
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
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
  }),

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

  methods: {
    toggleNavDrawer() {
      this.$store.commit('TOGGLE_showNavDrawer')
    },
    next () {
      this.loading = true

      setTimeout(() => {
        this.search = ''
        this.selected = []
        this.loading = false
      }, 2000)
    },
  }
}
</script>

<style>
#app .v-text-field--full-width > .v-input__control > .v-input__slot{
  display: block;
  min-height: 30px;
}

/* to position to 'Search' in the correct location above the line */
#app .v-text-field--full-width .v-label {
  top: 5px;
}
</style>
<template>
  <v-app-bar app clipped-left height="55">
    <v-container>
      <v-row>
        <v-col>
          <v-toolbar-title v-if="$route.path!=='/'">Openlayers</v-toolbar-title>
          <v-app-bar-nav-icon v-else @click="toggleNavDrawer"></v-app-bar-nav-icon>
        </v-col>
        <v-col class="text-right" align-self="center">
          <v-btn v-for="(link, index) in routerLinks" :key="index" :to="{ name: link.path }" rounded plain> {{ link.title }} </v-btn>
          <v-menu offset-y nudge-bottom="10">
            <template v-slot:activator="{ on, attrs }">        
              <v-avatar size="36px" v-on="on" v-bind="attrs">
                <v-icon color="grey darken-2">mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-card>
              <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                  <v-avatar color="orange" class="mb-3">
                    <span class="white--text text-h5">{{ user.initials }}</span>
                  </v-avatar>
                  <h3>{{ user.fullName }}</h3>
                  <p class="text-caption mt-1">{{ user.email }}</p>
                  <div v-for="(link, index) in dropDowns" :key="index">
                    <v-divider class="my-3"></v-divider>
                    <v-btn  :to="{ name: link.path }" depressed plain rounded>{{ link.title }}</v-btn>
                  </div>
                </div>
              </v-list-item-content>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      routerLinks: [
        { path: 'Home', title: 'Home'},
        { path: 'About', title: 'Main Map'},
        { path: 'InteractionMap', title: 'Interaction Map'},
        { path: 'VectorMap', title: 'Vector Map'},
      ],
      dropDowns: [
        { path: 'UserAuth', title: 'Sign up / Login in'},
        { path: 'UserProfile', title: 'User Profile'},
        { path: 'ShoppingCart', title: 'Shopping Cart'},
        { path: 'OrderTracking', title: 'Order Tracking'},
      ],
      user: {
        initials: 'UN',
        fullName: 'User Name',
        email: 'user@gmail.com',
      },
    }
  },
  methods: {
    toggleNavDrawer() {
      this.$store.commit('TOGGLE_showNavDrawer')
    }
  }
}

</script>

<style>
</style>
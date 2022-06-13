<template>
  <v-app-bar app clipped-left height="55">
    <v-container>
      <v-row>
        <v-col class="pl-0" cols="4">
          <v-toolbar-title v-if="$route.path!=='/'">Openlayers</v-toolbar-title>
          <div class="d-flex" v-else >
            <v-app-bar-nav-icon @click="toggleNavDrawer" class="mr-4"></v-app-bar-nav-icon>
            <SearchLocation />
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right" cols="6" align-self="center">
          <v-btn v-for="(link, index) in routerLinks" :key="index" :to="{ name: link.path }" rounded plain> {{ link.title }} </v-btn>
          <v-btn :to="{ name: 'ShoppingCart' }" rounded plain color="grey darken-2">
            <v-badge
              color="#1DD3B0"
              :content="$store.state.cartBadge"
              overlap
              offset-x="7"
              ref="cartBadge"
            >
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </v-btn>
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
import SearchLocation from "./SearchLocation.vue";
export default {
  data() {
    return {
      routerLinks: [
        { path: "Home", title: "Home" },
        { path: "About", title: "Main Map" },
        { path: "InteractionMap", title: "Interaction Map" },
        { path: "VectorMap", title: "Vector Map" },
      ],
      dropDowns: [
        { path: "UserAuth", title: "Sign up / Login in" },
        { path: "UserProfile", title: "User Profile" },
        { path: "ShoppingCart", title: "Shopping Cart" },
        { path: "OrderTracking", title: "Order Tracking" },
      ],
      user: {
        initials: "UN",
        fullName: "User Name",
        email: "user@gmail.com",
      },
    };
  },
  methods: {
    toggleNavDrawer() {
      this.$store.commit("TOGGLE_showNavDrawer");
    }
  },
  components: { SearchLocation }
}

</script>

<style>
.v-toolbar__content {
  padding: 4px 0;
}
</style>
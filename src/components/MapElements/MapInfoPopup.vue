<template>
  <v-speed-dial
    direction="right"
    bottom
    left
    open-on-hover
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 66 74" width="66pt" height="74pt">
          <defs>
            <clipPath id="_clipPath_HcQAR3yvjSaXOP2OjVE4npqsXNKxWD4l">
                <rect width="66" height="74"/>
            </clipPath>
            <linearGradient id="gradient-red">
              <stop offset="5%" stop-color="#F96A4D" />
              <stop offset="60%" stop-color="#F95738"/>
            </linearGradient>
          </defs>
          <g clip-path="url(#_clipPath_HcQAR3yvjSaXOP2OjVE4npqsXNKxWD4l)">
            <g fill="url(#gradient-red)">
              <path d=" M 27.964 64.606 C 12.684 62.19 1 48.958 1 33 C 1 15.328 15.328 1 33 1 L 33 1 L 33 1 C 50.672 1 65 15.328 65 33 C 65 48.958 53.316 62.19 38.036 64.606 L 33 73 L 27.964 64.606 Z  M 33 8.833 C 46.325 8.833 57.167 19.675 57.167 33 C 57.167 46.325 46.325 57.167 33 57.167 C 19.675 57.167 8.833 46.325 8.833 33 C 8.833 19.675 19.675 8.833 33 8.833 L 33 8.833 L 33 8.833 Z "/>
            </g>
            <defs>
              <filter id="e2TCN41lcEcegIm6AEH065sZxSHe2Z3p" x="-200%" y="-200%" width="400%" height="400%" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB">
                <feGaussianBlur
                  xmlns="http://www.w3.org/2000/svg" in="SourceGraphic" stdDeviation="0.8587218125678057"/>
                <feOffset
                  xmlns="http://www.w3.org/2000/svg" dx="0" dy="1" result="pf_100_offsetBlur"/>
                <feFlood
                  xmlns="http://www.w3.org/2000/svg" flood-color="#000000" flood-opacity="0.65"/>
                <feComposite
                  xmlns="http://www.w3.org/2000/svg" in2="pf_100_offsetBlur" operator="in" result="pf_100_dropShadow"/>
                <feBlend
                  xmlns="http://www.w3.org/2000/svg" in="SourceGraphic" in2="pf_100_dropShadow" mode="normal"/>
              </filter>
            </defs>
            <g filter="url(#e2TCN41lcEcegIm6AEH065sZxSHe2Z3p)">
              <circle vector-effect="non-scaling-stroke" cx="33" cy="32.999999999999986" r="24" fill="rgb(255,255,255)"/>
            </g>
            <!-- info marker -->
            <g>
              <path d=" M 27.117 43.02 C 28.997 37.046 30.217 35.21 30.844 33.396 C 31.754 30.77 30.137 29.603 25.047 34.093 L 23.914 31.96 C 29.724 25.623 41.694 24.19 37.624 34.006 C 35.077 40.136 35.604 38.953 34.564 42.146 C 33.047 46.8 36.874 44.913 40.624 41.443 C 41.137 42.28 41.301 42.55 41.814 43.51 C 33.484 51.45 24.244 52.15 27.117 43.02 Z  M 40.581 23.066 C 38.811 24.58 36.181 24.546 34.711 22.993 C 33.241 21.44 33.487 18.96 35.257 17.446 C 37.031 15.933 39.654 15.97 41.127 17.52 C 42.594 19.07 42.351 21.553 40.581 23.066 Z " fill="rgb(249, 87, 56)" style="mix-blend-mode:multiply;"/>
            </g>
          </g>
        </svg>
      </v-btn>
    </template>
    <v-alert
      dense
      text
      elevation="2"
      border="left"
      colored-border
      color="#F95738"
      class="ml-4"
    >
      <v-list-item dark class="pa-0 ma-0">
        <v-list-item-content class="pa-0 ma-0">
          <v-list-item-title>City & District</v-list-item-title>
          <v-list-item-title> {{ $store.state.clickedCoordinate }} </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            class="ma-0"
            outlined
            @click="toggleMenu"
          >
            選單
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-alert>
  </v-speed-dial>
</template>

<script>
export default {
  data() {
    return {
        fab: true
    };
  },
  methods: {
    toggleMenu() {
      this.$store.state.showInfo = false
      this.$store.state.showMenu = true
    }
  }
}
</script>

<style>
#home .v-speed-dial {
  position: absolute;
}
#home .v-btn--floating {
  position: relative;
}
</style>
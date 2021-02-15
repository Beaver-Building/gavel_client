<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="route(item.routeName)"
          link
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-action @click="$store.commit('switch2Reviewer')">
            <v-switch v-model="reviewer" label></v-switch>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1"
            >Reviewer View</v-list-item-title
          >
        </v-list-item>
        <v-list-item link>
          <v-list-item-action @click="$store.commit('switch2Admin')">
            <v-switch v-model="admin" label></v-switch>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1"
            >Admin View</v-list-item-title
          >
        </v-list-item>
        <v-subheader class="mt-4 grey--text text--darken-1"
          >SYSTEM ADMIN</v-subheader
        >
        <v-list v-if="admin_list">
          <v-list-item v-for="(item, i) in admin_list" :key="i" link>
            <v-list-item-avatar>
              <img
                :src="`https://randomuser.me/api/portraits/men/33.jpg`"
                alt
              />
            </v-list-item-avatar>
            <v-list-item-title v-text="item.name" />
          </v-list-item>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="blue darken-3" dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-icon class="mx-4">fab fa-youtube</v-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">Gavel2Block</span>
      </v-toolbar-title>

      <v-row>
        <v-spacer></v-spacer>
        <v-icon>mdi-account</v-icon>
        <div
          link
          v-show="$store.state.account.name"
          class="white--text text--darken-1 mr-4 ml-4"
        >
          Welcome, {{ currentUser }}
        </div>
      </v-row>
    </v-app-bar>

    <v-content >
      <v-container class="fill-height">
        <v-row justify="center" class="fill-height" >
          <router-view v-if="isRouterAlive" ></router-view>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data: () => ({
    isRouterAlive: true,
    drawer: null,
    reviewer: false,
    admin: false,
    items: [
      { icon: "home", text: "Homepage", routeName: "Dashboard" },
      // { icon: "email", text: "E-mail", routeName: "Dashboard" },
      // {
      //   icon: "group",
      //   text: "Meeting",
      //   routeName: "Dashboard",
      // },
      {
        icon: "history",
        text: "Previous Comments",
        routeName: "PreviousComments",
      },
    ],
  }),
  created() {
    this.$vuetify.theme.dark = true;
  },
  asyncComputed: {
    admin_list: {
      async get() {
        try {
          const res = await this.$axios.get(`/escBackend/admin/`);
          this.reviewer_cnt = res.data.results.length;
          return res.data.results;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
  },
  methods: {
    route(path) {
      this.$router.push({ name: path });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.account.name;
    },
  },
};
</script>

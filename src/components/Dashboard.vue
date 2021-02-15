<template>
  <v-container>
    <v-tabs v-model="tab" background-color="blue darken-3" dark>
      <v-tab> Engineer Status </v-tab>
      <v-tab> Assign Reviewers </v-tab>
      <v-tab> Reviewer Status </v-tab>
      <v-tab> All Comments </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card outlined color="#121212">
        <v-row justify="center" align="center">
          <v-col 
            cols="4"
            v-for="(n, i) in engineer_list"
            v-show="
              $store.state.account.is_reviewer === true ||
                $store.state.account.user === n.user
            "
            :key="i"
          >
            <Engineer :engineer_info="n" :show_type="'engineer'" />
          </v-col>
        </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item v-show="$store.state.account.is_admin == true">
        <v-card outlined color="#121212">
        <v-row
          justify="center"
          align="center"
          
        >
          <v-col cols="6" v-for="(n, i) in process_list" :key="i">
            <Process :process_object="n" />
          </v-col>
        </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item v-show="$store.state.account.is_admin == true">
        <v-card outlined color="#121212">
        <v-row
          justify="center"
          align="center"
          v-show="$store.state.account.is_admin == true"
        >
          <v-col cols="4" v-for="(n, i) in reviewer_list" :key="i">
            <Engineer :engineer_info="n" :show_type="'reviewer'" />
          </v-col>
        </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item v-show="$store.state.account.is_admin == true">
        <CommentList />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
import Engineer from "@/components/Engineer.vue";
import Process from "@/components/Process.vue";
import CommentList from "@/components/CommentList.vue"

export default {
  props: {},
  components: { Engineer, Process, CommentList },
  data: () => ({
    engineer_cnt: 0,
    process_cnt: 0,
    reviewer_cnt: 0,
    tab: null,
  }),
  asyncComputed: {
    engineer_list: {
      async get() {
        try {
          const res = await this.$axios.get(`/escBackend/engineer/`);
          this.engineer_cnt = res.data.results.length;
          return res.data.results;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
    process_list: {
      async get() {
        try {
          const res = await this.$axios.get(`/escBackend/process/`);
          this.process_cnt = res.data.results.length;
          return res.data.results;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
    reviewer_list: {
      async get() {
        try {
          const res = await this.$axios.get(`/escBackend/reviewer/`);
          this.reviewer_cnt = res.data.results.length;
          return res.data.results;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
  },
  computed: {},
  methods: {},
};
</script>

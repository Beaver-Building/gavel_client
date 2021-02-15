<template>
  <v-container>
    <v-card max-width="344" class="mx-auto" color="grey darken-4">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mt-3">{{
            engineer_info.name
          }}</v-list-item-title>
          <v-list-item-subtitle>{{ engineer_info.alias }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-avatar color="blue darken-3" size="60">
          <span class="white--text mp-2">{{ shortName }}</span>
        </v-list-item-avatar>
      </v-list-item>
      <v-card-text>
        {{ engineer_title }}
      </v-card-text>
      <v-card-text v-show="show_type == 'engineer'">
        Current Process: {{ process_kind }}
        <br />
        Current Stage: {{ stage_kind }}
        <br />
      </v-card-text>

      <v-card-actions v-show="show_type == 'engineer'">
        <v-spacer></v-spacer>
        <v-btn
          v-if="!process_not_started"
          class="ml-2"
          text
          @click="showProcessDetail"
        >
          EDIT
          <v-icon class="ml-2">mdi-lead-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="
            process_kind &&
              process_not_started &&
              (engineer_info.user === $store.state.account.user ||
                $store.state.account.is_admin === true)
          "
          text
          @click="newProcess"
          class="ml-1"
        >
          START
          <v-icon class="ml-2">mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-card-actions>
      <v-stepper v-show="detailShow" v-model="currentStage">
        <!-- <v-stepper-header>
          <v-stepper-step :complete="currentStage > 7" step="1"></v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="currentStage > 8" step="2"></v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="currentStage > 9" step="3"></v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="4"></v-stepper-step>
        </v-stepper-header> -->
        <!-- <v-stepper-items>
          <v-stepper-content step="1">
            <v-card class="mb-4" color="red lighten-2" height="220px">
              <v-carousel height="200" hide-delimiter-background show-arrows-on-hover>
                <v-carousel-item
                  v-for="(comment, i) in comment_list"
                  v-show="comment.Stage == currentStage"
                  :key="i"
                >
                  <v-sheet :color="colors[i]" height="100%">
                    <v-row class="fill-height" align="center" justify="center">
                      <div class="display-1">{{ comment.Context }}</div>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </v-card>
            <v-btn color="primary" @click="processGoOn()">Continue</v-btn>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card class="mb-4" color="red lighten-2" height="220px">
              <v-carousel height="200" hide-delimiter-background show-arrows-on-hover>
                <v-carousel-item
                  v-for="(comment, i) in comment_list"
                  :key="i"
                  v-show="comment.Stage == currentStage"
                >
                  <v-sheet :color="colors[i]" height="100%">
                    <v-row class="fill-height" align="center" justify="center">
                      <div class="display-1">{{ comment.Context }}</div>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </v-card>
            <v-btn color="primary" @click="processGoOn()">Continue</v-btn>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-card class="mb-4" color="grey lighten-1" height="200px"></v-card>

            <v-btn color="primary" @click="processGoOn()">Continue</v-btn>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-card class="mb-4" color="grey lighten-1" height="200px"></v-card>

            <v-btn color="primary" @click="processGoOn()">Continue</v-btn>
          </v-stepper-content>
        </v-stepper-items>-->
      </v-stepper>
    </v-card>
  </v-container>
</template>
<script>
export default {
  props: {
    engineer_info: Object,
    show_type: String,
  },
  components: {},
  data: () => ({
    currentStage: 1,
    maxCurrentStage: 0,
    colors: [
      "indigo",
      "warning",
      "pink darken-2",
      "red lighten-1",
      "deep-purple accent-4",
    ],
    detailShow: true,
  }),
  asyncComputed: {
    engineer_title: {
      async get() {
        const that = this;
        try {
          const res = await this.$axios.get(
            `/escBackend/engineer_kind/${that.engineer_info.title}/`
          );
          return res.data.full_name;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
    process_kind: {
      async get() {
        let process_variable =
          this.engineer_info.title === "SE" ? "SEEP" : "EEP";
        try {
          const res = await this.$axios.get(
            `/escBackend/process_kind/${process_variable}/`
          );
          return res.data.full_name;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
    process_object: {
      async get() {
        try {
          const that = this;
          const res = await this.$axios.get(
            `/escBackend/process/${that.engineer_info.latest_process}`
          );
          return res.data;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
    stage_kind: {
      async get() {
        try {
          const that = this;
          const res = await this.$axios.get(
            `/escBackend/stage_kind/${that.engineer_info.latest_stage}/`
          );
          this.currentStage = this.engineer_info.latest_stage;
          this.maxCurrentStage = this.engineer_info.latest_stage;
          return res.data.full_name;
        } catch (e) {
          window.console.log(e);
        }
      },
      watch: ["engineer_info"],
    },
    comment_list: {
      async get() {
        try {
          let that = this;
          let commentArray = [];
          for (let n = 0; n < this.process_object.comment.length; n++) {
            const res = await this.$axios.get(
              `/escBackend/comment/${that.process_object.comment[n]}`
            );
            commentArray.push(res.data);
          }
          return commentArray;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
  },

  computed: {
    process_not_started: function() {
      return this.engineer_info.latest_process === -1;
    },
    shortName: function() {
      // for avator
      let nameArray = [];
      nameArray.push(this.engineer_info.name.split(" ")[0]);
      nameArray.push(this.engineer_info.name.split(" ")[1].toUpperCase());
      return nameArray[0][0] + nameArray[1][0]; // emmm can be  better
    },
  },
  methods: {
    showProcessDetail() {
      const newPath = `/processDetail/${this.engineer_info.latest_process}`;
      this.$router.push(newPath);
    },
    // processGoOn() {
    //   if (this.maxCurrentStage > this.currentStage) {
    //     this.currentStage += 1;
    //   } else this.currentStage = 1;
    // },
    async newProcess() {
      try {
        const that = this;
        const process_kind = this.engineer_info.title === "SE" ? "SEEP" : "EEP";
        const res = await this.$axios.post(`/escBackend/process/`, {
          kind: process_kind,
          owner: that.engineer_info.alias,
          current_stage: "SPR",
          pass_comment: 0,
          fail_comment: 0,
          stage_start: 1,
          stage0_tried_times: 0,
          stage1_tried_times: 1,
          stage2_tried_times: -1,
          stage3_tried_times: -1,
          stage4_tried_times: -1,
          stage5_tried_times: -1,
        });
        const path = `/escBackend/engineer/${that.engineer_info.alias}/`;
        const process_id = res.data.id;
        const res1 = await this.$axios.put(path, {
          user: that.engineer_info.user,
          alias: that.engineer_info.alias,
          name: that.engineer_info.name,
          is_engineer: true,
          is_reviewer: false,
          is_admin: false,
          title: that.engineer_info.title,
          latest_process: process_id,
          latest_stage: "SPR",
        });
        const newPath = `/processDetail/${res.data.id}`;
        setTimeout(() => {
          this.$router.push(newPath);
        }, 2000);
        return res1.data;
      } catch (e) {
        window.console.log(e);
      }
    },
  },
};
</script>

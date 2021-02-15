<template>
  <v-container>
    <!-- {{process_object}} -->
    <!-- {{stage_list}} -->
    <v-timeline dense >
        
      <v-timeline-item
        v-for="n in items"
        :key="n"
        v-show="n.stage <= cntStage"
        :color="(n.title=='Submit Pre-check Request' || n.title=='Review Complete') ? 'red lighten-1' :'blue-grey lignten-2'"
        large
      >
        <StageDetail :stage_object="n" :cntStage="cntStage" :process_object="process_object" :engineer_object="engineer_object"/>
      </v-timeline-item>
      

    </v-timeline>
    <v-btn
            dark
            absolute
            bottom
            right
            small
            color="blue lighten-3"
            @click="reload()"
            >
            <v-icon>mdi-reload</v-icon>
        </v-btn>
  </v-container>
</template>

<script>
import StageDetail from "@/components/StageDetail";
export default {
  props: {},
  components: { StageDetail },
  inject:['reload'],
  data: () => ({
    cntStage: 0,
    items: [],
    currentStage: 0,
  }),
  asyncComputed: {
    stage_list: {
      async get() {
        try {
          const res = await this.$axios.get(`/escBackend/stage_kind/`);
          return res.data.results;
        } catch (e) {
          window.console.log(e);
        }
      }
    },
    process_object: {
      async get() {
        try {
          const that = this;
          const res = await this.$axios.get(
            `/escBackend/process/${that.process_id}`
          );
          // let Stage0TryTimes = res.data.stage0_tried_times
          let Stage1TryTimes = res.data.stage1_tried_times;
          let Stage2TryTimes = res.data.stage2_tried_times;
          let Stage3TryTimes = res.data.stage3_tried_times;
          let Stage4TryTimes = res.data.stage4_tried_times;
          let Stage5TryTimes = res.data.stage5_tried_times;

          while (Stage1TryTimes && Stage1TryTimes > 0) {
            this.cntStage++;
            this.items.push({
              stage: this.cntStage,
              title: this.stage_list[1].full_name,
              id: this.stage_list[1].abbreviation
            });
            Stage1TryTimes--;
          }
          while (Stage2TryTimes && Stage2TryTimes > 0) {
            this.cntStage++;
            this.items.push({
              stage: this.cntStage,
              title: this.stage_list[2].full_name,
              id: this.stage_list[2].abbreviation
            });
            Stage2TryTimes--;
          }
          while (Stage3TryTimes && Stage3TryTimes > 0) {
            this.cntStage++;
            this.items.push({
              stage: this.cntStage,
              title: this.stage_list[3].full_name,
              id: this.stage_list[3].abbreviation
            });
            Stage3TryTimes--;
          }
          while (Stage4TryTimes && Stage4TryTimes > 0) {
            this.cntStage++;
            this.items.push({
              stage: this.cntStage,
              title: this.stage_list[4].full_name,
              id: this.stage_list[4].abbreviation
            });
            Stage4TryTimes--;
          }
          while (Stage5TryTimes && Stage5TryTimes > 0) {
            this.cntStage++;
            this.items.push({
              stage: this.cntStage,
              title: this.stage_list[5].full_name,
              id: this.stage_list[5].abbreviation
            });
            Stage5TryTimes--;
          }
          window.console.log(Stage5TryTimes);
          return res.data;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
    engineer_object: {
      async get() {
        try {
          const that = this;
          const res = await this.$axios.get(
            `/escBackend/engineer/${that.process_object.owner}`
          );
          return res.data;
        } catch (e) {
          window.console.log(e);
        }
      }
    }
  },
  computed: {
    process_id: function() {
      let current_id = this.$router.currentRoute.path.split("/")[2];
      return current_id;
    }
  },
  methods: {
  },
};
</script>

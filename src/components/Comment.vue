<template>
  <v-container>
    <v-card class="mx-2" color="blue lighten-3" max-width="400" light>
      <v-card-title>
        <span class="title font-weight-light">Comment</span>
        <Chip
          v-show="
            comment_object.grade == 1 &&
              comment_object.submited &&
              ($store.state.account.alias === comment_object.writer ||
                currentStage < cntStage)
          "
          :color="'green lighten-1'"
          :status="'Pass'"
          :logo_name="'mdi-checkbox-marked-circle'"
        />
        <Chip
          v-show="
            comment_object.grade == 0 &&
              comment_object.submited &&
              ($store.state.account.alias === comment_object.writer ||
                currentStage < cntStage)
          "
          :color="'orange lighten-1'"
          :status="'Fail'"
          :logo_name="'mdi-close-circle'"
        />
      </v-card-title>
      <v-card-text class="headline font-weight-bold">
        <v-col cols="12" md="10">
          <v-textarea
            v-show="
              $store.state.account.is_reviewer === true &&
                $store.state.account.alias === comment_object.writer &&
                !comment_object.submited
            "
            outlined
            name="input-7-4"
            label="Text Area"
            v-model="comment_object.context"
          ></v-textarea>
          <v-textarea
            v-show="
              comment_object.submited &&
                ($store.state.account.alias === comment_object.writer ||
                  currentStage < cntStage ||
                  $store.state.account.is_admin)
            "
            disabled
            outlined
            name="input-7-4"
            label="Text Area"
            v-model="comment_object.context"
          ></v-textarea>
        </v-col>
        <v-row
          class="mb-11"
          v-show="
            $store.state.account.is_reviewer === true &&
              $store.state.account.alias === comment_object.writer &&
              !comment_object.submited
          "
          align="center"
          justify="begin"
        >
          <v-btn class="ml-10" color="green lighten-2" @click="grade = 1" >PASS</v-btn>
          <v-btn class="ml-4" color="red lighten-2" @click="grade = 0" >FAIL</v-btn>
        </v-row>
        <v-row
          v-show="
            $store.state.account.is_reviewer === true &&
              $store.state.account.alias === comment_object.writer &&
              !comment_object.submited
          "
          align="center"
          justify="end"
        >
          <v-btn class="ma-auto" color="blue" @click="updateComment" dark>save</v-btn>
          <v-btn class="ma-auto" color="blue" @click="submitComment" dark>submit</v-btn>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-list-item class="grow">
          <v-list-item-avatar color="grey darken-3">
            <v-img
              class="elevation-6"
              src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Anonymous</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import Chip from "@/components/Chip";
export default {
  props: {
    currentStage: Number,
    cntStage: Number,
    comment_object: Object,
    process_object: Object,
    engineer_object: Object
  },
  components: { Chip },
  data: () => ({
    grade: -1
  }),
  asyncComputed: {},
  computed: {},
  methods: {
    async updateComment() {
      try {
        const that = this;
        const res = await this.$axios.put(
          "/escBackend/comment/" + this.comment_object.id + "/",
          {
            stage: that.comment_object.stage,
            writer: that.comment_object.writer,
            context: that.comment_object.context,
            grade: that.grade,
            edited: true,
            submited: false,
            engineer_name: that.comment_object.engineer_name
          }
        );
        return res.data;
      } catch (e) {
        window.console.log(e);
      }
    },
    async submitComment() {
      try {
        const that = this;
        const res = await this.$axios.put(
          "/escBackend/comment/" + this.comment_object.id + "/",
          {
            stage: that.comment_object.stage,
            writer: that.comment_object.writer,
            context: that.comment_object.context,
            grade: that.grade,
            edited: true,
            submited: true,
            engineer_name: that.comment_object.engineer_name
          }
        );
        if (this.grade == 1) {
          this.process_object.pass_comment += 1;
        } else {
          this.process_object.fail_comment += 1;
        }
        if (
          this.process_object.pass_comment + this.process_object.fail_comment >=
          this.process_object.reviewer.length
        ) {
          if (
            this.process_object.pass_comment >
            this.process_object.reviewer.length * 0.6
          ) {
            this.enterNewStage("pass");
          } else {
            this.enterNewStage("fail");
          }
        } else {
          // update comment to process object
          const res1 = await this.$axios.put(
            "/escBackend/process/" + that.process_object.id + "/",
            {
              kind: that.process_object.kind,
              owner: that.process_object.owner,
              reviewer: that.process_object.reviewer,
              comment: that.process_object.comment,
              current_stage: that.process_object.current_stage,
              pass_comment: that.process_object.pass_comment,
              fail_comment: that.process_object.fail_comment,
              stage_start: that.process_object.stage_start,
              stage0_tried_times: 0,
              stage1_tried_times: that.process_object.stage1_tried_times,
              stage2_tried_times: that.process_object.stage2_tried_times,
              stage3_tried_times: that.process_object.stage3_tried_times,
              stage4_tried_times: that.process_object.stage4_tried_times,
              stage5_tried_times: that.process_object.stage5_tried_times
            }
          );
          return res1.data;
        }
        //location.reload();
        return res.data;
      } catch (e) {
        window.console.log(e);
      }
    },
    async enterNewStage(status) {
      try {
        this.cntStage++;
        if (status == "pass") {
          this.process_object.current_stage =
            this.process_object.current_stage == "PC" ? "SRR" : "RC";
          if (this.process_object.stage2_tried_times === -1)
            this.process_object.stage2_tried_times = 1;
          else if (this.process_object.stage3_tried_times === -1)
            this.process_object.stage3_tried_times = 1;
          else if (this.process_object.stage4_tried_times === -1)
            this.process_object.stage4_tried_times = 1;
          else {
            this.process_object.stage5_tried_times = 1;
          }
        } else if (status == "fail") {
          if (this.process_object.stage2_tried_times === -1)
            this.process_object.stage1_tried_times += 1;
          else if (this.process_object.stage3_tried_times === -1)
            this.process_object.stage2_tried_times += 1;
          else if (this.process_object.stage4_tried_times === -1)
            this.process_object.stage3_tried_times += 1;
          else this.process_object.stage4_tried_times += 1;
        }
        const that = this;
        const res = await this.$axios.put(
          "/escBackend/process/" + that.process_object.id + "/",
          {
            kind: that.process_object.kind,
            owner: that.process_object.owner,
            reviewer: that.process_object.reviewer,
            comment: that.process_object.comment,
            current_stage: that.process_object.current_stage,
            pass_comment: 0,
            fail_comment: 0,
            stage_start: status == 'pass' ? 1 : 0,
            stage0_tried_times: 0,
            stage1_tried_times: that.process_object.stage1_tried_times,
            stage2_tried_times: that.process_object.stage2_tried_times,
            stage3_tried_times: that.process_object.stage3_tried_times,
            stage4_tried_times: that.process_object.stage4_tried_times,
            stage5_tried_times: that.process_object.stage5_tried_times
          }
        );
        const res1 = await this.$axios.put(
          `/escBackend/engineer/${that.engineer_object.alias}/`,
          {
            user: that.engineer_object.user,
            alias: that.engineer_object.alias,
            name: that.engineer_object.name,
            is_engineer: that.engineer_object.is_engineer,
            is_reviewer: that.engineer_object.is_reviewer,
            is_admin: that.engineer_object.is_admin,
            title: that.engineer_object.title,
            latest_process: that.engineer_object.latest_process,
            latest_stage: that.process_object.current_stage,
          }
        );
        window.console.log(res.data);
        window.console.log(res1.data);
        // location.reload();
        return res.data;
      } catch (e) {
        window.console.log(e);
      }
    }
  }
};
</script>

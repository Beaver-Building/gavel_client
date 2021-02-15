<template>
  <v-card class="elevation-2">
    <v-card-title class="headline">
      {{ stage_object.title }}
      <Chip
        v-show="stage_object.stage != cntStage"
        :color="'teal'"
        :status="'Finished'"
        :logo_name="'mdi-checkbox-marked-outline'"
      />
      <Chip
        v-show="
          stage_object.stage != cntStage &&
            stage_pass &&
            !(stage_object.id == 'SPR' || stage_object.id == 'SRR')
        "
        :color="'green lighten-1'"
        :status="'Pass'"
        :logo_name="'mdi-checkbox-marked-circle'"
      />
      <Chip
        v-show="
          stage_object.stage != cntStage &&
            !stage_pass &&
            !(stage_object.id == 'SPR' || stage_object.id == 'SRR')
        "
        :color="'orange lighten-1'"
        :status="'Fail'"
        :logo_name="'mdi-close-circle'"
      />
      <Chip
        v-show="stage_object.stage == cntStage && stage_object.title != 'Review Complete'&&
        process_object.stage_start == 1"
        :color="'light-blue'"
        :status="'On-going'"
        :logo_name="'mdi-checkbox-marked-circle'"
      />
      <Chip
        v-show="stage_object.stage == cntStage && stage_object.title != 'Review Complete' &&
        process_object.stage_start == 0"
        :color="'cyan lighten-2'"
        :status="'Preparing'"
        :logo_name="'mdi-border-all'"
      />
      
      <v-spacer></v-spacer>
      <v-btn v-show="stage_object.stage == cntStage && stage_object.title != 'Review Complete' &&
        process_object.stage_start == 0 && process_object.owner == $store.state.account.alias" @click="updateStageStart"
        color="primary">Ready</v-btn>
      <v-btn v-show="stage_object.stage != cntStage" icon>
        <v-icon @click="showContent = !showContent">mdi-chevron-down</v-icon>
      </v-btn>
    </v-card-title>

    <!-- Engineer & Reviewer row -->
    <v-row v-show="showContent || stage_object.stage == cntStage">
      <v-card v-show="stage_object.id == 'SRR'" class="mx-10" tile>
        <v-app-bar color="grey darken-1">
          <v-toolbar-title>Engineer Material</v-toolbar-title>
        </v-app-bar>

        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-card outlined color="#424242" dark>
                <v-card-title class="headline">Upload Material</v-card-title>

                <v-card-subtitle>
                  Please list your material here for the reviewers and admins
                  to check-out.
                </v-card-subtitle>
                <v-file-input class="mx-5" multiple chips v-model="files" label="File input"></v-file-input>
                <v-card-actions>
                  <v-btn @click="enterNewStage('file')" text>Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-col>
        <!-- Reviewer row -->
        <v-row>
          <v-col
            v-for="m in comment_list"
            v-show="
              m.stage === stage_object.id &&
                (stage_object.id == 'PC' || stage_object.id == 'RM') &&
                m.cntStage === stage_object.stage &&
                (stage_object.stage < cntStage ||
                  m.writer == $store.state.account.alias)
            "
            :key="m"
          >
            <Comment
              :currentStage="stage_object.stage"
              :cntStage="cntStage"
              :comment_object="m"
              :process_object="process_object"
              :engineer_object="engineer_object"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- Reviewer & Admin row -->
    <v-row align="center" justify="start" class="ml-5">
      <v-btn
        v-show="
          (showContent || stage_object.stage == cntStage) &&
            (stage_object.id == 'PC' || stage_object.id == 'RM') &&
            !madeComment &&
            $store.state.account.is_reviewer &&
            process_object.stage_start == 1
        "
        class="ml-10 mt-5"
        color="#E57373"
        @click="newComment(stage_object.stage)"
      >New comment</v-btn>
      <v-btn
        v-show="stage_object.stage == cntStage && stage_object.id == 'SPR'&&
            $store.state.account.alias == process_object.owner"
        @click="enterNewStage('submit')"
      >Submit</v-btn>
    </v-row>
    <v-card-text></v-card-text>
  </v-card>
</template>
<script>
import Comment from "@/components/Comment";
import Chip from "@/components/Chip";
export default {
  props: {
    stage_object: Object,
    process_object: Object,
    cntStage: Number,
    engineer_object: Object
  },
  components: { Comment, Chip },
  data: () => ({
    madeComment: false,
    showContent: false,
    stage_pass: true,
    reload: false,
    files: []
  }),
  asyncComputed: {
    comment_list: {
      async get() {
        try {
          const that = this;
          let flag = 0;
          let cnt = 0;
          let commentArray = [];
          for (let n = 0; n < this.process_object.comment.length; n++) {
            const res = await this.$axios.get(
              `/escBackend/comment/${that.process_object.comment[n]}`
            );
            if (
              res.data.writer == that.$store.state.account.alias &&
              res.data.cntStage == this.stage_object.stage
            ) {
              this.madeComment = true;
            }
            if (res.data.cntStage == this.stage_object.stage) {
              cnt += 1;
              if (res.data.grade == 0) flag += 1;
            }
            commentArray.push(res.data);
          }
          if (flag >= cnt * 0.6) {
            this.stage_pass = false;
          }
          this.reload = false;
          return commentArray;
        } catch (e) {
          window.console.log(e);
        }
      },
      watch: ["reload"]
    }
  },
  computed: {},
  methods: {
    async newComment() {
      try {
        const that = this;

        const res = await this.$axios.post("/escBackend/comment/", {
          stage: that.process_object.current_stage,
          writer: that.$store.state.account.alias,
          context: "template context",
          cntStage: that.cntStage,
          grade: -1,
          edited: false,
          submited: false,
          engineer_name: that.process_object.owner
        });
        // window.console.log(res.data)
        const res1 = await this.$axios.post("/escBackend/process_comment/", {
          process: that.process_object.id,
          comment: res.data.id
        });
        return res1.data;
      } catch (e) {
        window.console.log(e);
      }
    },
    async enterNewStage(status) {
      try {
        this.cntStage++;
        if (status == "pass" || status == "submit" || status == "file") {
          if (this.process_object.stage2_tried_times === -1)
            this.process_object.stage2_tried_times = 1;
          else if (this.process_object.stage3_tried_times === -1)
            this.process_object.stage3_tried_times = 1;
          else if (this.process_object.stage4_tried_times === -1)
            this.process_object.stage4_tried_times = 1;
          else {
            this.process_object.stage5_tried_times = 1;
          }
        }

        const that = this;
        if (status == "file") {
          // add file
          let file = this.files[0];
          let param = new FormData(); 
          param.append('file',file);
          // console.log(param.get('file'));
          let config = {
            headers:{'Content-Type':'multipart/form-data'}
          }; //添加请求头
          // add connection to process
          this.$axios.post(`/escBackend/file/`, param ,config)
            .then(response=>{
              console.log(response.data);
              that.$axios.post(`/escBackend/process_file/`, {
                process: that.process_object.id,
                material: response.data.id
              })
            })
        }
        const res = await this.$axios.put(
          `/escBackend/process/${that.process_object.id}/`,
          {
            kind: that.process_object.kind,
            owner: that.process_object.owner,
            reviewer: that.process_object.reviewer,
            comment: that.process_object.comment,
            current_stage:
              that.process_object.current_stage == "SPR" ? "PC" : "RM",
            pass_comment: 0,
            fail_comment: 0,
            stage_start: 1,
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
            latest_stage: that.process_object.current_stage == "SPR" ? "PC" : "RM",
          }
        );
        window.console.log(res1.data);
        location.reload();
        return res.data;
      } catch (e) {
        window.console.log(e);
      }
    },
    async updateStageStart() {
      const that = this;
      const res = await this.$axios.put(
          `/escBackend/process/${that.process_object.id}/`,
          {
            kind: that.process_object.kind,
            owner: that.process_object.owner,
            reviewer: that.process_object.reviewer,
            comment: that.process_object.comment,
            current_stage:that.process_object.current_stage,
            pass_comment: 0,
            fail_comment: 0,
            stage_start: 1,
            stage0_tried_times: 0,
            stage1_tried_times: that.process_object.stage1_tried_times,
            stage2_tried_times: that.process_object.stage2_tried_times,
            stage3_tried_times: that.process_object.stage3_tried_times,
            stage4_tried_times: that.process_object.stage4_tried_times,
            stage5_tried_times: that.process_object.stage5_tried_times
          }
        );
        window.console.log(res.data);
    }
  }
};
</script>

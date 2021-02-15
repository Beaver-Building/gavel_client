<template>
  <v-card color="grey darken-4">
    <v-app-bar dark color="blue">
      <v-toolbar-title
        >{{ process_owner.name }} - {{ process_title }}</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account-edit-outline</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline blue lighten-2" primary-title
            >Assign Reviewer</v-card-title
          >
          <v-card class="my-5 mx-auto" max-width="400">
            <v-list :flat="flat" :dense="dense" color="blue darken-2">
              <v-list-item-group v-model="model" :mandatory="mandatory">
                <v-list-item v-for="(reviewer, i) in reviewer_list" :key="i">
                  <v-list-item-icon>
                    <v-icon color="black" large>mdi-github</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="reviewer.name"
                    ></v-list-item-title>
                    ({{ reviewer.alias }})
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="setReviewer">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-container>
      <v-treeview
        v-model="tree"
        :open="open"
        :items="items"
        activatable
        item-key="name"
        open-on-click
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.node">
            {{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
          <v-icon v-else>
            {{ files[item.node] }}
          </v-icon>
        </template>
      </v-treeview>
    </v-container>
  </v-card>
</template>
<script>
export default {
  props: {
    process_object: Object,
  },
  components: {},
  data: () => ({
    stage_cnt: 0,
    dialog: false,
    model: 0,
    multiple: false,
    mandatory: false,
    flat: false,
    dense: false,
    count: 4,
    open: ["public"],
    files: {
      html: "mdi-language-html5",
      js: "mdi-nodejs",
      json: "mdi-json",
      md: "mdi-markdown",
      pdf: "mdi-file-pdf",
      png: "mdi-file-image",
      txt: "mdi-file-document-outline",
      xls: "mdi-file-excel",
      test: "mdi-one-up",
    },
    tree: [],
  }),
  asyncComputed: {
    stage_list: {
      async get() {
        try {
          const res = await this.$axios.get(`/escBackend/stage_kind/`);
          this.stage_cnt = res.data.results.length;
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
          return res.data.results;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
    process_owner: {
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
      },
    },
  },
  computed: {
    items: function() {
      let that = this;
      let itemsArr = [];
      let cnt = 0;
      for (const item of this.stage_list) {
        if (item.full_name == "Not Started") {
          cnt++;
          continue;
        }
        let children = [];
        itemsArr.push({ name: item.full_name, children: children });
        for (let i = 0; i < that.process_tryTimes[cnt]; i++) {
          children.push({ name: `${i + 1} try`, node: "test" });
        }
        cnt++;
      }
      return itemsArr;
    },
    process_title: function() {
      // hacky
      return this.process_object.kind == "SEEP" ? "SEE Process" : "EE Process";
    },
    process_tryTimes: function() {
      let tryTimesArray = [];
      tryTimesArray.push(this.process_object.stage0_tried_times);
      tryTimesArray.push(this.process_object.stage1_tried_times);
      tryTimesArray.push(this.process_object.stage2_tried_times);
      tryTimesArray.push(this.process_object.stage3_tried_times);
      tryTimesArray.push(this.process_object.stage4_tried_times);
      tryTimesArray.push(this.process_object.stage5_tried_times);
      return tryTimesArray;
    },
  },
  methods: {
    async setReviewer() {
      try {
        const that = this;
        const res = await this.$axios.post("/escBackend/process_review/", {
          process: that.process_object.id,
          reviewer: that.reviewer_list[that.model].alias,
        });
        // location.reload();
        this.dialog = false;
        return res.data;
      } catch (e) {
        window.console.log(e);
      }
    },
  },
};
</script>

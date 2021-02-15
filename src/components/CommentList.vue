<template>
  <v-card outlined color="#121212">
    <v-row class="mt-10 ml-4" v-show="$store.state.account.is_admin">
      <v-combobox
        v-model="select"
        :items="items"
        label="Use Key Words to Select Comment"
        multiple
        chips
      ></v-combobox>
      <!-- <v-spacer /> -->
      <v-btn class="mt-6">
        <v-icon @click="setFilter">search</v-icon>
      </v-btn>
    </v-row>
    <v-row
      justify="center"
      align="center"
    >
      <v-col cols="4" v-for="(n, i) in comment_list" :key="i">
        <v-card v-if="selectAll">
          <Comment v-if="n.id != 2" :comment_object="n" />
        </v-card>
        <v-card v-if="selectFrom">
          <Comment
            v-if="n.id != 2 && n.writer == select[1]"
            :comment_object="n"
          />
        </v-card>
        <v-card v-if="selectFor">
          <Comment
            v-if="n.id != 2&& n.engineer_name == select[1]"
            :comment_object="n"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import Comment from "@/components/Comment.vue";
export default {
  props: {},
  components: { Comment },
  data: () => ({
    comment_cnt: 0,
    selectFrom: false,
    selectFor: false,
    selectAll: true,
    latest_process: -1,
    comments: [],
    select: ["From"],
    items: ["From", "For"],
  }),
  asyncComputed: {
    comment_list: {
      async get() {
        try {
          const res = await this.$axios.get(`/escBackend/comment/`);
          this.comment_cnt = res.data.results.length;
          return res.data.results;
        } catch (e) {
          window.console.log(e);
        }
      },
    },
  },
  methods: {
    setFilter() {
      if (this.select[0] == "From") {
        this.selectFrom = true;
        this.selectFor = false;
        this.selectAll = false;
      } else if (this.select[0] == "For") {
        this.selectFrom = false;
        this.selectFor = true;
        this.selectAll = false;
      } else {
        this.selectFrom = false;
        this.selectFor = false;
        this.selectAll = true;
      }
    },
  },
};
</script>

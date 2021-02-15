<template>
    <v-container>
        <v-subheader class="headline">Comment List</v-subheader>
        <v-divider></v-divider>
        <v-row
          justify="center"
          align="center"
          v-show="$store.state.account.is_reviewer == true"
        >
        
        <v-col cols='4' v-show="$store.state.account.alias === n.writer" v-for="(n, i) in comment_list" 
          :key="i"
          >
          <Comment :comment_object="n" />
        </v-col>
        </v-row>
    </v-container>
</template>
<script>
import Comment from '@/components/Comment.vue';
export default {
    props: {

    },
    components: {Comment},
    data: () => ({
        
    }),
    asyncComputed: {
        comment_list: {
            async get() {
                try {
                    const res = await this.$axios.get(`/escBackend/comment/`)
                    return res.data.results
                }catch(e) {
                    window.console.log(e)
                }
            }
        },
    },
    computed: {
  
    },
    methods: {
    }

}
</script>
<template>
    <v-container>
        {{ dada }}
    </v-container>
</template>
<script>
export default {
    props: {

    },
    components: {},
    data: () => ({
        engineer_id: '1',
    }),
    asyncComputed: {
        dada: {
            async get() {
                try {
                    const res = await this.$axios.get(`/escBackend/engineer/${this.engineer_id}/`)
                    return res.data
                }catch(e) {
                    window.console.log(e)
                }
            }
        }
    },
    computed: {

    },
    methods: {

    }

}
</script>

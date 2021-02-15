<template>
        <v-chip
            v-show="true"
            class="ma-2"
            :color="color"
            text-color="white"
            >
            <v-avatar left>
                <v-icon>{{logo_name}}</v-icon>
            </v-avatar>
            {{status}}
        </v-chip>
</template>
<script>
export default {
    props: {
        color: String,
        status: String,
        logo_name: String,
    },
    components: {},
    data: () => ({

    }),
    computed: {

    },
    methods: {
        
    }

}
</script>
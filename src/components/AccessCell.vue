<template>
    <v-carousel>
        <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        reverse-transition="fade-transition"
        transition="fade-transition"
        ><v-subheader class="my-10 pt-12 display-3">Welcome to Gavel2Block</v-subheader><br/>
        <v-col class="text-center" cols="12" sm="12">
            <div class="my-12">
                <h2 v-if="noInform">Sorry we can not find your information in the system. Please turn to your TM/TA for permission.</h2>       
                <!-- {{accessmsg}}<br/> -->
                <v-btn v-show="aad_access" @click='loginOrRegister' large > Login </v-btn>
            </div>
        </v-col>
        </v-carousel-item>
    </v-carousel>
</template>

<script>
var Msal = require('msal');
export default {
    name: 'AccessCell',
    data() {
        return {
            /* AAD API params */
            msalConfig: {
                auth: {
                    clientId: "c6c7e163-aa0b-4185-b95d-0073ee49fa22", //This is your client ID
                    authority:
                    "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47" //This is your tenant info
                },
                cache: {
                    cacheLocation: "localStorage",
                    storeAuthStateInCookie: true
                }
            },
            graphConfig: {
                graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
            },
            requestObj: {
                    scopes: ["user.read"]
            },

            /* AAD result */
            noInform: false,
            accessmsg: Object,
            aad_access: false,
            items: [
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
                },
            ],
        }
    },
    mounted() {
        this.acquireTokenPopupAndCallMSGraph();
    },
    computed: {

    },
    methods: {
        /* AAD related */
        acquireTokenPopupAndCallMSGraph() {
            var that = this
            var myMSALObj = new Msal.UserAgentApplication(this.msalConfig);
            myMSALObj.loginPopup(that.requestObj).then(function () {
                //Login Success
                myMSALObj.acquireTokenSilent(that.requestObj)
                .then(function (tokenResponse) {
                    that.callMSGraph(that.graphConfig.graphMeEndpoint, tokenResponse.accessToken, that.graphAPICallback);
                })
                .catch(function (error) {
                    // window.console.log(error.errorCode);
                    if (that.requiresInteraction(error.errorCode)) {
                        myMSALObj.acquireTokenPopup(that.requestObj).then(function (tokenResponse) {
                            that.callMSGraph(that.graphConfig.graphMeEndpoint, tokenResponse.accessToken, that.graphAPICallback);
                        }).catch(function (error) {
                            that.noInform =true
                            window.console.log(error);
                        });
                    }
                });
            }).catch(function (error) {
                window.console.log(error);
            });
        },

        // a savage for request AAD resource
        callMSGraph(theUrl, accessToken, callback) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200)
                callback(JSON.parse(this.responseText));
            };
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.setRequestHeader("Authorization", "Bearer " + accessToken);
            xmlHttp.send();
        },

        // process AAD result
        graphAPICallback(data) {
            this.aad_access = true
            window.console.log("graphAPICallback");
            let result = JSON.stringify(data, null, 4);
            let jsonresult = JSON.parse(result);
            this.accessmsg = jsonresult
        },

        requiresInteraction(errorCode) {
            if (!errorCode || !errorCode.length) {
                return false;
            }
            return errorCode === "consent_required" ||
                errorCode === "interaction_required" ||
                errorCode === "login_required";
        },
        /* AAD related end */
        
        async loginOrRegister() {
            try {
                    const that = this
                    const res = await this.$axios.post(
                        '/escBackend/user/',
                        {
                            username: that.accessmsg.userPrincipalName.split('@')[0],
                            email: that.accessmsg.userPrincipalName,
                            password: that.accessmsg.givenName
                        }
                    );
                    window.console.log(res.data)
                    const res1 = await this.$axios.post(
                        '/escBackend/engineer/',
                        {
                            user: res.data.pk,
                            alias: that.accessmsg.userPrincipalName.split('@')[0],
                            name: that.accessmsg.displayName,
                            is_engineer: true,
                            is_reviewer: false,
                            is_admin: false,
                            title: 'SE', // regex
                            latest_process: -1,
                            latest_stage: 'NS'
                        }).then((res)=>{
                            this.$store.commit('setAccount', res.data)
                            this.$router.push({name: 'Dashboard'})
                        })
                    return res1.data
            }catch(e) {
                const alias = this.accessmsg.userPrincipalName.split('@')[0]
                await this.$axios.get(
                        `/escBackend/engineer/${alias}`,
                    ).then((res)=>{
                            this.$store.commit('setAccount', res.data)
                            this.$router.push({name: 'Dashboard'})
                        })
            }
        }
    }
}
</script>

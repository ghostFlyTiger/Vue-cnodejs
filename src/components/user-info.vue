<template>
    <div class="user-info">
        <!-- 未登录 -->
        <ul class="login-no" v-if="!userInfo.userName">
            <li class="login" @click="goEnter"><a >登录</a></li>
        </ul>
        <!-- 已登录 -->
        <div class="login-yes user-link" v-if="userInfo.userName" @click="goUser">
            <div class="avertar"><img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl"></div>
            <div class="info">
                <p v-if="userInfo.userName" v-text="userInfo.userName"></p>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex';

    export default {
        replace: true,
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo'
            })
        },
        methods: {
            goEnter() {
                this.$router.push({
                    name: 'login',
                    query: {
                        redirect: encodeURIComponent(this.$route.path)
                    }
                });
            },
            goUser() {
                this.$router.push({
                    name: 'userList',
                    params: this.userInfo
                });
            }
        }
    };
</script>

<style lang="scss">

</style>

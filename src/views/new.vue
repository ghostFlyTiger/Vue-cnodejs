<template>
    <div>
        <nv-head page-type="主题发布"
            :show-menu="false"
            :fix-head="true"></nv-head>
        <div class="add-container">
            <div class="line">选择分类：
                <select class="add-tab" v-model="topic.tab">
                    <option v-for="tabi in chooseTabs" :value="tabi[0]" v-text="tabi[1].text"></option>
                </select>
                <a class="add-btn" @click="addTopic">发布</a>
            </div>
            <div class="line">
                <input class="add-title" v-model="topic.title"
                        type="text" :class="{'err':err==='title'}"
                        placeholder="标题，字数5字以上,最多100字" max-length="100"/>
            </div>
            <h5editor style="height:580px;" :class="{'err':err==='content'}" placeholder="请输入内容" :value="mdValue"></h5editor>
        </div>
    </div>
</template>

<script>
    import $ from 'webpack-zepto';
    import nvHead from '../components/header.vue';

    import h5editor from '../components/h5editor.vue';

    import {
        mapGetters
    } from 'vuex';

    export default {
        data() {
            return {
                topic: {
                    tab: 'share',
                    title: '',
                    content: ''
                },
                err: '',
                mdValue: {}
            };
        },
        mounted() {
        },
        // a
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo'
            }),
            chooseTabs() {
                return Object.entries(this.TABS_HANDLER.getTabs().v).filter(t => t[1].c);
            }
        },
        methods: {
            addTopic() {
                let title = $.trim(this.topic.title);
                if (!title || title.length < 5) {
                    this.err = 'title';
                    return false;
                }

                let contents = $.trim(this.mdValue.value);

                if (!contents) {
                    this.err = 'content';
                    return false;
                }
                this.topic.content = contents;

                let postData = {
                    ...this.topic,
                    topicAuthor: this.userInfo,
                    content: this.topic.content
                };

                $.ajax({
                    type: 'POST',
                    contentType: 'application/json;charset=UTF-8',
                    url: this.$store.state.urls.parent + 'topic/add',
                    data: JSON.stringify(postData),
                    dataType: 'json',
                    success: (res) => {
                        if (res.success) {
                            this.$router.push({
                                name: 'list'
                            });
                        }
                    },
                    error: (res) => {
                        let error = JSON.parse(res.responseText);
                        this.$alert(error.errorMsg);
                        return false;
                    }
                });
            }
        },
        components: {
            nvHead,
            h5editor
        }
    };
</script>

<style lang="scss">
    .add-container {
        box-sizing: border-box;
        margin-top: 50px;
        background-color: #fff;
        .line {
            padding: 10px 15px;
            border-bottom: solid 1px #d4d4d4;
            .add-btn {
                color: #fff;
                background-color: #80bd01;
                padding: 5px 15px;
                border-radius: 5px;
                cursor: pointer;
            }
            .add-tab {
                display: inline-block;
                width: calc(100% - 140px);
                min-width: 50%;
                height:25px;
                border:none;
                border:1px solid #73eeb3;
                border-radius: 3px;
                font-size: 16px;
                background: transparent;
                 :after {
                    content: 'xe60e';
                }
            }
            .add-title {
                font-size: 16px;
                border: none;
                width: 100%;
                background: transparent;
                height: 25px;
            }
            .err {
                border: solid 1px red;
            }
        }
        .add-content {
            margin: 15px 2%;
            width: 96%;
            border-color: #d4d4d4;
            color: #000;
        }
        .err {
            border: solid 1px red;
        }
    }
</style>

<template>

    <section class="reply">
        <h5editor :class="{'err':hasErr}" placeholder="请输入回复内容" :value="replyValue"></h5editor>
        <a class="button" @click="addReply">确定</a>
    </section>

</template>
<script>
    import $ from 'webpack-zepto';
    const utils = require('../libs/utils');
    const markdown = require('markdown').markdown;
    import {
        mapGetters
    } from 'vuex';

    import h5editor from '../components/h5editor.vue';

    export default {
        components: { h5editor },
        replace: true,
        props: ['topic', 'replyId', 'topicId', 'replyTo', 'show'],
        data() {
            return {
                hasErr: false,
                authorTxt: ' # *I‘m Chivenh*',
                replyValue: {}
            };
        },
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo'
            })
        },
        mounted() {
            if (this.replyTo) {
                this.content = `@${this.replyTo} `;
            }
        },
        methods: {
            addReply() {
                let content = this.replyValue.value;
                if (!content) {
                    this.hasErr = true;
                } else {
                    this.content = content;
                    let time = new Date();
                    let linkUsers = utils.linkUsers(this.content);
                    let htmlText = markdown.toHTML(linkUsers) + this.author_txt;
                    let replyContent = $('<div class="markdown-text"></div>').append(htmlText)[0].outerHTML;
                    let postData = {
                        accesstoken: this.userInfo.token,
                        content: this.content + this.author_txt
                    };

                    if (this.replyId) {
                        postData.reply_id = this.replyId;
                    }
                    $.ajax({
                        type: 'POST',
                        url: `https://cnodejs.org/api/v1/topic/${this.topicId}/replies`,
                        data: postData,
                        dataType: 'json',
                        success: (res) => {
                            if (res.success) {
                                this.topic.replies.push({
                                    id: res.reply_id,
                                    author: {
                                        userName: this.userInfo.userName,
                                        avatarUrl: this.userInfo.avatarUrl
                                    },
                                    content: replyContent,
                                    ups: [],
                                    createAt: time
                                });
                            }
                            this.content = '';
                            if (this.show) {
                                this.$emit('close');
                            }
                        },
                        error: (res) => {
                            var error = JSON.parse(res.responseText);
                            this.$alert(error.error_msg);
                            return false;
                        }
                    });
                }
            }
        }
    };
</script>

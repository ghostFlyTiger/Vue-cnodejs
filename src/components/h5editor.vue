<!-- mavon-editor 的重新定义,自定义行为控制,及数据回传-->
<template>
    <div class="h5editor">
        <mavon-editor class="mavon-editor"
                      :subfield="subfield"
                      :defaultOpen="defaultOpen"
                      :toolbarsFlag="toolbarsFlag"
                      :toolbars="toolbars"
                      :shortCut="false"
                      v-model="h5Content"
                      :placeholder="placeholder"
        @change="sync"></mavon-editor>
    </div>
</template>
<script>
    /* 这里实际是引入mavon-editor模块中的mavonEditor组件 */
    import {mavonEditor} from 'mavon-editor';
    require('../assets/css/css/index.css');
    export default {
        name: "h5editor",
        props: {
            content: {
                type: String,
                default: ''
            },
            view: {
                type: Boolean,
                default: false
            },
            value: {
                type: Object,
                default: function () {
                    return {};
                },
                description: '此对象用作内外数据交互'
            },
            placeholder: String
        },
        data() {
            let data = {
                h5Content: this.content
            };

            let isView = this.view;
            data.subfield = data.toolbarsFlag = data.boxShadow = !isView;
            data.defaultOpen = isView ? 'preview' : '';
            data.toolbars = isView ? {} : {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: false, // 展示html源码
                // help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: true, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true // 右对齐
                /* 2.2.1 */
                // subfield: true, // 单双栏模式
                // preview: true // 预览
            };

            return data;
        },
        mounted() {
            this.h5Content = this.$attrs.content;
        },
        methods: {
            sync(value, render) {
                /* 将编辑器的数据通过绑定对象传递到调用方 */
                this.value.value = value;
                this.value.render = render;
            }
        },
        components: {
            mavonEditor
        }
    };
</script>
<style lang="scss">
    .h5editor {
        margin: auto;
        width: 90%;
        min-height: 50px;
        height:100%;
        .mavon-editor {
            height: 100%;
            /* 调整mavon-editor的层级,避免层级太高,导致遮罩层失效 */
            z-index:2;
        }
    }
</style>

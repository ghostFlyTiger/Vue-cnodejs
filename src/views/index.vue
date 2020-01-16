<template>
    <div class="index-container">
        <img class="index" src="../assets/images/index.png">
    </div>
</template>
<script>
    require('../assets/scss/CV.scss');
    require('../assets/scss/iconfont/iconfont.css');
    require('../assets/scss/github-markdown.css');

    export default {
        mounted() {
            setTimeout(() => {
                this.$router.push({
                    name: 'list'
                });
            }, 2000);
        }
    };
</script>
<style lang="scss" scoped>
    .index-container {
        text-align: center;
        .index {
            width: 50%;
            background-color: #fff;
            margin: 10% auto;
            animation: showFlow 1.5s linear;
        }
        @keyframes showFlow {
            0% {
                transform: rotate(70deg) scale(.2);
            }

            25% {
                transform: rotate(50deg) scale(.4);
            }

            50% {
                transform: rotate(30deg) scale(.5);
            }

            100% {
                transform: rotate(0deg) scale(1);
            }
        }
    }
</style>

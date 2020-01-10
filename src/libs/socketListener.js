/* eslint-disable */
/**
 * socketListener
 */
import Vue from 'vue';
/* 打开ws链接 */
import store from "../vuex/user";

class Ms {
    simpleMs;
    constructor() {
        this.init();
    }
    init(){

        let simpleMs = new WebSocket("ws://localhost:8057/simpleMs");

        simpleMs.onopen=function (event) {
            simpleMs.send(JSON.stringify({
                userId:store.state.userInfo.userId,
                id:new Date().getTime(),
                data:{
                    to:'app',
                    from:'main'
                }
            }));
        };

        simpleMs.onmessage=function (event) {
            let data = JSON.parse(event.data);
            if(data.trigger){
                store.dispatch('setTrunk',data);
            }else{
                 Vue.prototype.$alert(data.data);
            }
        };

        simpleMs.onclose=function (event) {
            console.info(event);
        };

        this.simpleMs=simpleMs;
    }
}

export default {
    install(){
        Vue.prototype.$simpleMs = new Ms();
    }
};


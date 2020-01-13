/* eslint-disable */
/**
 * socketListener
 */
import Vue from 'vue';
import store from "../vuex/user";

class Ms {
    __WS_URL="ws://localhost:8057/simpleMs";
    _retry=10;
    retry=this._retry;
    simpleMs;
    constructor() {
        this.init();
    }
    _reopen(){
        setTimeout(()=>{
           this.simpleMs= new WebSocket(this.__WS_URL);
        },1000*this.retry++);
    }
    init(){
        /* 打开ws链接 */
        let $this=this;
        let simpleMs = new WebSocket(this.__WS_URL);

        simpleMs.onopen=function (event) {
            simpleMs.send(JSON.stringify({
                userId:store.state.userInfo.userId,
                id:new Date().getTime(),
                data:{
                    to:'app',
                    from:'main'
                }
            }));
            $this.retry=$this._retry;
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
            $this._reopen();
        };

        simpleMs.onerror=function (event) {
            $this._reopen();
        };

        this.simpleMs=simpleMs;
    }
}

export default {
    install(){
        Vue.prototype.$simpleMs = new Ms();
    }
};


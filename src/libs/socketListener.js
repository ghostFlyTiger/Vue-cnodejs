/* eslint-disable */
/**
 * socketListener
 */
import Vue from 'vue';
import store from "../vuex/user";

/**
 * 基本websocket对象管理
 * @param url -地址
 * @constructor -
 */
function Ms(url) {
    this.__WS_URL=url;
    this._retry=10;
    this.retry=this._retry;
    this.init();
}

Ms.prototype= {
    constructor: Ms,
    _reopen(){
        setTimeout(()=>{
            try {
                this.simpleMs= new WebSocket(this.__WS_URL);
            }catch (e) {
                this._reopen();
            }
        },1000*this.retry++);
    },
    sendMsg(msg){
        this.simpleMs.send(JSON.stringify(Object.assign({
            userGroup:store.state.userGroup.id,
            id:new Date().getTime(),
        },msg)));
    },
    init(){
        if(this.simpleMs){
            return;
        }
        /* 打开ws链接 */
        let $this=this;
        let simpleMs = new WebSocket(this.__WS_URL);

        simpleMs.onopen=function (event) {
            simpleMs.send(JSON.stringify({
                userGroup:store.state.userGroup.id,
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
            }else if(data.data && data.data.message) {
                Vue.prototype.$alert(data.data.message);
            }
        };

        simpleMs.onclose=function (event) {
            $this._reopen();
        };

        simpleMs.onerror=function (event) {
            $this._reopen();
        };

        this.simpleMs=simpleMs;
    }
};

/**
 * 事件websocket总线管理
 * @param url -地址
 * @constructor -
 */
function EventsMs(url) {
    Ms.call(this,url);
}

EventsMs.prototype=Object.assign({},Ms.prototype,{
    constructor: EventsMs,
    init(){
        if(this.simpleMs){
            return;
        }
        /* 打开ws链接 */
        let $this=this;
        let simpleMs = new WebSocket(this.__WS_URL);

        simpleMs.onopen=function (event) {
            simpleMs.send(JSON.stringify({
                userGroup:store.state.userGroup.id,
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
            if(data.event){
                document.dispatchEvent(new CustomEvent(data.event,{detail:data.data || {}}));
            }else if(data.data && data.data.message) {
                Vue.prototype.$alert(data.data.message);
            }
        };

        simpleMs.onclose=function (event) {
            console.info(event);
            $this._reopen();
        };

        simpleMs.onerror=function (event) {
            console.info(event);
            $this._reopen();
        };

        this.simpleMs=simpleMs;
    }
});

export default {
    install(){
        Vue.prototype.$simpleMs = new Ms("ws://localhost:8057/simpleMs");
        Vue.prototype.$eventsMs = new EventsMs("ws://localhost:8057/simpleEventsMs");
    }
};


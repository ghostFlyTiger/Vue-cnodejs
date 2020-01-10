/**
 * topicRouter
 */
// require.ensure 是 Webpack 的特殊语法，用来设置 code-split point

const Home = resolve => {
    require.ensure(['./views/index.vue'], () => {
        resolve(require('./views/index.vue'));
    });
};

const List = resolve => {
    require.ensure(['./views/list.vue'], () => {
        resolve(require('./views/list.vue'));
    });
};

const routers = [{
    path: '/',
    name: 'home',
    component: Home
}, {
    path: '/codespace',
    name: 'codespace',
    component: Home
}, {
    path: '/list',
    name: 'list',
    component: List
}, {
    path: '/add',
    name: 'add',
    component(resolve) {
        require.ensure(['./views/new.vue'], () => {
            resolve(require('./views/new.vue'));
        });
    }
}, {
    path: '/topic/:id',
    name: 'topic',
    component(resolve) {
        require.ensure(['./views/topic.vue'], () => {
            resolve(require('./views/topic.vue'));
        });
    }
}, {
    path: '/editTopic/:id',
    name: 'editTopic',
    component(resolve) {
        require.ensure(['./views/editTopic.vue'], () => {
            resolve(require('./views/editTopic.vue'));
        });
    }
}, {
    path: '/userList',
    name: 'userList',
    component(resolve) {
        require.ensure(['./views/userList.vue'], () => {
            resolve(require('./views/userList.vue'));
        });
    }
}, {
    path: '*',
    component: Home
}];

export default routers;

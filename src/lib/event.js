import Vue from 'vue';

const bus = new Vue();

const EventPlugin = {
    install(Vue) {
        Vue.prototype.$bus = bus;
    },
};

export default EventPlugin;

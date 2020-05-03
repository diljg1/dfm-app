import UIkit from 'uikit';

class Notifier {

    notify(message, status = '', icon = '') {
        if (icon) {
            message = `<span uk-icon="${icon}"></span> ${message}`;
        }
        return UIkit.notification({
            message,
            status,
            pos: 'bottom-left',
            timeout: 3000,
        });
    }
}

const NotifyPlugin = {
    install(Vue) {

        const notifier = new Notifier();

        Vue.prototype.$notify = notifier.notify;

    },
};

export default NotifyPlugin;


import FinisNotificationConstructor from "./FinisNotification.vue";
import {h, render} from "vue";
const notify_id = "FinisNotification";
/**
 * @param {Object} options
 * @param {string} options.title - 通知的标题
 * @param {string} options.message - 通知的详细内容
 * @param {'Success' | 'Error' | 'Warning' | 'Info'} [options.type='Info'] - 通知类型
*/
const FinisNotification = (options) => {
    const container = document.createElement("div");
    const close = () => {
        render(null, container);
        container.remove();
    };
    const vNode = h(FinisNotificationConstructor, {
        title: options.title,
        message: options.message,
        type: options.type || 'Info',
        onClose: close
    });
    render(vNode, container)
    document.body.appendChild(container.firstElementChild)
    setTimeout(() => {
        close();
    }, 2500);
}

export default FinisNotification;
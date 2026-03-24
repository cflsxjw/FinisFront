import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.js'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark-custom',
    valueLight: 'light-custom',
});

export const toggleDark = useToggle(isDark);

const app = createApp(App);
app.use(router);
const pinia = createPinia().use(piniaPluginPersistedstate)
export default pinia
app.use(pinia)
app.mount('#app');

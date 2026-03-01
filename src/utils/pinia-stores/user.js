import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * @typedef {Object} UserData
 * @property {number} userid
 * @property {string} username
 * @property {string} token
 * @property {string} role
 */

export const useUserStore = defineStore('user', () => {
    const isLogin = ref(false)
    const userid = ref(0)
    const username = ref('')
    const token = ref('')
    const role = ref('')

    /** @param {UserData} data */
    function setLogin(data) {
        isLogin.value = true
        userid.value = data.userid
        username.value = data.username
        token.value = data.token
        role.value = data.role
    }

    function setLogout() {
        isLogin.value = false
        userid.value = 0
        username.value = ''
        token.value = ''
        role.value = ''
    }

    return { isLogin, userid, username, token, role, setLogin, setLogout }
}, {
    persist: true
})
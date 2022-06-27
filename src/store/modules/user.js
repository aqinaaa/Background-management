import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

const actions = {
    //这里在处理登录业务
    // 方法1：使用async
    async login({ commit }, userInfo) {
        // 解构出用户名和密码
        const { username, password } = userInfo
        let result = await login({ username: username.trim(), password: password });
        // console.log(result)
        // 注意：当前登录请求显示使用的是mock数据，mock数据code是20000
        if (result.code == 20000 || result.code == 200) {
            commit('SET_TOKEN', result.data.token);
            setToken(result.data.token);
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    //这里在处理登录业务:方法2
    // login({ commit }, userInfo) {
    //     // 解构出用户名和密码
    //     const { username, password } = userInfo

    //     return new Promise((resolve, reject) => {
    //         //函数： trim()函数清除多余的单元格，仅保留单词之间的单个单元格
    //         login({ username: username.trim(), password: password }).then(response => {
    //             const { data } = response
    //             commit('SET_TOKEN', data.token)
    //                 // 调动从util引用的封装函数setToken，将数据请求返回的data中的token存储到cookie
    //             setToken(data.token)
    //                 // 这个resolve在这里是什么意思？？
    //             resolve()
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response

                if (!data) {
                    return reject('Verification failed, please Login again.')
                }

                const { name, avatar } = data

                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true, //开启了命名空间
    state,
    mutations,
    actions
}
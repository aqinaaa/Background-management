// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
// 引入路由组件
import router from '@/router'

// 箭头函数：得到一个默认的state
const getDefaultState = () => {
    return {
        // 获取token
        token: getToken(),
        // 存储名字
        name: '',
        // 存储用户头像
        avatar: '',
        // 菜单标记:服务器返回的菜单信息【根据不同的角色，返回的标记信息，数组里面的元素是字符串
        routes: [],
        // 服务器返回的角色信息
        roles: [],
        // 服务器返回的按钮权限的信息
        buttons: [],
        // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由】
        resultAsyncRoutes: [],
        resultAllRoutes: [],

    }
}

const state = getDefaultState()
    // 唯一修改state的地方
const mutations = {
    // 重置state,Object.assign让state调取 getDefaultState方法清空
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    // 登录成功之后存储token
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    // 登录成功之后存储name
    // SET_NAME: (state, name) => {
    //     state.name = name
    // },
    // 存储用户头像
    // SET_AVATAR: (state, avatar) => {
    //     state.avatar = avatar
    // }
    // vuex存储用户的全部信息
    SET_USERINFO: (state, userInfo) => {
        //   用户名
        state.name = userInfo.name;
        // 用户头像
        state.avatar = userInfo.avatar;
        // 菜单权限标记
        state.routes = userInfo.routes;
        // 按钮权限标记
        state.buttons = userInfo.buttons;
        // 角色
        state.roles = userInfo.roles;
    },
    //最终计算出的异步路由
    SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
        state.resultAsyncRoutes = asyncRoutes;
        // 计算出当前用户需要展示所有路由:使用引入的constantRoute（concat）方法合并
        state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
            // 给路由器添加新的路由
        router.addRoutes(state.resultAllRoutes)
    }
};
// 定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
        // 测试数据
        // console.log(asyncRoutes, 111);
        // console.log(routes, 2222);
        // 过滤出当前用户【超级管理|普通员工】需要展示的异步路由
        return asyncRoutes.filter(item => {
            // 数据当中没有这个元素返回索引值-1，如果有则会个元素返回的索引值一定不是-1
            if (routes.indexOf(item.name) != -1) {
                // 递归：别忘记还有2、3、4、5、6、级路由
                if (item.children && item.children.length) {
                    item.children = computedAsyncRoutes(item.children, routes);
                }
                return true;
            }
        })
    }
    // actions
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
            // vuex存储token
            commit('SET_TOKEN', result.data.token);
            //本地持久化存储token
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

    // 获取用户信息
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                // 获取用户信息：从返回的结果中解构出data
                const { data } = response
                console.log(data)
                    // 如果没有获取到data，则返回reject结果，显示登陆失败的提醒信息
                if (!data) {
                    return reject('Verification failed, please Login again.')
                }
                // 如果有返回结果而且有data,则解构数据，提交mutations函数进行保存
                const { name, avatar } = data
                // commit('SET_NAME', name)
                // commit('SET_AVATAR', avatar)
                // -------以上两行存储的信息是模板潘嘉诚存储的，只有名称和头像，信息不够，按照以下重新存储
                commit('SET_USERINFO', data);
                commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
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
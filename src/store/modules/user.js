const state = {
  name: '',
  avatar: '',
  token: ''
}

const mutations = {
  SET_NAME(state, name) {
    state.name = name
  },
  SET_AVATAR(state, avatar) {
    state.avatar = avatar
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  LOGOUT(state) {
    state.name = ''
    state.avatar = ''
    state.token = ''
  }
}

const actions = {
  login({ commit }, userInfo) {
    return new Promise((resolve) => {
      // 模拟登录，实际项目中调用接口
      commit('SET_NAME', userInfo.name || '用户')
      commit('SET_TOKEN', 'mock-token-' + Date.now())
      resolve()
    })
  },
  logout({ commit }) {
    commit('LOGOUT')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

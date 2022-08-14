export const state = () => ({
  id: '',
})

export const getters = {
  getId(state) {
    return state.id
  },
}

export const mutations = {
  setId(state, id) {
    state.id = id
  },
}

export const actions = {
  setId({ commit }, id) {
    commit('setId', id)
  },
}

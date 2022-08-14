<template lang="pug">
v-form(ref='form', v-model='adminPlayerForm.isValid')
  v-text-field(
    label='プレイヤーID',
    hint='半角英数字と_が入力できます',
    v-model='adminPlayerForm.adminPlayerId',
    :rules='adminPlayerForm.rules'
  )
  .response-message.text-caption(
    :class='isSuccessResponse(adminPlayerForm.response.statusCode) ? "green--text" : "red--text"'
  ) {{ adminPlayerForm.response.message }}
  v-btn(
    @click='createNewRoom',
    :disabled='!adminPlayerForm.isValid',
    depressed
  ) 作成
</template>

<script>
import {
  setInCookie as setRoomInCookie,
  setInStore as setRoomInStore,
  createRoom,
} from '~/plugins/room/module'
import {
  setInCookie as setPlayerInCookie,
  setInStore as setPlayerInStore,
  getRules as getPlayerRules,
} from '~/plugins/player/module'

export default {
  name: 'AdminPlayerFormComponent',
  data() {
    return {
      adminPlayerForm: {
        isValid: true,
        adminPlayerId: '',
        response: {
          statusCode: null,
          message: '',
        },
        rules: getPlayerRules(),
      },
    }
  },
  methods: {
    async createNewRoom() {
      if (!this.$refs.form.validate()) return

      // TODO
      // gameの選択を可変にする
      const roomObject = {
        adminPlayerId: this.adminPlayerForm.adminPlayerId,
        playerIdList: [this.adminPlayerForm.adminPlayerId],
        game: {},
      }

      try {
        const db = this.$fire.firestore
        const roomId = await createRoom(db, roomObject)

        this.setResponse(200, '部屋を作成できました。')

        this.setCookie(roomId, roomObject.adminPlayerId)
        this.setStore(roomId, roomObject.adminPlayerId)

        this.$router.push({ path: `${roomId}/config` })
      } catch (error) {
        this.setResponse(500, '部屋を作成できませんでした。')
      }
    },
    setResponse(statusCode, message) {
      this.adminPlayerForm.response.statusCode = statusCode
      this.adminPlayerForm.response.message = message
    },
    setCookie(roomId, playerId) {
      setRoomInCookie(this.$cookies, roomId)
      setPlayerInCookie(this.$cookies, playerId)
    },
    setStore(roomId, playerId) {
      setRoomInStore(this.$store, roomId)
      setPlayerInStore(this.$store, playerId)
    },
    isSuccessResponse(statusCode) {
      if (statusCode < 400 || statusCode >= 500) return false

      return true
    },
  },
}
</script>

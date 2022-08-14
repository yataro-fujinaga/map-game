<template lang="pug">
v-form(ref='form', v-model='joinedPlayerForm.isValid')
  v-text-field(
    label='プレイヤーID',
    hint='半角英数字と_が入力できます',
    v-model='joinedPlayerForm.playerId',
    :rules='playerIdRules'
  )
  .response-message.text-caption(
    :class='isSuccessResponse(joinedPlayerForm.response.statusCode) ? "text--green" : "text--red"'
  ) {{ adminPlayerForm.response.message }}
  v-btn(@click='joinPlayer', :disabled='!joinedPlayerForm.isValid', depressed) 参加
</template>

<script>
import {
  createPlayer,
  setInCookie as setPlayerInCookie,
  setInStore as setPlayerInStore,
  getRules as getPlayerRule,
} from '~/plugins/player/module'

import {
  setInCookie as setRoomInCookie,
  setInStore as setRoomInStore,
} from '~/plugins/room/module'

export default {
  name: 'JoinedPlayerFormComponent',
  props: {
    roomId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      joinedPlayerForm: {
        isValid: true,
        playerId: '',
        response: {
          statusCode: null,
          message: '',
        },
      },
    }
  },
  computed: {
    playerIdRules() {
      return getPlayerRule()
    },
  },
  methods: {
    async joinPlayer() {
      if (!this.$refs.form.validate()) return

      const playerObject = {
        id: this.joinedPlayerForm.playerId,
      }

      const roomObject = {
        id: this.roomId,
      }

      try {
        await createPlayer(playerObject)

        this.setCookie(roomObject.id, playerObject.id)
        this.setStore(roomObject.id, playerObject.id)

        this.isSuccessResponse()

        this.$router.push({ path: `${this.room.id}/config` })
      } catch (error) {
        this.isErrorResponse(error)
      }
    },
    isSuccessResponse(statusCode) {
      if (statusCode < 400 || statusCode >= 500) return false

      return true
    },
    setResponse(statusCode, message) {
      this.joinedPlayerForm.response.statusCode = statusCode
      this.joinedPlayerForm.response.message = message
    },
    setCookie(roomId, playerId) {
      setRoomInCookie(this.$cookies, roomId)
      setPlayerInCookie(this.$cookies, playerId)
    },
    setStore(roomId, playerId) {
      setRoomInStore(this.$store, roomId)
      setPlayerInStore(this.$store, playerId)
    },
  },
}
</script>

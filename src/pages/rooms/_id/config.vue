<template lang="pug">
v-col(cols='12')
  .qr-code-wrap.d-flex.justify-center
    qrcode(:value='roomConfigUrl', :options='{ width: 300 }')
  .start-game-button-wrap(v-if='isAdminPlayer')
    v-btn(color='success', block, :to='roomPath') ゲーム開始
  v-container.players-wrap
    v-row
      v-col(v-for='playerId in room.playerIdList', cols='6', :key='playerId')
        v-card(outlined)
          v-card-text
            .player-id {{ playerId }}
</template>

<script>
import {
  isEmptyRoomIdInStore,
  isEmptyRoomIdInCookie,
  getFromCookie as getRoomIdFromCookie,
  setInStore as setRoomIdInStore,
  listenRoomEvent,
  getFromStore as getRoomIdFromStore,
} from '~/plugins/room/module'
import {
  isAdminPlayer,
  isEmptyPlayerIdInStore,
  isEmptyPlayerIdInCookie,
  getFromCookie as getPlayerIdFromCookie,
  setInStore as setPlayerIdInStore,
  getFromStore as getPlayerIdFromStore,
} from '~/plugins/player/module'

export default {
  name: 'ConfigureRoomPage',
  data() {
    return {
      room: {
        adminPlayerId: '',
        playerIdList: [],
      },
      isAdminPlayer: false,
      roomConfigUrl: '',
      roomPath: '',
    }
  },
  created() {
    let roomId
    let playerId

    try {
      roomId = this.getRoomId()
      playerId = this.getPlayerId()
    } catch (error) {
      console.log(error)
    }

    if (this.isNotJoinedPlayer(roomId, this.$route.params.id))
      // this.$nuxt.error({
      //   statusCode: 403,
      // })
      console.log('HELLO')

    const db = this.$fire.firestore

    // const roomObject = getRoom(db, roomId)
    const roomObject = listenRoomEvent(db, roomId)

    this.setRoomObject(roomObject)

    this.setIsAdminPlayer(playerId, this.room.adminPlayerId)
    this.setRoomConfigUrl(roomId)
    this.setRoomPath(roomId)
  },
  methods: {
    isNotJoinedPlayer(roomIdFromStore, roomIdFromParam) {
      return roomIdFromStore !== roomIdFromParam
    },
    setIsAdminPlayer(playerId, adminPlayerId) {
      this.isAdminPlayer = isAdminPlayer(playerId, adminPlayerId)
    },
    setRoomObject(roomObject) {
      this.room.adminPlayerId = roomObject.adminPlayerId
      this.room.playerIdList = roomObject.playerIdList
    },
    setStoreFromCookie() {
      setRoomIdInStore(this.$cookies, this.$store)
      setPlayerIdInStore(this.$cookies, this.$store)
    },
    setRoomConfigUrl(roomId) {
      this.roomConfigUrl = `/rooms/${roomId}/join`
    },
    setRoomPath(roomId) {
      this.roomPath = `/rooms/${roomId}`
    },
    getRoomId() {
      if (!isEmptyRoomIdInStore(this.$store))
        return getRoomIdFromStore(this.$store)

      if (!isEmptyRoomIdInCookie(this.$store)) {
        const roomId = getRoomIdFromCookie(this.$cookies)

        setRoomIdInStore(this.$store, roomId)

        return roomId
      }

      // 403を投げる
      throw new Error('roomIdが取得できません')
    },
    getPlayerId() {
      if (!isEmptyPlayerIdInStore(this.$store))
        return getPlayerIdFromStore(this.$store)

      if (!isEmptyPlayerIdInCookie(this.$store)) {
        const playerId = getPlayerIdFromCookie(this.$cookies)

        setPlayerIdInStore(this.$store, playerId)

        return playerId
      }

      // 403を投げる
      throw new Error('playerIdが取得できません')
    },
  },
}
</script>

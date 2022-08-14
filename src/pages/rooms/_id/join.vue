<template lang="pug">
v-col(cols='12')
  PagesRoomJoinedPlayerForm
  v-container.players-wrap
    v-row
      v-col(v-for='playerId in room.playerIdList', cols='6', :key='playerId')
        v-card(outlined)
          v-card-text
            .player-id {{ playerId }}
</template>

<script>
export default {
  name: 'JoinRoomPage',
  data() {
    return {}
  },
}
</script>

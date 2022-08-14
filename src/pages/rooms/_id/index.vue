<template lang="pug">
v-col(cols='12')
  qrcode(:value='url')
</template>

<script>
import { doc, getDoc } from 'firebase/firestore'

export default {
  name: 'ShowMapPage',
  data() {
    return {
      map: {
        admin_player_id: '',
        player_id_list: [],
      },
      url: window.location.href,
    }
  },
  created() {
    this.getMap(this.$route.params.id)
  },
  methods: {
    async getMap(mapId) {
      const database = this.$fire.firestore

      const docRef = doc(database, 'maps', mapId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        // 例外処理
      }

      const data = docSnap.data()

      this.map = {
        admin_player_id: data.admin_player_id,
        player_id_list: data.player_id_list,
      }

      // 存在する場合
      // ゲームの参加者を表示
      // 双方向に行われる
    },
  },
}
</script>

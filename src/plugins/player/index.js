import { doc, getDoc, updateDoc } from 'firebase/firestore'

export async function createPlayer(db, playerObject, roomId) {
  const docRef = doc(db, 'rooms', roomId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    // 例外処理
  }

  const data = docSnap.data()
  const playerIdList = data.player_id_list

  const newPlayerIdList = addJoinedPlayerId(playerIdList, playerObject)

  await updateDoc(docRef, { player_id_list: newPlayerIdList })
}

function addJoinedPlayerId(playerIdList, playerObject) {
  const playerId = playerObject.playerId

  return playerIdList.push(playerId)
}

export function isAdminPlayer(playerId, adminPlayerId) {
  return playerId === adminPlayerId
}

export function setInCookie(cookies, playerId) {
  cookies.set('playerId', playerId)
}

export function getFromCookie(cookies) {
  const playerId = cookies.get('playerId')

  return playerId
}

export function setInStore(store, playerId) {
  store.dispatch('player/setId', playerId)
}

export function getFromStore(store) {
  return store.getters['player/getId']
}

export function isEmptyPlayerIdInStore(store) {
  const playerId = store.getters['player/getId']

  if (playerId === '' || playerId === undefined) return true

  return false
}

export function isEmptyPlayerIdInCookie(cookies) {
  const playerId = cookies.get('playerId')

  if (playerId === '' || playerId === undefined) return true

  return false
}

export function getRules() {
  const minLength = 4
  const maxLength = 20

  const rules = {
    required: (value) => !!value || '入力してください',
    isCorrectFormat: (value) => {
      const pattern = /^[a-zA-Z0-9_]+$/
      return pattern.test(value) || '半角英数字と_を入力してください'
    },
    isCorrectLength: (value) => {
      const isMoreMin = value.length >= minLength
      const isLessMax = value.length <= maxLength
      return (
        (isMoreMin && isLessMax) ||
        `${minLength}文字以上、${maxLength}文字以下にしてください`
      )
    },
  }
  return [rules.required, rules.isCorrectFormat, rules.isCorrectLength]
}

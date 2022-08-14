import { doc, addDoc, collection, getDoc, onSnapshot } from 'firebase/firestore'

export function setInCookie(cookies, roomId) {
  cookies.set('roomId', roomId)
}

export function getFromCookie(cookies) {
  const roomId = cookies.get('roomId')

  return roomId
}

export function setInStore(store, roomId) {
  store.dispatch('room/setId', roomId)
}

export function getFromStore(store) {
  return store.getters['room/getId']
}

export function isEmptyRoomIdInStore(store) {
  const roomId = store.getters['room/getId']

  if (roomId === '' || roomId === undefined) return true

  return false
}

export function isEmptyRoomIdInCookie(cookies) {
  const roomId = cookies.get('roomId')

  if (roomId === '' || roomId === undefined) return true

  return false
}

export async function createRoom(db, roomObject) {
  const docRef = await addDoc(collection(db, 'rooms'), roomObject)

  const roomId = docRef.id

  return roomId
}

export async function getRoom(db, roomId) {
  const docRef = doc(db, 'rooms', roomId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    // TODO
    // 例外処理
    throw new Error('isEmpty')
  }

  const data = docSnap.data()

  return {
    adminPlayerId: data.adminPlayerId,
    playerIdList: data.playerIdList,
  }
}

export function listenRoomEvent(db, roomId) {
  const roomObject = {
    adminPlayerId: '',
    playerIdList: [],
  }

  try {
    onSnapshot(doc(db, 'rooms', roomId), (doc) => {
      const data = doc.data()

      roomObject.adminPlayerId = data.adminPlayerId
      roomObject.playerIdList.push(...data.playerIdList)
    })

    return roomObject
  } catch (error) {
    // TODO
    // 例外処理
    throw new Error(error)
  }
}

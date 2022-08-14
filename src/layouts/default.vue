<template lang="pug">
v-app
  v-app-bar(app, color='green darken-2') 
    v-container
      v-row
        v-col(cols='12')
          NuxtLink(to='/')
            span.font-weight-bold.white--text 人生ゲームジェネレーター
  v-main
    v-container
      v-row
        Nuxt
  v-footer(app)
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {}
  },
}
</script>

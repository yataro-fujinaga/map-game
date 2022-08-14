<template lang="pug">
v-col(cols='12')
  h1 {{ errorMessage }}
  NuxtLink(to='/') トップページ
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      errorMessages: {
        401: '401 Unauthorized',
        403: '403 Forbidden',
        404: '404 Not Found',
        500: '500 Internal Server',
      },
    }
  },
  head() {
    const title = this.errorMessage
    return {
      title,
    }
  },
  computed: {
    errorMessage() {
      return this.errorMessages[this.error.statusCode]
    },
  },
}
</script>

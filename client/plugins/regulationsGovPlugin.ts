import { Plugin } from '@nuxt/types'
import { createApi } from '~/api/regulationsGovApi'

const regulationsGovPlugin: Plugin = function ({ $axios }, inject) {
  inject('regulationsGov', createApi($axios))
}

export default regulationsGovPlugin

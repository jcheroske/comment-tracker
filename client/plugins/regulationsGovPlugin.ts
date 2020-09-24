import { Plugin } from '@nuxt/types'
import { createApi } from '~/api/regulationsGov'

const regulationsGovPlugin: Plugin = function ({ $axios }, inject) {
  inject('regulationsGov', createApi($axios))
}

export default regulationsGovPlugin

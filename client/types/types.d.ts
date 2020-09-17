import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'

export type RestServerOptions = {
  apiKey: string
  baseURL: string
  contextPath: string
}

export interface PrivateRuntimeConfig extends NuxtRuntimeConfig {
  restServer: RestServerOptions
}

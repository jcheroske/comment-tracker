import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'

type RestServerOptions = {
  apiKey: string
  baseURL: string
  contextPath: string
}

type CruiseCampaignOptions = {
  documentId: string
}

export type PrivateRuntimeConfig = NuxtRuntimeConfig & {
  restServer: RestServerOptions
}

export type PublicRuntimeConfig = NuxtRuntimeConfig & {
  cruiseCampaign: CruiseCampaignOptions
}

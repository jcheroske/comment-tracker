import path from 'path'
import type { Module, NuxtConfig } from '@nuxt/types'
import type { NuxtOptionsRuntimeConfig } from '@nuxt/types/config/runtime'
import { AxiosRequestConfig } from 'axios'
import { mergeAll } from 'lodash/fp'

export type ExpandedRuntimeConfig = NuxtOptionsRuntimeConfig & {
  axiosInstanceModule: {
    [instanceName: string]: AxiosRequestConfig
  }
}

export type ExpandedConfig = NuxtConfig & {
  privateRuntimeConfig: ExpandedRuntimeConfig
  publicRuntimeConfig: ExpandedRuntimeConfig
}

const axiosInstanceModule: Module<never> = function () {
  const { privateRuntimeConfig, publicRuntimeConfig } = this
    .options as ExpandedConfig

  const mergedConfig = mergeAll([
    privateRuntimeConfig.axiosInstanceModule,
    publicRuntimeConfig.axiosInstanceModule,
  ])

  for (const instanceName in mergedConfig) {
    this.addPlugin({
      src: path.resolve(__dirname, '../plugins/axiosInstancePlugin.ts'),
      fileName: `axiosInstancePlugin_${instanceName}.ts`,
      options: {
        name: instanceName,
        config: mergedConfig[instanceName],
      },
    })
  }
}

export default axiosInstanceModule

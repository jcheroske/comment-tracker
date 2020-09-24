import { AxiosRequestConfig } from 'axios'
import { Plugin } from '@nuxt/types'

const axiosInstancePlugin: Plugin = function ({ $axios }, inject) {
  const name = '<%= options.name %>'
  const config = JSON.parse('<%= JSON.stringify(options.config) %>')

  const axiosInstance = $axios.create({
    ...config,
    paramsSerializer,
  })
  axiosInstance.interceptors.request.use(urlParamInterceptor)

  inject(name, axiosInstance)
}

function urlParamInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  for (const k in config.params) {
    const v = config.params[k]
    if (config.url?.includes(`:${k}`)) {
      config.url = config.url.replace(`:${k}`, encodeURIComponent(v))
      delete config.params[k]
    }
  }

  return config
}

function paramsSerializer(params: AxiosRequestConfig['params']) {
  return Qs.stringify(params)
}

export default axiosInstancePlugin

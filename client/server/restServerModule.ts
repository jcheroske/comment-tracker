import { Module } from '@nuxt/types'
import { addAsync, ExpressWithAsync } from '@awaitjs/express'
import axiosStatic, { AxiosError, AxiosInstance } from 'axios'
import express, { ErrorRequestHandler } from 'express'
import createError from 'http-errors'

import { PrivateRuntimeConfig, RestServerOptions } from '~/types/types'

const restServerModule: Module = function () {
  const privateRuntimeConfig = this.options
    .privateRuntimeConfig as PrivateRuntimeConfig

  const {
    restServer: restServerOptions,
  }: PrivateRuntimeConfig = privateRuntimeConfig

  const axios: AxiosInstance = createAxios(restServerOptions)

  const app: ExpressWithAsync = addAsync(express())
  app.use(express.json())
  addRoutesToApp(app, axios)

  this.addServerMiddleware({
    path: restServerOptions.contextPath,
    handler: app,
  })

  app.use(axiosErrorHandler)
  app.use(jsonErrorHandler)
}

function createAxios(options: RestServerOptions): AxiosInstance {
  return axiosStatic.create({
    baseURL: options.baseURL,
    headers: {
      'Content-Type': 'application/vnd.api+json;charset=UTF-8',
      'X-Api-Key': options.apiKey,
    },
  })
}

const axiosErrorHandler: ErrorRequestHandler = function (error, _, __, next) {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError
    const cause = axiosError.response?.data?.errors?.[0]

    const httpError = createError(
      Number(cause.status) || 500,
      axiosError.message,
      {
        ...axiosError.toJSON(),
        ...cause,
      }
    )

    next(httpError)
  } else {
    next(error)
  }
}

const jsonErrorHandler: ErrorRequestHandler = function (error, _, res, next) {
  if (!res.headersSent) {
    res.status(error.status).json(error).end()
  } else {
    next(error)
  }
}

function addRoutesToApp(app: ExpressWithAsync, axios: AxiosInstance): void {
  app.getAsync('/comments/:id', async (req, res) => {
    const axiosResponse = await axios.get(req.url)
    res.json(axiosResponse.data)
  })

  app.postAsync('/comments', async (req, res) => {
    const postData = req.body
    const axiosResponse = await axios.post(req.url, postData)
    console.log('After axios: ' + axiosResponse.data)
    res.json(axiosResponse.data)
  })
}

export default restServerModule

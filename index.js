'use strict'

const pAny = require('p-any')
const got = require('got')

const createRequest = method => async (url, opts) => {
  const req = got[method](url, opts)
  const redirectStatusCodes = []
  const redirectUrls = []

  req.on('redirect', res => {
    redirectUrls.push(res.url)
    redirectStatusCodes.push(res.statusCode)
  })

  return { ...(await req), redirectUrls, redirectStatusCodes }
}

const fromHEAD = createRequest('head')
const fromGET = createRequest('get')

module.exports = (url, opts = {}) =>
  pAny([fromHEAD(url, opts), fromGET(url, opts)])

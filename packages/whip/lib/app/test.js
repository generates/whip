import { Requester } from '@generates/requester'

const requester = new Requester({ shouldThrow: false })

export default function test (path, opts) {
  const app = this

  // If options has a statusCode, treat it as a response to a previous request
  // and try to extract headers from it to be reused for current request to
  // make it more convenient when writing tests with successive test requests.
  // if (opts?.statusCode) {
  //   const { headers } = opts.request.options
  //   const cookie = opts.headers['set-cookie'] || headers.cookie
  //   const csrf = headers['csrf-token']
  //   opts = { headers: {} }
  //   if (cookie) opts.headers.cookie = cookie
  //   if (csrf) opts.headers['csrf-token'] = csrf
  //   if (app.log) {
  //     app.logger.ns('whip.test').debug(
  //       `Extracted options for ${path} test request`,
  //       opts
  //     )
  //   }
  // }

  return {
    async get () {
      return this.request('get', opts)
    },
    async post (body) {
      return this.requestWithCsrf('post', { ...opts, body })
    },
    async put (body) {
      return this.requestWithCsrf('put', { ...opts, body })
    },
    async delete (body) {
      return this.requestWithCsrf('delete', { ...opts, body })
    },
    async request (method, opts) {
      const server = await app.start(0)
      const response = await requester[method](server.url + path, opts)
      await server.destroy()
      return response
    },
    async requestWithCsrf (method, opts) {
      // const headers = options?.headers
      // if (cfg.test?.csrfPath && (!headers || !headers['csrf-token'])) {
      //   const logger = app.logger && app.logger.ns('whip.test')
      //   if (logger) {
      //     logger.debug(`Adding CSRF token for ${method} ${path} test request`)
      //   }

      //   // Make a request to the CSRF token endpoint to get a CSRF token for
      //   // the test request.
      // const res = await app.test('/', opts).get()

      //   // Add the CSRF token and session cookie to the request headers.
      //   const csrfToken = response.body.csrfToken
      // const cookie = res.headers['set-cookie']
      opts.headers = {
        ...opts.headers
        // ...csrfToken ? { 'csrf-token': csrfToken } : {},
        // ...cookie ? { cookie } : {}
      }

      //   if (logger) {
      //     logger.debug(
      //       `Modified options for ${method} ${path} test request`,
      //       options
      //     )
      //   }
      // }

      return this.request(method, opts)
    }
  }
}

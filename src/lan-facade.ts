import { createServer, request as httpRequest, type IncomingMessage, type ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'

const ALLOWED_EXACT = new Set([
  '/m', '/m/', '/m/mobile.js', '/m/manifest.webmanifest', '/m/offline.html',
  '/m/service-worker.js', '/m/apple-touch-icon.png', '/m/icon-192.png', '/m/icon-512.png',
  '/api/pair/accept', '/api/pair/heartbeat', '/api/pair/status', '/api/pair/events',
])
const ALLOWED_PREFIX = ['/m/api/']

function allowed(path: string): boolean {
  return ALLOWED_EXACT.has(path) || ALLOWED_PREFIX.some(prefix => path.startsWith(prefix))
}

function reject(res: ServerResponse): void {
  res.writeHead(404, { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
  res.end()
}

export interface LanFacadeOptions {
  port: number
  targetPort: number
}

/**
 * Mount a least-privilege LAN facade for the phone surface. Ordinary DSH `/api`
 * and desktop control routes are never forwarded.
 */
export function installLanFacade(ctx: Context, options: LanFacadeOptions): void {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://mobile.local')
    if (!allowed(url.pathname)) {
      reject(response)
      return
    }
    const headers = { ...request.headers, host: `127.0.0.1:${String(options.targetPort)}` }
    delete headers.origin
    delete headers.referer
    const upstream = httpRequest({
      hostname: '127.0.0.1',
      port: options.targetPort,
      method: request.method,
      path: request.url,
      headers,
    }, (result: IncomingMessage) => {
      response.writeHead(result.statusCode ?? 502, result.headers)
      result.pipe(response)
    })
    upstream.on('error', () => {
      if (!response.headersSent) response.writeHead(502, { 'cache-control': 'no-store' })
      response.end()
    })
    request.pipe(upstream)
  })
  server.listen(options.port, '0.0.0.0')
  ctx.effect(() => () => new Promise<void>(resolve => server.close(() => resolve())), 'mobile-remote: LAN facade')
}

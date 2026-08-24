import dns from 'node:dns'
import { promisify } from 'node:util'
import net from 'node:net'

const resolve = promisify(dns.lookup)

const BLOCKED_HOSTNAMES = new Set([
  'localhost', 'localhost.localdomain', 'ip6-localhost', 'ip6-loopback',
  'metadata', 'metadata.google.internal', 'instance-data',
  '169.254.169.254'
])

function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return true
  const [a, b] = parts
  if (a === 10 || a === 127 || a === 0) return true
  if (a === 169 && b === 254) return true // link-local incl. cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true // CGNAT
  if (a === 192 && b === 0) return parts[2] === 0 || parts[2] === 2
  if (a === 198 && (b === 18 || b === 19)) return true
  if (a >= 224) return true // multicast + reserved + broadcast
  return false
}

function isPrivateIPv6(ip) {
  const lower = ip.toLowerCase()
  if (lower === '::' || lower === '::1') return true
  if (lower.startsWith('fe80') || lower.startsWith('fc') || lower.startsWith('fd')) return true
  if (lower.startsWith('::ffff:')) {
    const v4 = lower.replace('::ffff:', '')
    return net.isIPv4(v4) ? isPrivateIPv4(v4) : true
  }
  // IPv4-mapped in other notations
  if (lower.includes(':ffff:')) return true
  return false
}

function isPrivateIp(ip) {
  return net.isIPv4(ip) ? isPrivateIPv4(ip) : isPrivateIPv6(ip)
}

// Validates a user-supplied URL for SSRF safety. Returns { ok, url } or { ok:false, error }.
export async function validatePublicUrl(rawUrl) {
  let url
  try {
    url = new URL(String(rawUrl))
  } catch {
    return { ok: false, error: 'invalid_url' }
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'invalid_protocol' }
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (!host || BLOCKED_HOSTNAMES.has(host)) {
    return { ok: false, error: 'blocked_host' }
  }
  if (net.isIP(host)) {
    if (isPrivateIp(host)) return { ok: false, error: 'blocked_host' }
    return { ok: true, url }
  }
  try {
    const { address } = await resolve(host)
    if (isPrivateIp(address)) return { ok: false, error: 'blocked_host' }
    return { ok: true, url }
  } catch {
    return { ok: false, error: 'dns_lookup_failed' }
  }
}

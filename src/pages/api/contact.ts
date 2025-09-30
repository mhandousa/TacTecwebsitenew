import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ratelimit } from '@/lib/ratelimit';
import { isIP } from 'net';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  club: z.string().min(2, "Club name must be at least 2 characters"),
  role: z.string().min(1, "Please select your role"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  requestType: z.enum(['demo', 'sales', 'support', 'general']),
});

type ContactFormData = z.infer<typeof contactSchema>;

type ErrorCode =
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'METHOD_NOT_ALLOWED'
  | 'SERVER_ERROR';

interface ApiResponse {
  success?: boolean;
  error?: string;
  errorCode?: ErrorCode;
  message?: string;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

function normalizeIp(ip: string | undefined | null): string | null {
  if (!ip) {
    return null;
  }

  let candidate = ip.trim().replace(/^"|"$/g, '');
  if (!candidate) {
    return null;
  }

  const zoneIndex = candidate.indexOf('%');
  if (zoneIndex !== -1) {
    candidate = candidate.slice(0, zoneIndex);
  }

  if (candidate.startsWith('[')) {
    const closingIndex = candidate.indexOf(']');
    if (closingIndex !== -1) {
      candidate = candidate.slice(1, closingIndex);
    }
  }

  const mappedMatch = candidate.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mappedMatch) {
    candidate = mappedMatch[1];
  }

  if (candidate.includes('.') && candidate.includes(':')) {
    const lastColon = candidate.lastIndexOf(':');
    const potential = candidate.slice(0, lastColon);
    if (isIP(potential)) {
      candidate = potential;
    }
  }

  const portMatch = candidate.match(/^(.*):(\d+)$/);
  if (portMatch && isIP(portMatch[1])) {
    candidate = portMatch[1];
  }

  if (!isIP(candidate)) {
    return null;
  }

  return candidate;
}

let cachedTrustedProxies: Set<string> | null = null;
let loggedProxyWarning = false;

function getTrustedProxies(): Set<string> {
  if (cachedTrustedProxies) {
    return cachedTrustedProxies;
  }

  const defaults = ['127.0.0.1', '::1'];
  const configured = process.env.TRUSTED_PROXY_IPS?.split(',') ?? [];
  const invalidEntries: string[] = [];

  const proxies = new Set<string>();
  [...defaults, ...configured].forEach(value => {
    const normalized = normalizeIp(value);
    if (normalized) {
      proxies.add(normalized);
    } else if (value && value.trim()) {
      invalidEntries.push(value.trim());
    }
  });

  if (invalidEntries.length > 0 && !loggedProxyWarning) {
    console.warn(
      `Ignoring invalid TRUSTED_PROXY_IPS entries: ${invalidEntries.join(', ')}`,
    );
    loggedProxyWarning = true;
  }

  cachedTrustedProxies = proxies;
  return proxies;
}

function parseForwardedHeader(value: string): string[] {
  return value
    .split(',')
    .map(part => part.trim())
    .map(part => {
      const match = part.match(/for=(?:"?)([^;",]+)(?:"?)/i);
      return match?.[1];
    })
    .filter((forwarded): forwarded is string => Boolean(forwarded));
}

function getForwardedCandidates(req: NextApiRequest): string[] {
  const candidates: string[] = [];
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    candidates.push(...forwardedFor.split(',').map(ip => ip.trim()));
  } else if (Array.isArray(forwardedFor)) {
    forwardedFor.forEach(value => {
      candidates.push(...value.split(',').map(ip => ip.trim()));
    });
  }

  const forwarded = req.headers.forwarded;
  if (forwarded) {
    const values = Array.isArray(forwarded) ? forwarded : [forwarded];
    values.forEach(value => {
      candidates.push(...parseForwardedHeader(value));
    });
  }

  const singleValueHeaders = [
    'x-real-ip',
    'cf-connecting-ip',
    'true-client-ip',
    'x-client-ip',
  ] as const;

  singleValueHeaders.forEach(header => {
    const value = req.headers[header];
    if (typeof value === 'string') {
      candidates.push(value);
    } else if (Array.isArray(value)) {
      candidates.push(...value);
    }
  });

  return candidates;
}

function getClientIp(req: NextApiRequest): string {
  const trustedProxies = getTrustedProxies();
  const remoteAddress = normalizeIp(req.socket.remoteAddress);

  if (remoteAddress && trustedProxies.has(remoteAddress)) {
    for (const candidate of getForwardedCandidates(req)) {
      const normalized = normalizeIp(candidate);
      if (normalized) {
        return normalized;
      }
    }
  }

  if (remoteAddress) {
    return remoteAddress;
  }

  return 'unknown';
}

function buildAllowedOrigins(): Set<string> {
  const defaults = [
    'https://tactec.club',
    'https://www.tactec.club',
  ];

  const additional = process.env.CONTACT_API_ALLOWED_ORIGINS?.split(',') ?? [];
  const origins = new Set<string>();

  const register = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    try {
      const parsed = new URL(trimmed);
      origins.add(parsed.origin.toLowerCase());
    } catch (error) {
      console.warn(`Ignoring invalid CONTACT_API_ALLOWED_ORIGINS entry: ${trimmed}`);
    }
  };

  [...defaults, ...additional].forEach(register);

  if (process.env.NODE_ENV !== 'production') {
    ['http://localhost:3000', 'http://127.0.0.1:3000'].forEach(register);
  }

  return origins;
}

const allowedOrigins = buildAllowedOrigins();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // CORS Configuration
  const requestOrigin = req.headers.origin;
  const normalizedOrigin = requestOrigin?.toLowerCase();

  if (requestOrigin && normalizedOrigin && allowedOrigins.has(normalizedOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  const existingVary = res.getHeader('Vary');
  const varyHeader = Array.isArray(existingVary) ? existingVary.join(', ') : existingVary;
  res.setHeader('Vary', varyHeader ? `${varyHeader}, Origin` : 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed', errorCode: 'METHOD_NOT_ALLOWED' });
  }

  // Rate Limiting
  const clientIp = getClientIp(req);
  const rateLimitResult = await ratelimit.check(clientIp);

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', rateLimitResult.limit.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimitResult.reset.toString());

  if (!rateLimitResult.success) {
    if (rateLimitResult.reset > Date.now()) {
      const retryAfterSeconds = Math.max(0, Math.ceil((rateLimitResult.reset - Date.now()) / 1000));
      res.setHeader('Retry-After', retryAfterSeconds.toString());
    }

    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      errorCode: 'RATE_LIMITED',
      rateLimit: {
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
      }
    });
  }

  try {
    const data: ContactFormData = contactSchema.parse(req.body);
    
    // Log anonymised submission metadata for operational insight without PII exposure
    console.info('📧 New TACTEC contact form submission received', {
      timestamp: new Date().toISOString(),
      requestType: data.requestType,
      messageLength: data.message.length,
    });

    // In production, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM
    
    // For now, just return success
    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will contact you within 24 hours.',
      rateLimit: {
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
      }
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Please check your form data: ' + error.errors.map(e => e.message).join(', '),
        errorCode: 'VALIDATION_ERROR',
      });
    }

    res.status(500).json({
      error: 'We encountered a technical issue. Please try again or email us directly at info@tactec.club',
      errorCode: 'SERVER_ERROR',
    });
  }
}

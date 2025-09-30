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

interface ApiResponse {
  success?: boolean;
  error?: string;
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

  // Handle IPv6 mapped IPv4 addresses (e.g. ::ffff:127.0.0.1)
  const mappedMatch = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mappedMatch) {
    return mappedMatch[1];
  }

  return ip;
}

function getTrustedProxies(): Set<string> {
  const raw = process.env.TRUSTED_PROXY_IPS;
  const defaults = ['127.0.0.1', '::1'];

  if (!raw) {
    return new Set(defaults);
  }

  return new Set(
    raw
      .split(',')
      .map(value => normalizeIp(value.trim()))
      .filter((value): value is string => Boolean(value)),
  );
}

function getClientIp(req: NextApiRequest): string {
  const trustedProxies = getTrustedProxies();
  const remoteAddress = normalizeIp(req.socket.remoteAddress);

  if (remoteAddress && trustedProxies.has(remoteAddress)) {
    const forwarded = req.headers['x-forwarded-for'];
    const candidates: string[] = [];

    if (typeof forwarded === 'string') {
      candidates.push(...forwarded.split(',').map(ip => ip.trim()));
    } else if (Array.isArray(forwarded)) {
      candidates.push(...forwarded.flatMap(value => value.split(',')).map(ip => ip.trim()));
    }

    const realIp = candidates.find(ip => isIP(ip));
    if (realIp) {
      return normalizeIp(realIp) ?? 'unknown';
    }

    const realIpHeader = normalizeIp(Array.isArray(req.headers['x-real-ip']) ? req.headers['x-real-ip'][0] : req.headers['x-real-ip']);
    if (realIpHeader) {
      return realIpHeader;
    }
  }

  if (remoteAddress) {
    return remoteAddress;
  }

  return 'unknown';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // CORS Configuration
  const allowedOrigins = [
    'https://tactec.club',
    'https://www.tactec.club',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
  ];

  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting
  const clientIp = getClientIp(req);
  const rateLimitResult = await ratelimit.check(clientIp);
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', rateLimitResult.limit.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimitResult.reset.toString());
  
  if (!rateLimitResult.success) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
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
        error: 'Please check your form data: ' + error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({ 
      error: 'We encountered a technical issue. Please try again or email us directly at info@tactec.club' 
    });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ratelimit } from '@/lib/ratelimit';

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

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress;
  return ip || 'unknown';
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

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting
  const clientIp = getClientIp(req);
  const rateLimitResult = ratelimit.check(clientIp);
  
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
    
    // Log the submission
    console.log('📧 New TACTEC contact form submission:', {
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      club: data.club,
      role: data.role,
      requestType: data.requestType,
      messagePreview: data.message.substring(0, 100) + (data.message.length > 100 ? '...' : ''),
      ip: clientIp,
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

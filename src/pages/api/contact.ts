import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

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
}

// Rate limiting store (in-memory - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
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
  if (!rateLimit(clientIp)) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.' 
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

    // Send notification email
    await sendEmailNotification(data);

    // Save to database/file
    await saveSubmission(data, clientIp);

    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will contact you within 24 hours.' 
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

async function sendEmailNotification(data: ContactFormData): Promise<void> {
  const emailSubject = `🏆 TACTEC ${data.requestType.charAt(0).toUpperCase() + data.requestType.slice(1)} Request - ${data.name}`;
  
  const emailBody = `
New TACTEC Contact Form Submission
=================================

Contact Details:
- Name: ${data.name}
- Email: ${data.email}
- Club/Organization: ${data.club}
- Role: ${data.role}
- Request Type: ${data.requestType.toUpperCase()}

Message:
${data.message}

Submission Details:
- Date: ${new Date().toLocaleDateString()}
- Time: ${new Date().toLocaleTimeString()}
- Environment: ${process.env.NODE_ENV}

---
Reply directly to: ${data.email}
  `.trim();

  if (process.env.NODE_ENV === 'development') {
    console.log('\n' + '='.repeat(50));
    console.log('📨 EMAIL NOTIFICATION');
    console.log('='.repeat(50));
    console.log('To: info@tactec.club');
    console.log('Subject:', emailSubject);
    console.log('\n' + emailBody);
    console.log('='.repeat(50) + '\n');
  }

  // TODO: Implement actual email sending in production
  // Example with Resend:
  // if (process.env.NODE_ENV === 'production' && process.env.RESEND_API_KEY) {
  //   const response = await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       from: 'TACTEC Website <noreply@tactec.club>',
  //       to: 'info@tactec.club',
  //       subject: emailSubject,
  //       text: emailBody,
  //       reply_to: data.email,
  //     }),
  //   });
  //   if (!response.ok) {
  //     throw new Error(`Email service error: ${response.status}`);
  //   }
  // }
}

async function saveSubmission(data: ContactFormData, ip: string): Promise<void> {
  const submission = {
    ...data,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    status: 'new',
    source: 'website_contact_form',
    ip,
  };

  try {
    if (process.env.NODE_ENV === 'development') {
      const fs = require('fs');
      const path = require('path');
      
      const submissionsFile = path.join(process.cwd(), 'contact-submissions.json');
      let submissions = [];
      
      try {
        const existingData = fs.readFileSync(submissionsFile, 'utf8');
        submissions = JSON.parse(existingData);
      } catch (e) {
        // File doesn't exist or is empty
      }
      
      submissions.push(submission);
      fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
      console.log(`💾 Submission saved to ${submissionsFile}`);
    }

    // TODO: Save to production database
  } catch (error) {
    console.error('Failed to save submission:', error);
  }
}

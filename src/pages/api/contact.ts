import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  club: z.string().min(2),
  role: z.string().min(1),
  message: z.string().min(10),
  requestType: z.enum(['demo', 'sales', 'support', 'general']),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data: ContactFormData = contactSchema.parse(req.body);
    
    // Log the submission (in production, send actual email)
    console.log('📧 New contact form submission:', {
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      club: data.club,
      role: data.role,
      requestType: data.requestType,
      message: data.message.substring(0, 100) + '...',
    });

    // TODO: Replace this with actual email service integration
    await sendEmailNotification(data);

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid form data: ' + error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}

// Email notification function
async function sendEmailNotification(data: ContactFormData): Promise<void> {
  const emailBody = `
🏆 TACTEC Contact Form Submission

👤 Contact Information:
   • Name: ${data.name}
   • Email: ${data.email}
   • Club: ${data.club}
   • Role: ${data.role}

📋 Request Type: ${data.requestType.toUpperCase()}

💬 Message:
${data.message}

🕐 Submitted: ${new Date().toLocaleString()}
---
Reply to: ${data.email}
  `.trim();

  // Option A: Console log for development (replace in production)
  console.log('📨 Email notification:', emailBody);

  // Option B: Integration with email service (uncomment and configure)
  /*
  try {
    // Example with fetch to email service
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TACTEC Website <noreply@tactec.club>',
        to: 'info@tactec.club',
        subject: `TACTEC ${data.requestType.charAt(0).toUpperCase() + data.requestType.slice(1)} Request - ${data.name}`,
        text: emailBody,
        reply_to: data.email,
      }),
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
  */

  // Option C: Save to database (implement if needed)
  /*
  await saveToDatabase({
    ...data,
    timestamp: new Date(),
    status: 'new',
  });
  */
}

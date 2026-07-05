import { BrevoClient } from "@getbrevo/brevo";

export async function sendOTPEmail(email, code) {
  const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

  await client.transactionalEmails.sendTransacEmail({
    sender: { name: "Magna", email: "msa.juggernaut@gmail.com" },
    to: [{ email }],
    subject: "Your Magna verification code",
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">MAGNA</span>
        </div>
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
          Enter this code to verify your email. It expires in 10 minutes.
        </p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; font-family: monospace;">${code}</span>
        </div>
        <p style="color: #9ca3af; font-size: 12px;">
          If you didn't create a Magna account, ignore this email.
        </p>
      </div>
    `,
  });
}
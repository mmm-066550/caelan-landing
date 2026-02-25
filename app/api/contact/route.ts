import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.ZOHO_SMTP_PORT) || 465,
      secure: true, // SSL
      auth: {
        user: process.env.ZOHO_MAIL_USER,
        pass: process.env.ZOHO_MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Caelan Contact Form" <${process.env.ZOHO_MAIL_USER}>`,
      to: process.env.ZOHO_MAIL_TO || process.env.ZOHO_MAIL_USER,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0B2230; border-bottom: 2px solid #0B2230; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td>
              <td style="padding: 8px 0; color: #555;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 8px 0; color: #555;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Company:</td>
              <td style="padding: 8px 0; color: #555;">${company || "N/A"}</td>
            </tr>
          </table>
          <div style="margin-top: 20px;">
            <h3 style="color: #0B2230;">Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #999;">
            This email was sent from the Caelan website contact form.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully." });
  } catch (error: any) {
    console.error("Zoho Mail error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}

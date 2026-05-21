import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Simple validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all fields (name, email, message)." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Save to local messages.json for persistence (Always do this as backup!)
    const messagesFilePath = path.join(process.cwd(), "messages.json");
    let messages = [];
    if (fs.existsSync(messagesFilePath)) {
      try {
        const fileContent = fs.readFileSync(messagesFilePath, "utf-8");
        messages = JSON.parse(fileContent);
      } catch (err) {
        console.error("Failed to read messages.json, starting fresh", err);
      }
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");
    console.log("Contact form message saved successfully to local messages.json:", newMessage);

    // Gmail Sending Logic
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || gmailUser;

    if (!gmailUser || !gmailAppPassword) {
      console.warn("WARNING: GMAIL_USER or GMAIL_APP_PASSWORD is not set in environment variables. Email was not sent.");
      return NextResponse.json(
        { 
          success: true, 
          isSimulated: true,
          message: "Message saved locally! To send real emails, please configure GMAIL_USER and GMAIL_APP_PASSWORD in your .env.local file. Check .env.example for details." 
        },
        { status: 200 }
      );
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Premium aerospace/UAV styled dark theme HTML email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Portfolio Message</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0f19;
              color: #f3f4f6;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #111827;
              border: 1px solid rgba(0, 212, 255, 0.25);
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 212, 255, 0.05);
            }
            .header {
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              border-bottom: 2px solid #00d4ff;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              color: #ffffff;
              letter-spacing: 1px;
            }
            .header p {
              margin: 8px 0 0 0;
              font-size: 13px;
              color: #00d4ff;
              text-transform: uppercase;
              font-weight: 600;
              letter-spacing: 2px;
            }
            .content {
              padding: 40px 30px;
            }
            .field-group {
              margin-bottom: 25px;
            }
            .field-label {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #00d4ff;
              margin-bottom: 6px;
              font-weight: bold;
            }
            .field-value {
              font-size: 16px;
              color: #f3f4f6;
              line-height: 1.5;
            }
            .message-box {
              background-color: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 8px;
              padding: 20px;
              font-size: 15px;
              line-height: 1.6;
              color: #e5e7eb;
              white-space: pre-wrap;
            }
            .footer {
              background-color: #0f172a;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              padding: 20px 30px;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
            }
            .footer a {
              color: #00d4ff;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Portfolio Connection</h1>
              <p>Autonomous UAV & Robotics Portfolio</p>
            </div>
            <div class="content">
              <div class="field-group">
                <div class="field-label">Sender Name</div>
                <div class="field-value" style="font-weight: 600;">${name}</div>
              </div>
              <div class="field-group">
                <div class="field-label">Sender Email</div>
                <div class="field-value">
                  <a href="mailto:${email}" style="color: #00d4ff; text-decoration: none;">${email}</a>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Message Content</div>
                <div class="message-box">${message}</div>
              </div>
            </div>
            <div class="footer">
              <p>Sent from your portfolio website on ${new Date().toLocaleString()}</p>
              <p>&copy; ${new Date().getFullYear()} Md Kaif Nezami. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email
    await transporter.sendMail({
      from: `"${name} (Portfolio)" <${gmailUser}>`, // Gmail overrides from address to authenticated user anyway, but this is clean
      to: receiverEmail,
      replyTo: email,
      subject: `🛸 Portfolio Contact Form: Message from ${name}`,
      text: `New message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: emailHtml,
    });

    console.log("Email sent successfully to:", receiverEmail);

    return NextResponse.json(
      { success: true, message: "Thank you! Your message has been sent directly to Md Kaif Nezami's Gmail successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email via Gmail SMTP:", error);
    
    // Provide a super clean and descriptive error details for common Gmail SMTP failures (e.g. auth issues)
    let errorMessage = "Failed to send email. Please try again later.";
    if (error.code === "EAUTH") {
      errorMessage = "Gmail Authentication Failed. Please check your GMAIL_APP_PASSWORD in .env.local.";
    }

    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
}

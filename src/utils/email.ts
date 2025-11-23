import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE } =
    process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    console.warn("SMTP not fully configured; payload:", payload);
    return { sent: false, error: "Missing SMTP environment variables" };
  }

  const secure =
    typeof SMTP_SECURE === "string"
      ? SMTP_SECURE.toLowerCase() === "true"
      : Number(SMTP_PORT) === 465;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: payload.to,
      subject: payload.subject,
      text: payload.text || "",
      html: payload.html,
    });
    return { sent: true };
  } catch (error: any) {
    console.error("Failed to send email via SMTP", error?.message || error);
    return { sent: false, error: error?.message || "Email send failed" };
  }
}

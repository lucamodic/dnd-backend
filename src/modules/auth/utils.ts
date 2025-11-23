import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/email";

const DEFAULT_VERIFICATION_HOURS = Number(
  process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS || 24
);

const buildVerificationCopy = (expiresInHours: number) => {
  const enHoursUnit = expiresInHours === 1 ? "hour" : "hours";
  const esHoursUnit = expiresInHours === 1 ? "hora" : "horas";

  return {
    en: {
      subject: "Confirm your account",
      greeting: "Welcome to the Guild Masters' Realm",
      intro:
        "Before you can roll initiative, confirm your email address so we know it's really you.",
      cta: "Verify email",
      expires: `This enchanted link will vanish in ${expiresInHours} ${enHoursUnit}.`,
      fallback: "If the button does not work, copy and paste this link:",
    },
    es: {
      subject: "Confirma tu cuenta",
      greeting: "Bienvenido al Reino de Maestros del Gremio",
      intro:
        "Antes de tirar iniciativa, confirma tu correo electronico para que sepamos que realmente eres tu.",
      cta: "Verificar correo",
      expires: `Este enlace encantado desaparecera en ${expiresInHours} ${esHoursUnit}.`,
      fallback: "Si el boton no funciona, copia y pega este enlace:",
    },
  } as const;
};

const verificationCopy = buildVerificationCopy(DEFAULT_VERIFICATION_HOURS);
type SupportedLanguage = keyof typeof verificationCopy;
const SUPPORTED_LANGUAGES = Object.keys(
  verificationCopy
) as SupportedLanguage[];
const FALLBACK_LANGUAGE: SupportedLanguage = "en";

export const resolveLanguage = (
  language?: string | null
): SupportedLanguage => {
  if (!language) return FALLBACK_LANGUAGE;
  const normalized = language.toLowerCase();
  const exactMatch = SUPPORTED_LANGUAGES.find((code) => normalized === code);
  if (exactMatch) return exactMatch;
  const prefixMatch = SUPPORTED_LANGUAGES.find((code) =>
    normalized.startsWith(code)
  );
  return prefixMatch || FALLBACK_LANGUAGE;
};

export const buildFrontBaseUrl = () => {
  const configured = process.env.FRONT_URL;
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
};

const resolveFrontAsset = (assetPath: string) => {
  const base = buildFrontBaseUrl();
  const normalizedAsset = assetPath.startsWith("/")
    ? assetPath
    : `/${assetPath}`;
  return `${base}${normalizedAsset}`;
};

export const buildVerificationUrl = (token: string) => {
  return `${buildFrontBaseUrl()}/auth/verify?token=${token}`;
};

export const buildTokens = (id: string) => {
  const secret = process.env.JWT_SECRET || "";
  const token = jwt.sign({ id }, secret, { expiresIn: "1d" });
  const refreshToken = jwt.sign({ id }, secret, { expiresIn: "7d" });
  return { token, refreshToken };
};

export const hashPassword = async (password: string) => {
  const secret = process.env.SECRET || "";
  const saltRounds = 10;
  return bcrypt.hash(password + secret, saltRounds);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
) => {
  const secret = process.env.SECRET || "";
  return bcrypt.compare(password + secret, hashedPassword);
};

export const generateVerificationMetadata = (
  expiresInHours = DEFAULT_VERIFICATION_HOURS
) => {
  const verificationToken = crypto.randomBytes(24).toString("hex");
  const email_verification_expires_at = new Date(
    Date.now() + expiresInHours * 60 * 60 * 1000
  ).toISOString();

  return { verificationToken, email_verification_expires_at };
};

const buildVerificationEmailHtml = (
  language: SupportedLanguage,
  verificationUrl: string
) => {
  const copy =
    verificationCopy[language] || verificationCopy[FALLBACK_LANGUAGE];
  const primaryBg = resolveFrontAsset("/bg.jpg");
  const secondaryBg = resolveFrontAsset("/bg2.jpg");

  return `
  <!DOCTYPE html>
  <html lang="${language}">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${copy.subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0b0b0f;
          font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
          color: #f8f9fc;
        }
        .viewport {
          width: 100%;
          background-image: linear-gradient(135deg, rgba(11,11,15,0.95), rgba(44,17,28,0.9)), url('${primaryBg}');
          background-size: cover;
          background-position: center;
          padding: 48px 12px;
          display: flex;
          justify-content: center;
        }
        .card {
          max-width: 640px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 80px rgba(0,0,0,0.65);
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(135deg, rgba(15,15,20,0.9), rgba(28,13,31,0.85));
        }
        .split {
          display: flex;
          flex-wrap: wrap;
        }
        .panel {
          padding: 32px;
          flex: 1 1 300px;
          color: #f1ecff;
        }
        .panel--overlay {
          background-image: linear-gradient(160deg, rgba(172,57,81,0.85), rgba(255,208,122,0.25)), url('${secondaryBg}');
          background-size: cover;
          background-position: center;
          text-align: center;
          color: #fff4d6;
        }
        .panel--info {
          text-align: center;
          background: rgba(10,9,14,0.7);
        }
        .title {
          font-size: 28px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-family: "Uncial Antiqua", "Cinzel", serif;
        }
        .message {
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 24px;
          color: #e0d6ff;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          border-radius: 999px;
          background: linear-gradient(135deg, #d7263d, #f4a259);
          color: #fff !important;
          text-decoration: none !important;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.08em;
        }
        .meta {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          margin-top: 24px;
        }
        .fallback {
          margin-top: 16px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          word-break: break-all;
          font-size: 12px;
          color: #f6f2ff;
          border: 1px solid rgba(255,255,255,0.08);
        }
      </style>
    </head>
    <body>
      <div class="viewport">
        <div class="card">
          <div class="split">
            <div class="panel panel--overlay">
              <div class="title">${copy.greeting}</div>
              <div class="message">${copy.intro}</div>
              <a href="${verificationUrl}" class="button">${copy.cta}</a>
              <div class="meta">${copy.expires}</div>
            </div>
            <div class="panel panel--info">
              <div class="title" style="font-size:22px;margin-bottom:16px;color:#f8f8ff;">${copy.subject}</div>
              <p class="message" style="color:#d9dbf1;margin-bottom:12px;">${copy.fallback}</p>
              <div class="fallback">${verificationUrl}</div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
};

export const buildVerificationEmailPayload = (
  language: SupportedLanguage,
  verificationUrl: string
) => {
  const copy =
    verificationCopy[language] || verificationCopy[FALLBACK_LANGUAGE];
  const html = buildVerificationEmailHtml(language, verificationUrl);
  const text = `${copy.greeting}\n\n${copy.intro}\n${verificationUrl}\n\n${copy.expires}`;
  return {
    subject: copy.subject,
    html,
    text,
  };
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
  language?: string | null
) => {
  const normalizedLanguage = resolveLanguage(language);
  const verificationUrl = buildVerificationUrl(token);
  const content = buildVerificationEmailPayload(
    normalizedLanguage,
    verificationUrl
  );

  const result = await sendEmail({
    to: email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (!result.sent) {
    throw {
      status: 502,
      error: `Failed to send verification email: ${result.error}`,
    };
  }

  return result;
};

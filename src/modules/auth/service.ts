import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Repository } from "./repository";
import { IUser } from "../../db/models/User";
import { sendEmail } from "../../utils/email";

type ServiceResponse = { status: number; error?: string; data?: any };
type RefreshTokenResponse = { token: string; refreshToken: string };

export class Service {
  static async post(data: IUser): Promise<ServiceResponse | RefreshTokenResponse> {
    try {
      if (data.refreshToken) return this.refreshToken(data.refreshToken);

      const hasIdentifier = data.username || data.email;
      if (!hasIdentifier) {
        throw { error: "username or email is required", status: 400 };
      }

      const user = data.email
        ? await Repository.getByEmail(data.email)
        : await Repository.getByUsername(data.username || "");
      if (!user || "error" in user) {
        throw { error: "Invalid credentials", status: 400 };
      }

      if (!user.email_verified) {
        throw { error: "Email not verified", status: 403 };
      }

      if (!(await this.comparePasswords(data.password || "", user?.password || ""))) {
        throw { error: "Invalid credentials", status: 400 };
      }

      const tokens = this.buildTokens(user.id as string);
      return { status: 200, data: tokens };
    } catch (error: any) {
      return "status" in error ? error : { status: 400, error: "Authentication failed" };
    }
  }

  static async signup(data: IUser): Promise<ServiceResponse> {
    try {
      const { username, email, password } = data;
      if (!username || !email || !password) {
        throw { status: 400, error: "username, email and password are required" };
      }

      const existingByUsername = await Repository.getByUsername(username);
      if (existingByUsername && !("error" in existingByUsername)) {
        throw { status: 409, error: "Username already in use" };
      }

      const existingByEmail = await Repository.getByEmail(email);
      if (existingByEmail && !("error" in existingByEmail)) {
        throw { status: 409, error: "Email already in use" };
      }

      const hashedPassword = await this.hashPassword(password);
      const verificationToken = crypto.randomBytes(24).toString("hex");
      const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const payload: IUser = {
        username,
        email,
        password: hashedPassword,
        role: "user",
        email_verified: false,
        email_verification_token: verificationToken,
        email_verification_expires_at: verificationExpiresAt,
      };

      const created = await Repository.createUser(payload);
      if ("error" in created) {
        throw { status: created.status ?? 400, error: created.error };
      }

      await this.sendVerificationEmail(email, verificationToken);

      return {
        status: 201,
        data: {
          message: "User created. Check your email to verify the account.",
        },
      };
    } catch (error: any) {
      return "status" in error ? error : { status: 400, error: "Signup failed" };
    }
  }

  static async sendVerificationEmail(email: string, token: string) {
    const baseUrl = process.env.FRONT_URL;
    const url = baseUrl
      ? `${baseUrl.replace(/\/$/, "")}/auth/confirm?token=${token}`
      : `http://localhost:3000/auth/confirm?token=${token}`;

    const subject = "Confirm your account";
    const html = `<p>Hi!</p><p>Click to verify your email: <a href="${url}">${url}</a></p>`;

    const result = await sendEmail({ to: email, subject, html, text: `Verify your email: ${url}` });
    if (!result.sent) {
      throw { status: 502, error: `Failed to send verification email: ${result.error}` };
    }

    return result;
  }

  static async verifyEmail(token: string): Promise<ServiceResponse> {
    try {
      if (!token) {
        throw { status: 400, error: "Verification token is required" };
      }

      const user = await Repository.getByVerificationToken(token);
      if (!user || "error" in user) {
        throw { status: 404, error: "Invalid verification token" };
      }

      const expiresAt = user.email_verification_expires_at
        ? new Date(user.email_verification_expires_at)
        : null;
      if (expiresAt && expiresAt.getTime() < Date.now()) {
        throw { status: 410, error: "Verification token has expired" };
      }

      const updated = await Repository.updateUser(
        { id: user.id },
        {
          email_verified: true,
          email_verification_token: null,
          email_verification_expires_at: null,
        }
      );

      if ("error" in updated) {
        throw { status: updated.status ?? 400, error: updated.error };
      }

      const tokens = this.buildTokens(user.id as string);
      return {
        status: 200,
        data: {
          message: "Email verified",
          ...tokens,
        },
      };
    } catch (error: any) {
      return "status" in error ? error : { status: 400, error: "Email verification failed" };
    }
  }

  static buildTokens(id: string) {
    const token = jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: "7d" });
    return { token, refreshToken };
  }

  static async hashPassword(password: string) {
    const secret = process.env.SECRET || "";
    const saltRounds = 10;
    return await bcrypt.hash(password + secret, saltRounds);
  }

  static async comparePasswords(password: string, hashedPassword: string) {
    const secret = process.env.SECRET || "";
    return await bcrypt.compare(password + secret, hashedPassword);
  }

  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse | ServiceResponse> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || "") as jwt.JwtPayload;
      return this.buildTokens(decoded.id as string);
    } catch (error) {
      return { error: (error as Error).message, status: 401 };
    }
  }
}

import { Repository } from "./repository";
import { IUser } from "../../db/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type AuthError = { status: number; error: string };
type AuthSuccess = {
  status: number;
  data: { token: string; refreshToken: string };
};
type RefreshTokenResponse = { token: string; refreshToken: string };
type AuthResponse = AuthError | AuthSuccess | RefreshTokenResponse;

export class Service {
  static async post(data: IUser): Promise<AuthResponse> {
    try {
      if (data.refreshToken) return this.refreshToken(data.refreshToken);

      const user = await Repository.getByUsername(data.username || "");
      if (!user || "error" in user)
        throw { error: "Credenciales incorrectas", status: 400 };

      if (
        !(await this.comparePasswords(
          data.password || "",
          user?.password || ""
        ))
      )
        throw { error: "Credenciales incorrectas", status: 400 };

      const token = jwt.sign({ id: user?.id }, process.env.JWT_SECRET || "", {
        expiresIn: "1d",
      });
      const refreshToken = jwt.sign(
        { id: user?.id },
        process.env.JWT_SECRET || "",
        { expiresIn: "7d" }
      );

      return { status: 200, data: { token, refreshToken } };
    } catch (error: any) {
      return "status" in error
        ? error
        : { status: 400, error: "Autenticación fallida" };
    }
  }

  static async comparePasswords(password: string, hashedPassword: string) {
    const secret = process.env.SECRET || "";
    return await bcrypt.compare(password + secret, hashedPassword);
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET || ""
      ) as jwt.JwtPayload;
      const token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET || "", {
        expiresIn: "1d",
      });
      const newRefreshToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET || "",
        { expiresIn: "7d" }
      );
      return { token, refreshToken: newRefreshToken };
    } catch (error) {
      return { error: (error as Error).message, status: 401 };
    }
  }
}

import type { JwtPayload } from "../../types/auth.types.js";

export interface TokenService {
    sign(payload: JwtPayload): Promise<string>;
    verify(token: string): Promise<JwtPayload | null>;
}

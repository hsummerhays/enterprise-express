import { SignJWT, jwtVerify } from "jose";
import type { TokenService } from "../../application/ports/TokenService.js";
import type { JwtPayload } from "../../types/auth.types.js";
import config from "../../utils/config.js";

export class JoseTokenService implements TokenService {
    private readonly secret: Uint8Array;

    constructor() {
        this.secret = new TextEncoder().encode(config.auth.jwtSecret);
    }

    async sign(payload: JwtPayload): Promise<string> {
        return new SignJWT({ ...payload })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(this.secret);
    }

    async verify(token: string): Promise<JwtPayload | null> {
        try {
            const { payload } = await jwtVerify(token, this.secret);
            return payload as unknown as JwtPayload;
        } catch {
            return null;
        }
    }
}

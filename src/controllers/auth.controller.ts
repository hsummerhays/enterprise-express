import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        const { email, password } = req.body;

        const result = await this.authService.login(email, password);

        if (!result) {
            return res.status(401).json((res.locals as any).ApiResponse.error('Invalid email or password', 401));
        }

        return res.status(200).json((res.locals as any).ApiResponse.success(result, 'Login successful'));
    };
}

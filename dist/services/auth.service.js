import jwt from 'jsonwebtoken';
import config from '../utils/config.js';
export class AuthService {
    async login(email, password) {
        // Mock authentication logic
        if (email === 'admin@example.com' && password === 'P@ssword123') {
            const user = { id: 1, email: 'admin@example.com', role: 'admin' };
            const token = jwt.sign(user, config.auth.jwtSecret, { expiresIn: '1h' });
            return { user, token };
        }
        return null;
    }
}

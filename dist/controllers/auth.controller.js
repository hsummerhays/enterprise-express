export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login = async (req, res) => {
        const { email, password } = req.body;
        const result = await this.authService.login(email, password);
        if (!result) {
            return res.status(401).json(res.locals.ApiResponse.error('Invalid email or password', 401));
        }
        return res.status(200).json(res.locals.ApiResponse.success(result, 'Login successful'));
    };
}

import jwt from 'jsonwebtoken';
import { User } from '../schemas/user.schema.js';
import { ApiError } from '../common/error.js';
import { env } from '../config/env.js';
import type { RegisterDTO, LoginDTO, JwtPayload, AuthTokenResponse, UserRole } from '../types/index.js';


export const authService = {

  // regitster a new user
  async register(dto: RegisterDTO): Promise<AuthTokenResponse> {
    const existing = await User.findOne({ email: dto.email.toLowerCase() });
    if (existing) throw new ApiError(409, 'Email already in use');

    const user = await User.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
    });

    const token = signToken(user._id.toString(), user.role);

    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  // login
  async login(dto: LoginDTO): Promise<AuthTokenResponse> {
    const user = await User.findOne({ email: dto.email.toLowerCase() }).select('+password');
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const valid = await user.comparePassword(dto.password);
    if (!valid) throw new ApiError(401, 'Invalid email or password');

    const token = signToken(user._id.toString(), user.role);

    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  // get current user
  async me(userId: string) {
    const user = await User.findById(userId).lean();
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  },
};



function signToken(userId: string, role: UserRole): string {
  const payload: JwtPayload = { userId, role };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

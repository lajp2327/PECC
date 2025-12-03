import jwt from 'jsonwebtoken';
import { Customer } from '../../domain/entities/Customer';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const TOKEN_EXPIRATION = '1h';

export class AuthService {
  // In production, validate password hash using a secure password hasher (e.g., bcrypt).
  async login(user: Customer): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.fullName,
      // Future compatibility: include Azure AD B2C objectId once available
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
  }
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

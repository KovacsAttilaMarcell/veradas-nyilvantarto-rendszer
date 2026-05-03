import { expressjwt } from 'express-jwt';

const JWT_SECRET = 'very_secret_key';

export const protectRoutes = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
});
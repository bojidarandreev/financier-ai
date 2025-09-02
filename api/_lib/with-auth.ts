import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyJwt } from '../../src/lib/jwt';

// Define a custom request type that includes the user payload
export interface AuthenticatedRequest extends VercelRequest {
  user: {
    userId: string;
  };
}

type AuthenticatedApiHandler = (req: AuthenticatedRequest, res: VercelResponse) => Promise<void> | void;

// This is our higher-order function
export const withAuth = (handler: AuthenticatedApiHandler) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decoded = verifyJwt(token);

      if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      // Attach user information to the request object
      (req as AuthenticatedRequest).user = { userId: decoded.userId as string };

      return await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

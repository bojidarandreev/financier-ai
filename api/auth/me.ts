import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../_lib/with-auth';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  // If withAuth middleware passes, the user is authenticated.
  // We can return some user data here if we want.
  res.status(200).json({ user: { id: req.user.userId } });
};

export default withAuth(handler);

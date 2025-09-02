import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../_lib/with-auth';
import prisma from '../../lib/db';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid account ID' });
  }

  if (req.method === 'PUT') {
    const { name, institution, currency, type } = req.body;
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: { name, institution, currency, type },
    });
    return res.status(200).json(updatedAccount);
  }

  if (req.method === 'DELETE') {
    await prisma.account.delete({
      where: { id },
    });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default withAuth(handler);

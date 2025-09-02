import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../_lib/with-auth';
import prisma from '../../lib/db';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const accounts = await prisma.account.findMany();
    return res.status(200).json(accounts);
  }

  if (req.method === 'POST') {
    const { name, institution, currency, type } = req.body;
    if (!name || !currency || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newAccount = await prisma.account.create({
      data: { name, institution, currency, type },
    });
    return res.status(201).json(newAccount);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default withAuth(handler);

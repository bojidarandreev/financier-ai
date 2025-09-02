import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../_lib/with-auth';
import prisma from '../../lib/db';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  }

  if (req.method === 'POST') {
    const { name, icon, color } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Missing required field: name' });
    }
    const newCategory = await prisma.category.create({
      data: { name, icon, color },
    });
    return res.status(201).json(newCategory);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default withAuth(handler);

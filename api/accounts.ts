import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from './_lib/with-auth';
import prisma from '../src/lib/db';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const accounts = await prisma.account.findMany();
    return res.status(200).json(accounts);
  }

  if (req.method === 'POST') {
    const { name, institution, currency, type } = req.body;
    const newAccount = await prisma.account.create({
      data: { name, institution, currency, type },
    });
    return res.status(201).json(newAccount);
  }
  
  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'Account ID is required' });
    const { name, institution, currency, type } = req.body;
    const updatedAccount = await prisma.account.update({
      where: { id: id as string },
      data: { name, institution, currency, type },
    });
    return res.status(200).json(updatedAccount);
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'Account ID is required' });
    await prisma.account.delete({ where: { id: id as string } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default withAuth(handler);

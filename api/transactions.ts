import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from './_lib/with-auth';
import prisma from '../src/lib/db';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (id) {
      // Get single transaction
      const transaction = await prisma.transaction.findUnique({ where: { id: id as string } });
      return res.status(200).json(transaction);
    } else {
      // Get all transactions
      const transactions = await prisma.transaction.findMany({ include: { category: true, account: true } });
      return res.status(200).json(transactions);
    }
  }

  if (req.method === 'POST') {
    const { accountId, categoryId, amount, date, description, note } = req.body;
    const newTransaction = await prisma.transaction.create({
      data: { accountId, categoryId, amount: parseFloat(amount), date: new Date(date), description, note },
    });
    return res.status(201).json(newTransaction);
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'Transaction ID is required' });
    const { accountId, categoryId, amount, date, description, note } = req.body;
    const updatedTransaction = await prisma.transaction.update({
      where: { id: id as string },
      data: { accountId, categoryId, amount: amount ? parseFloat(amount) : undefined, date: date ? new Date(date) : undefined, description, note },
    });
    return res.status(200).json(updatedTransaction);
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'Transaction ID is required' });
    await prisma.transaction.delete({ where: { id: id as string } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default withAuth(handler);

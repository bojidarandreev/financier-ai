import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../_lib/with-auth';
import prisma from '../../lib/db';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid transaction ID' });
  }

  if (req.method === 'GET') {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: { category: true, account: true },
      });
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      return res.status(200).json(transaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching transaction' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { accountId, categoryId, amount, date, description, note } = req.body;
      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: {
          accountId,
          categoryId,
          amount: amount ? parseFloat(amount) : undefined,
          date: date ? new Date(date) : undefined,
          description,
          note,
        },
      });
      return res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating transaction' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.transaction.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting transaction' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default withAuth(handler);

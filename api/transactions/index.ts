import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../_lib/with-auth';
import prisma from '../../lib/db';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  // The user ID is available on req.user.userId thanks to the withAuth middleware
  // For now, I'm not scoping data to the user, but this is where you would.
  // I will add user scoping later. For now, I'll just return all transactions.

  if (req.method === 'GET') {
    try {
      const transactions = await prisma.transaction.findMany({
        include: {
          category: true,
          account: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
      return res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching transactions' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { accountId, categoryId, amount, date, description, note } = req.body;
      
      if (!accountId || !amount || !date || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newTransaction = await prisma.transaction.create({
        data: {
          accountId,
          categoryId,
          amount: parseFloat(amount),
          date: new Date(date),
          description,
          note,
        },
      });
      return res.status(201).json(newTransaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating transaction' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default withAuth(handler);

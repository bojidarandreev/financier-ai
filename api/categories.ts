import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from './_lib/with-auth';
import prisma from '../src/lib/db';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  }

  if (req.method === 'POST') {
    const { name, icon, color } = req.body;
    const newCategory = await prisma.category.create({
      data: { name, icon, color },
    });
    return res.status(201).json(newCategory);
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'Category ID is required' });
    const { name, icon, color } = req.body;
    const updatedCategory = await prisma.category.update({
      where: { id: id as string },
      data: { name, icon, color },
    });
    return res.status(200).json(updatedCategory);
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'Category ID is required' });
    await prisma.category.delete({ where: { id: id as string } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default withAuth(handler);

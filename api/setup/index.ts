import { VercelRequest, VercelResponse } from '@vercel/node';
import { execSync } from 'child_process';
import prisma from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // This is a simplified check. In a real app, you'd want a more robust
    // way to prevent this from being run multiple times in production.
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return res.status(400).json({ message: 'Database already seeded.' });
    }

    // 1. Push the schema to the database
    // Note: Vercel's build process runs `prisma generate`, but `db push` is needed
    // to actually create the tables. This is a common pattern for initial setup.
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

    // 2. Seed the user
    const email = 'bojidarandreev@gmail.com';
    const password = '1234@Batman';
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    
    // Seed some initial data for other models
    const account = await prisma.account.create({
      data: {
        name: 'Main Chequing',
        currency: 'CAD',
        institution: 'CIBC',
        type: 'chequing'
      }
    });
    
    const category = await prisma.category.create({
      data: {
        name: 'Groceries',
        icon: 'ShoppingCart',
        color: '#FFD700'
      }
    });
    
    await prisma.transaction.create({
      data: {
        accountId: account.id,
        categoryId: category.id,
        amount: 125.50,
        date: new Date(),
        description: 'Weekly Groceries'
      }
    });

    res.status(200).json({ message: 'Database setup and seeded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during database setup.', error: (error as Error).message });
  }
}

import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/db';
import bcrypt from 'bcryptjs';
import { signJwt } from '../../lib/jwt';
import { setCookie } from '../../lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signJwt({ userId: user.id, email: user.email });
    setCookie(res, 'auth_token', token);

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
}

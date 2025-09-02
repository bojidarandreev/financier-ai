import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../_lib/with-auth';
import prisma from '../../lib/db';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const transactions = await prisma.transaction.findMany({
      select: {
        amount: true,
        description: true,
        date: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 100, // Limit to the last 100 transactions for the prompt
    });

    if (transactions.length === 0) {
      return res.status(200).json({ advice: "There's not enough data to provide any advice. Start by adding some transactions!" });
    }

    const simplifiedTransactions = transactions.map(t => ({
      amount: t.amount,
      category: t.category?.name || 'Uncategorized',
      date: t.date.toISOString().split('T')[0],
    }));

    const prompt = `
      You are a friendly and insightful financial advisor.
      Analyze the following list of recent transactions and provide actionable advice.
      Be concise, helpful, and encouraging. Identify potential savings, comment on spending habits, and offer suggestions for improvement.
      Format your response as a simple JSON object with a single key "advice" which is a string.
      Here are the transactions:
      ${JSON.stringify(simplifiedTransactions, null, 2)}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'gemma-2-9b-instruct',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: { type: 'json_object' },
    });

    const advice = chatCompletion.choices[0]?.message?.content;

    if (!advice) {
      return res.status(500).json({ message: 'Failed to get advice from AI' });
    }
    
    // Save the advice to the database for future reference
    await prisma.aIAdvice.create({
      data: {
        prompt,
        advice: JSON.parse(advice),
      }
    });

    return res.status(200).json(JSON.parse(advice));

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while getting financial advice.' });
  }
};

export default withAuth(handler);

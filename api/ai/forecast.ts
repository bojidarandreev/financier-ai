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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        amount: true,
        date: true,
      },
    });

    if (transactions.length < 10) {
      return res.status(200).json({ forecast: "Not enough transaction data from the last 30 days to generate a forecast." });
    }

    const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
    // Assuming no income tracking for now, so net flow is just spending.
    // A more advanced version would include income.
    const averageDailySpend = totalSpending / 30;
    const projectedMonthlySpend = averageDailySpend * 30;

    const prompt = `
      You are a financial analyst. Based on the user's recent spending patterns, you need to provide a simple, one-sentence forecast.
      The user's projected spending for the next 30 days is approximately $${projectedMonthlySpend.toFixed(2)}.
      Frame this as a projection of their savings. For this simple model, assume their monthly income is $5000.
      Calculate the projected savings and state it clearly.
      The final output must be a JSON object with a single key "forecast", which is a string.
      Example: { "forecast": "Based on your current trends, you are projected to save approximately $1234 this month." }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'gemma-2-9b-instruct',
      temperature: 0.5,
      max_tokens: 200,
      stream: false,
      response_format: { type: 'json_object' },
    });
    
    const forecast = chatCompletion.choices[0]?.message?.content;
    
    if (!forecast) {
      return res.status(500).json({ message: 'Failed to get forecast from AI' });
    }

    return res.status(200).json(JSON.parse(forecast));

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while generating the forecast.' });
  }
};

export default withAuth(handler);

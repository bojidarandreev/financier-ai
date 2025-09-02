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
    // 1. Get spending in the last 30 days by category
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSpending = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { date: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    });

    // 2. Get average monthly spending over the last 6 months by category
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const historicalSpending = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { date: { gte: sixMonthsAgo } },
      _sum: { amount: true },
    });
    
    const categoryDetails = await prisma.category.findMany({
        where: { id: { in: recentSpending.map(s => s.categoryId!) } }
    });

    // 3. Compare and find anomalies
    const anomalies: any[] = [];
    for (const recent of recentSpending) {
      const historical = historicalSpending.find(h => h.categoryId === recent.categoryId);
      const categoryName = categoryDetails.find(c => c.id === recent.categoryId)?.name || 'Uncategorized';
      
      if (historical && historical._sum.amount) {
        const averageMonthly = (historical._sum.amount / 6);
        const recentAmount = recent._sum.amount || 0;
        
        if (recentAmount > averageMonthly * 1.5) { // 50% spike
          const percentageIncrease = ((recentAmount - averageMonthly) / averageMonthly) * 100;
          anomalies.push({
            category: categoryName,
            recentSpending: recentAmount.toFixed(2),
            averageSpending: averageMonthly.toFixed(2),
            percentageIncrease: percentageIncrease.toFixed(0),
          });
        }
      }
    }

    if (anomalies.length === 0) {
      return res.status(200).json({ anomalies: [], message: "No unusual spending detected this month. Great job!" });
    }
    
    // 4. Use AI to format the message
    const prompt = `
      You are a financial assistant. You have detected some spending anomalies for the user.
      Format a friendly, helpful, and slightly concerned message based on the following data.
      For each anomaly, mention the category and how much higher the spending is compared to the average.
      The final output must be a JSON object with two keys: "anomalies" (an array of the original anomaly data) and "message" (a single string summarizing the findings).
      
      Anomalies data:
      ${JSON.stringify(anomalies, null, 2)}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'gemma-2-9b-instruct',
      response_format: { type: 'json_object' },
    });

    const result = chatCompletion.choices[0]?.message?.content;

    if (!result) {
      return res.status(500).json({ message: 'Failed to get analysis from AI' });
    }

    return res.status(200).json(JSON.parse(result));

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while detecting anomalies.' });
  }
};

export default withAuth(handler);

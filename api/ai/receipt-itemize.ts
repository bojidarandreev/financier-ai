import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../_lib/with-auth';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { receiptText } = req.body;

  if (!receiptText || typeof receiptText !== 'string') {
    return res.status(400).json({ message: 'receiptText is required and must be a string.' });
  }

  try {
    const prompt = `
      You are an expert receipt processing AI. Your task is to extract line items from a raw text receipt.
      For each line item, provide a short description and the amount.
      Also, provide a suggested category for each item from the following list: Groceries, Dining Out, Transport, Shopping, Entertainment, Utilities, Health, Personal Care, Other.
      The final output must be a valid JSON object with a single key "items" which is an array of objects, each with "description", "amount", and "category" keys.
      The amount should be a number (float), not a string.
      If a line item seems to be a tax, subtotal, or total, please ignore it.
      
      Here is the receipt text:
      ---
      ${receiptText}
      ---
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'gemma-2-9b-instruct',
      response_format: { type: 'json_object' },
    });

    const result = chatCompletion.choices[0]?.message?.content;

    if (!result) {
      return res.status(500).json({ message: 'Failed to get itemization from AI' });
    }

    return res.status(200).json(JSON.parse(result));

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred during receipt itemization.' });
  }
};

export default withAuth(handler);

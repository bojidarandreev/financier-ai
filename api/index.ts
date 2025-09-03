import { VercelRequest, VercelResponse } from '@vercel/node';
import loginHandler from './auth/login';
import meHandler from './auth/me';
import transactionsHandler from './transactions';
import accountsHandler from './accounts';
import categoriesHandler from './categories';
import advisorHandler from './ai/advisor';
import anomalyHandler from './ai/anomaly';
import forecastHandler from './ai/forecast';
import receiptItemizeHandler from './ai/receipt-itemize';
import setupHandler from './setup';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';

  if (url.startsWith('/api/auth/login')) {
    return loginHandler(req, res);
  }
  if (url.startsWith('/api/auth/me')) {
    return meHandler(req, res);
  }
  if (url.startsWith('/api/transactions')) {
    return transactionsHandler(req, res);
  }
  if (url.startsWith('/api/accounts')) {
    return accountsHandler(req, res);
  }
  if (url.startsWith('/api/categories')) {
    return categoriesHandler(req, res);
  }
  if (url.startsWith('/api/ai/advisor')) {
    return advisorHandler(req, res);
  }
  if (url.startsWith('/api/ai/anomaly')) {
    return anomalyHandler(req, res);
  }
  if (url.startsWith('/api/ai/forecast')) {
    return forecastHandler(req, res);
  }
  if (url.startsWith('/api/ai/receipt-itemize')) {
    return receiptItemizeHandler(req, res);
  }
  if (url.startsWith('/api/setup')) {
    return setupHandler(req, res);
  }

  return res.status(404).json({ message: 'Not Found' });
}

import { serialize } from 'cookie';
import type { ServerResponse } from 'http';

/**
 * This sets a cookie on the response.
 **/
export const setCookie = (
  res: ServerResponse,
  name: string,
  value: unknown
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax' as const,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
};

import { readFileSync } from 'fs';
import path from 'path';

type AuthStorageState = {
  origins: Array<{
    origin: string;
    localStorage: Array<{ name: string; value: string }>;
  }>;
};

export function getAuthToken(): string {
  const authFile = path.join(__dirname, '../../playwright/.auth/user.json');
  const storageState = JSON.parse(readFileSync(authFile, 'utf-8')) as AuthStorageState;
  const token = storageState.origins
    .find((origin) => origin.origin === 'https://conduit.bondaracademy.com')
    ?.localStorage.find((entry) => entry.name === 'jwtToken')?.value;

  if (!token) {
    throw new Error('The saved authentication state does not contain a jwtToken');
  }

  return token;
}
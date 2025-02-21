import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthGetCurrentUserServer } from '@/lib/amplify-utils';

export async function middleware(request: NextRequest) {
  const user = await AuthGetCurrentUserServer();
  if (!user) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  return NextResponse.next();
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)',
    ],
  };
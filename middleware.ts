import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('MATRIX_USER_ID:', process.env.MATRIX_USER_ID);
  console.log('MATRIX_ACCESS_TOKEN:', process.env.MATRIX_ACCESS_TOKEN ? '***' : 'undefined');
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
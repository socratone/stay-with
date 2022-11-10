import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

// https://next-auth.js.org/getting-started/example
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    KakaoProvider({
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET ?? '',
    }),
  ],
};

export default NextAuth(authOptions);

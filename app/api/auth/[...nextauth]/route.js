import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { API_URL } from '@/lib/api-config';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(`${API_URL}/auth/login.php`, {
                        email: credentials.email,
                        password: credentials.password
                    });

                    if (response.data.success) {
                        const { user, token } = response.data.data;
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            name: `${user.first_name} ${user.last_name}`,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            role: user.role,
                            membershipStatus: user.membership_status,
                            phone: user.phone,
                            accessToken: token
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/auth',
        signOut: '/auth',
        error: '/auth'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.membershipStatus = user.membershipStatus;
                token.phone = user.phone;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.membershipStatus = token.membershipStatus;
                session.user.phone = token.phone;
                session.user.accessToken = token.accessToken;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60 // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

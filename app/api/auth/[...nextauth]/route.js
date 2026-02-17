import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://content.lifereachchurch.org';
const AUTH_TIMEOUT_MS = 10000;

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.error('❌ Missing credentials payload');
                    return null;
                }

                try {
                    console.log('🔐 Attempting login to:', `${API_URL}/auth/login.php`);
                    
                    const response = await axios.post(`${API_URL}/auth/login.php`, {
                        email: credentials.email,
                        password: credentials.password
                    }, {
                        timeout: AUTH_TIMEOUT_MS
                    });

                    console.log('✅ Login response:', response.data);

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
                    
                    console.error('❌ Login failed - success=false');
                    return null;
                } catch (error) {
                    console.error('❌ Auth error:', {
                        message: error.message,
                        status: error.response?.status,
                        data: error.response?.data,
                        url: `${API_URL}/auth/login.php`
                    });
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
            if (!session.user) {
                session.user = {};
            }

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
    secret: process.env.NEXTAUTH_SECRET || '9b7f3a4c1d8e4a2fb6c0e3a7d5f92c1e4b8a0f6d3c2e9a1b7d4f5e8c6a9b2',
    debug: process.env.NODE_ENV === 'development',
    trustHost: true
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

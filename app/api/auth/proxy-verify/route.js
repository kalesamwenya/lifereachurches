import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://content.lifereachchurch.org';

export async function POST(request) {
    try {
        const body = await request.json();
        
        const response = await axios.post(`${API_URL}/auth/verify_email.php`, {
            email: body.email,
            code: body.code
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Proxy verify email error:', error.response?.data || error.message);
        return NextResponse.json(
            { 
                success: false, 
                message: error.response?.data?.message || 'Verification failed' 
            },
            { status: error.response?.status || 500 }
        );
    }
}

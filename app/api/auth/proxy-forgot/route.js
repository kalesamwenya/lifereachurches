import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://content.lifereachchurch.org';

export async function POST(request) {
    try {
        const body = await request.json();
        
        const response = await axios.post(`${API_URL}/auth/forgot_password.php`, {
            email: body.email
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Proxy forgot password error:', error.response?.data || error.message);
        return NextResponse.json(
            { 
                success: false, 
                message: error.response?.data?.message || 'Failed to send reset link' 
            },
            { status: error.response?.status || 500 }
        );
    }
}

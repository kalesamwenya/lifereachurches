import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://content.lifereachchurch.org';

export async function POST(request) {
    try {
        const body = await request.json();
        
        const response = await axios.post(`${API_URL}/auth/reset_password.php`, {
            token: body.token,
            password: body.password
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Proxy reset password error:', error.response?.data || error.message);
        return NextResponse.json(
            { 
                success: false, 
                message: error.response?.data?.message || 'Failed to reset password' 
            },
            { status: error.response?.status || 500 }
        );
    }
}

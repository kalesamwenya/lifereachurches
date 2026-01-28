'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { CheckCircle2, Loader2, Download, Home } from 'lucide-react';
import { generateGivingReceipt } from '@/utils/generateGivingReceipt';
import { API_URL } from '@/lib/api-config';

function SuccessContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [details, setDetails] = useState(null);
    const tx_ref = searchParams.get('tx_ref');
    const transaction_id = searchParams.get('transaction_id');

    useEffect(() => {
        if (transaction_id) {
            verifyAndGenerate();
        }
    }, [transaction_id]);

    const verifyAndGenerate = async () => {
        try {
            // 1. Verify with PHP Backend
            const res = await axios.get(`${API_URL}/giving/verify.php?transaction_id=${transaction_id}&tx_ref=${tx_ref}`);
            if (res.data.status === 'success') {
                const verifiedData = res.data.details;
                setDetails(verifiedData);
                setStatus('success');

                // Trigger your receipt logic
                await generateGivingReceipt({
                    tx_ref: verifiedData.tx_ref,
                    amount: verifiedData.amount,
                    customer: {
                        name: verifiedData.customer, // This matches "Godfrey Kangwa" from your JSON
                        email: verifiedData.email,
                        phone: verifiedData.phone   // This will now be "N/A" instead of null
                    },
                    category: verifiedData.fund,
                    meta: { method: 'Mobile Money' }
                });
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    if (status === 'verifying') return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">Confirming Offering...</h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white max-w-md w-full rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100 animate-in fade-in zoom-in-95">
                {status === 'success' ? (
                    <>
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">Thank You!</h1>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-8 leading-relaxed">
                            Your giving has been received. The receipt has been generated and sent to your records.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => verifyAndGenerate()}
                                className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-orange-700 shadow-xl shadow-orange-100"
                            >
                                <Download size={18} /> Re-print Receipt
                            </button>
                            <a href="/" className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                <Home size={16} /> Return Home
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="py-10">
                        <h2 className="text-2xl font-black text-red-600 uppercase italic">Verification Failed</h2>
                        <p className="text-gray-500 mt-4 mb-8">We couldn't verify this transaction automatically. Please contact the church office with Ref: {searchParams.get('tx_ref')}</p>
                        <a href="/" className="font-black uppercase text-xs text-gray-400 hover:text-gray-900">Back to Home</a>
                    </div>
                )}
            </div>
        </div>
    );
}

// Next.js requires Suspense for useSearchParams
export default function GivingSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}

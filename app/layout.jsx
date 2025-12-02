import './globals.css';
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/footer/footer';

export const metadata = {
    title: 'Life Reach Church',
    description: 'Reaching every soul.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-white text-gray-900 font-sans selection:bg-orange-200 selection:text-orange-900">
        <Navbar />
        <main className="min-h-screen pt-0">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}
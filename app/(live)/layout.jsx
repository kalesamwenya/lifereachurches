import Footer from "@/components/footer/footer";
import Navbar from "@/components/header/Navbar";

// Example Server Component handling meta bindings before serving client sheets
export async function generateMetadata() {
    const res = await fetch('https://content.lifereachchurch.org/streams/get_active.php', { cache: 'no-store' });
    const data = await res.json();
    
    const stream = data?.stream;
    
    return {
        title: stream?.title || "Live Stream | Life Reach Church",
        description: stream?.description || "Join our live service experience online.",
        openGraph: {
            title: stream?.title || "Live Stream",
            description: stream?.description,
            images: [
                {
                    url: stream?.thumbnail_url ? `https://content.lifereachchurch.org${stream.thumbnail_url}` : '/default-live-cover.jpg',
                    width: 1200,
                    height: 630,
                }
            ],
        },
    };
}

export default function Layout({ children }) {
    return(
        <div>
            <Navbar/>
            {children}
            <Footer/>
        </div>
    );
}
import {Smartphone} from "lucide-react";
const Button = ({ children, variant = 'primary', className = '', onClick }) => {
    const base = "px-6 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 active:scale-95 z-10 relative text-sm md:text-base";
    const styles = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-600/20",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-orange-200",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900",
        dark: "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
    };
    return <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
};


export default function StayConnected(){
    return(
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden" hidden>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-12 md:p-20 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Stay Connected</h2>
                        <p className="text-orange-100 text-lg mb-8 leading-relaxed">
                            Don't miss out on what's happening. Sign up for our weekly newsletter to get event updates, sermon notes, and devotionals delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input type="email" placeholder="Enter your email address" className="px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-300 w-full shadow-inner" />
                            <Button variant="secondary" className="whitespace-nowrap shadow-lg">Subscribe</Button>
                        </div>
                    </div>
                    <div className="lg:w-1/3 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 shadow-xl">
                            <Smartphone size={48} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Download Our App</h3>
                        <p className="text-orange-100 mb-8 text-sm max-w-xs">Give securely, watch sermons, and join groups directly from your phone.</p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button className="bg-black/40 hover:bg-black/60 transition-colors px-6 py-3 rounded-xl border border-white/20 text-xs text-left flex items-center justify-center gap-3 w-full sm:w-auto">
                                <div className="font-bold text-2xl"></div> <div>Download on the<br/><span className="font-bold text-sm">App Store</span></div>
                            </button>
                            <button className="bg-black/40 hover:bg-black/60 transition-colors px-6 py-3 rounded-xl border border-white/20 text-xs text-left flex items-center justify-center gap-3 w-full sm:w-auto">
                                <div className="font-bold text-2xl">▶</div> <div>Get it on<br/><span className="font-bold text-sm">Google Play</span></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
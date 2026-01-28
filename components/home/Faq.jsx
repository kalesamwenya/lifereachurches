"use client";
import {useEffect, useState} from "react";
import {ChevronDown, HelpCircle} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

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

const SectionTitle = ({ title, subtitle, centered = true, dark = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-16 ${centered ? 'text-center' : ''}`}
    >
        <h3 className={`font-bold uppercase tracking-widest text-xs md:text-sm mb-3 ${dark ? 'text-orange-400' : 'text-orange-600'}`}>{subtitle}</h3>
        <h2 className={`text-3xl md:text-5xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
        <div className={`h-1.5 w-24 bg-orange-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
);

const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-orange-600 transition-colors"
            >
                <span className="font-bold text-lg text-gray-900">{question}</span>
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Mock Data ---

const faqs = [
    { q: "What time do services start?", a: "We have two identical services every Sunday at 9:00 AM and 11:00 AM. We recommend arriving 15 minutes early to grab coffee and find a seat." },
    { q: "Is there anything for my kids?", a: "Absolutely! Reach Kids is available for infants through 5th grade. It's a safe, secure, and fun environment where they can learn about Jesus on their level." },
    { q: "What should I wear?", a: "Come as you are! You'll see everything from jeans and t-shirts to business casual. We care more about you than what you're wearing." },
    { q: "Where do I park?", a: "We have a dedicated Guest Parking lot right in front of the main entrance. Just turn on your hazard lights when you enter the lot, and our parking team will direct you." },
];
export default function Faq(){
    return(
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-3xl">
                <SectionTitle title="Common Questions" subtitle="FAQ" centered />
                <div className="space-y-2">
                    {faqs.map((faq, idx) => (
                        <AccordionItem key={idx} question={faq.q} answer={faq.a} />
                    ))}
                </div>
                <div className="mt-12 text-center bg-gray-50 p-8 rounded-2xl">
                    <HelpCircle className="mx-auto text-orange-500 mb-4" size={32} />
                    <h4 className="font-bold text-gray-900 mb-2">Still have questions?</h4>
                    <p className="text-gray-500 mb-6">We'd love to help you find your way.</p>
                    <a href="/about"><Button variant="secondary" className="text-sm">Contact Us</Button></a>
                </div>
            </div>
        </section>
    )
}
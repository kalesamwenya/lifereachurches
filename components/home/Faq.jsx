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
                <span className="font-bold text-lg text-gray-900 pr-4">{question}</span>
                <ChevronDown className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 leading-relaxed whitespace-pre-line">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Updated Data ---

const faqs = [
    { 
        q: "What is the vision of Life Reach Church?", 
        a: "Our vision is to be 'A Harbor of Life.' This means we serve as a place where people find safety, healing, restoration, and direction in Christ." 
    },
    { 
        q: "What can I expect when I visit?", 
        a: "When you visit Life Reach Church, you can expect a warm welcome, powerful worship, practical Bible-based teaching, and a friendly, supportive environment." 
    },
    { 
        q: "What does Life Reach Church believe?", 
        a: "We believe in one God—Father, Son, and Holy Spirit; the authority of the Bible; salvation through Jesus Christ; the work of the Holy Spirit; the Church as the Body of Christ; and godly living." 
    },
    { 
        q: "Do you have programs for children?", 
        a: "Absolutely! We provide a safe, engaging, and nurturing environment where children can learn about God and grow spiritually." 
    },
    { 
        q: "What should I wear to church?", 
        a: "There is no formal dress code. Come as you are—modest, comfortable, and confident." 
    },
    { 
        q: "Do you provide transport?", 
        a: "Yes, transport assistance may be available. Simply indicate your need when planning your visit, and our team will coordinate with you." 
    },
    { 
        q: "Where is Life Reach Church located?", 
        a: "Life Reach Church is located in Lusaka. Once you plan your visit, you will receive directions and additional details." 
    },
    { 
        q: "What time are your services?", 
        a: "Our Sunday services start at 09hrs and our midweek services on Thursday start at 17hr. We recommend arriving 10–15 minutes early." 
    },
    { 
        q: "How can I become a member?", 
        a: "You can become a member by attending regularly, completing membership classes, and aligning with the vision and teachings of the church." 
    },
    { 
        q: "What are the core values of Life Reach Church?", 
        a: "Our core values include God-Centered Living, Word-Governed Teaching, Integrity, Prayer, Holiness, Love, Respect, Loyalty, Unity, Excellence, Empowerment, Giving, Education, and Service unto the Lord." 
    },
    { 
        q: "How can I grow spiritually at Life Reach Church?", 
        a: "You can grow through worship services, prayer gatherings, Bible teaching, discipleship programs, serving in ministry, and fellowship with other believers." 
    },
    { 
        q: "What does it mean that the church is a 'Harbor of Life'?", 
        a: "Just as a harbor provides safety, rest, repair, and direction for ships, Life Reach Church provides spiritual refuge, healing, and guidance for individuals and families." 
    },
    { 
        q: "Will I be pressured to participate or give?", 
        a: "No. We believe in cheerful and voluntary participation. You are free to engage at your own pace." 
    },
    { 
        q: "How do I plan my visit?", 
        a: "Simply fill out the Plan Your Visit Form. Our team will prepare to welcome you and ensure a smooth and memorable experience." 
    },
    { 
        q: "Why should I visit Life Reach Church?", 
        a: "Because here, you will encounter God's presence, discover your purpose, experience genuine love, grow in faith, and find safety and solutions in Christ." 
    }
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
                <div className="mt-12 text-center bg-gray-50 p-8 rounded-2xl flex flex-col items-center">
                    <HelpCircle className="mx-auto text-orange-500 mb-4" size={32} />
                    <h4 className="font-bold text-gray-900 mb-2">Still have questions?</h4>
                    <p className="text-gray-500 mb-6">Contact Deaconess Elmaih at +260 972 933 416</p>
                    <a href="/contact"><Button variant="secondary" className="text-sm">Contact Us</Button></a>
                </div>
            </div>
        </section>
    )
}
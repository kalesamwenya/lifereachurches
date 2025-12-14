'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sun, MapPin, Play, User, Calendar,
  Clock, Instagram, Coffee, Baby, Car, Quote,
  Smartphone, Mail, Heart, Users, Music, HelpCircle,
  ChevronDown, CheckCircle, ArrowUpRight, ChevronLeft, ChevronRight, PenTool
} from 'lucide-react';

// --- Local UI Components ---

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

const Card = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
);

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

const nextSteps = [
  { title: "Get Baptized", desc: "Publicly declare your faith in Jesus.", icon: <CheckCircle className="text-blue-500" /> },
  { title: "Join a Group", desc: "Find community and do life together.", icon: <Users className="text-green-500" /> },
  { title: "Start Serving", desc: "Use your gifts to make a difference.", icon: <Heart className="text-red-500" /> },
  { title: "Give Online", desc: "Support the mission of the church.", icon: <Smartphone className="text-orange-500" /> },
];

const testimonials = [
  { id: 1, name: "Sarah J.", role: "Member since 2021", quote: "I walked in feeling broken and alone. I walked out knowing I had a family. Life Reach changed my trajectory.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" },
  { id: 2, name: "The Miller Family", role: "Members since 2019", quote: "Our kids actually wake us up on Sundays wanting to go to church. The kids ministry is phenomenal!", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" },
  { id: 3, name: "David K.", role: "Volunteer", quote: "Serving at Life Reach has given me a sense of purpose I never expected. It's more than just a church; it's a home.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
  { id: 4, name: "Emily R.", role: "New Believer", quote: "I was skeptical about faith, but the community here welcomed me with open arms. I finally found peace.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
];

// -------------------

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
      <>
        {/* 1. HERO SECTION */}
        <div className="relative h-screen min-h-[700px] flex items-center justify-center text-center text-white overflow-hidden">
          <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10 }}
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1920")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/30"></div>
          </motion.div>

          <div className="relative z-10 px-6 max-w-5xl mx-auto mt-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
            <span className="inline-block py-2 px-4 rounded-full bg-orange-500/20 border border-orange-400/50 backdrop-blur-md text-orange-100 font-bold uppercase tracking-widest text-xs mb-8">
              Welcome Home
            </span>
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
                REACHING<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">EVERY SOUL</span>
              </h1>
              <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
                We are a movement dedicated to showing the world that Jesus is alive, and He changes everything.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <a href="/live"><Button className="w-full sm:w-auto !px-8 !py-4 text-lg">Watch Online</Button></a>
                <a href="/plan-visit"><Button variant="outline" className="w-full sm:w-auto !px-8 !py-4 text-lg">Plan A Visit</Button></a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 2. INTRO SNIPPET */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-50 rounded-tr-full opacity-50"></div>

          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
              <h5 className="text-orange-600 font-bold uppercase tracking-widest mb-4">Hello & Welcome</h5>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">We Are Life Reach Church.</h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12">
                Whether you've been a believer for decades or you're just starting to ask questions about God, you have a place here. We are an imperfect family striving to love a perfect God and serve our city with everything we have.
              </p>
              <a href="/about"><Button variant="secondary" className="mx-auto">Read Our Story</Button></a>
            </motion.div>
          </div>
        </section>

        {/* 6. VISION & MISSION */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-12 rounded-3xl shadow-xl border-l-8 border-orange-500 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                  <Sun size={200} />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h3>
                <p className="text-xl text-gray-600 leading-relaxed relative z-10">
                  "To be a beacon of hope, reaching every soul with the transformative love of Christ, creating a city where no one walks alone."
                </p>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 p-12 rounded-3xl shadow-xl border-r-8 border-orange-500 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700 text-white">
                  <MapPin size={200} />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-white">Our Mission</h3>
                <p className="text-xl text-gray-300 leading-relaxed relative z-10">
                  "We exist to <span className="text-orange-500 font-bold">Reach</span> the lost, <span className="text-orange-500 font-bold">Raise</span> disciples, and <span className="text-orange-500 font-bold">Release</span> leaders into their God-given destiny."
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. FEATURED SERMON BRIEF */}
        <section className="py-24 bg-gray-900 relative overflow-hidden">
          <div
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=1920")' }}
          ></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:w-1/2"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Latest Message</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                  The Art of <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Neighboring</span>
                </h2>

                <div className="bg-gray-800/50 border-l-4 border-orange-500 p-6 rounded-r-xl backdrop-blur-sm mb-8">
                  <Quote className="text-orange-500 mb-2 opacity-50" size={24} />
                  <p className="text-gray-300 text-lg italic leading-relaxed">
                    "Who is my neighbor? It's not just the person who looks like you or lives next door. Jesus challenges us to expand our circle and love without agenda."
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
                      alt="Pastor"
                      className="w-14 h-14 rounded-full border-2 border-orange-500 object-cover"
                  />
                  <div>
                    <p className="text-white font-bold">Pastor Michael Ford</p>
                    <p className="text-gray-400 text-sm">Lead Pastor</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a href="/sermons"><Button className="!bg-white !text-gray-900 hover:!bg-gray-100"><Play size={18} fill="currentColor" /> Watch Full Sermon</Button></a>
                  <a href="/sermons"><Button variant="outline">Sermon Archive</Button></a>
                </div>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="lg:w-1/2 w-full"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-700 group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Sermon Thumbnail" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-20 h-20 bg-orange-600/90 rounded-full flex items-center justify-center pl-1 text-white shadow-xl shadow-orange-900/40 transform group-hover:scale-110 transition-transform">
                      <Play size={32} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 text-white text-xs font-bold rounded-lg backdrop-blur-md">
                    38:24
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. MINISTRY HIGHLIGHTS */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <SectionTitle title="Something For Everyone" subtitle="Connect & Grow" />

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="relative h-80 group cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502086223501-68119136a60b?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Sun className="text-orange-400 mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Reach Kids</h3>
                  <p className="text-gray-300 text-sm mb-4">Infants - 5th Grade</p>
                  <span className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wide group-hover:gap-4 transition-all">Learn More <ArrowRight size={16} /></span>
                </div>
              </Card>

              <Card className="relative h-80 group cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Users className="text-orange-400 mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Life Groups</h3>
                  <p className="text-gray-300 text-sm mb-4">Community & Discipleship</p>
                  <span className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wide group-hover:gap-4 transition-all">Find A Group <ArrowRight size={16} /></span>
                </div>
              </Card>

              <Card className="relative h-80 group cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Music className="text-orange-400 mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Worship</h3>
                  <p className="text-gray-300 text-sm mb-4">Join the Team</p>
                  <span className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wide group-hover:gap-4 transition-all">Audition <ArrowRight size={16} /></span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 5. PLAN YOUR VISIT */}
        <section className="py-20 bg-orange-600 text-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Planning Your First Visit?</h2>
              <p className="text-orange-100 text-lg">Here is what you can expect when you join us this Sunday.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                  <Coffee size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Coffee's On Us</h3>
                <p className="text-orange-100 leading-relaxed">Arrive a few minutes early and grab a free hot coffee or tea at our Reach Café in the lobby.</p>
              </div>
              <div className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl -rotate-2">
                  <Baby size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Safe for Kids</h3>
                <p className="text-orange-100 leading-relaxed">Our Reach Kids environment is safe, secure, and fun. Check-in is quick and easy.</p>
              </div>
              <div className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-1">
                  <Car size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Easy Parking</h3>
                <p className="text-orange-100 leading-relaxed">Our parking team will direct you to a spot close to the entrance. Look for the "First Time Guest" signs.</p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <a href="/plan-visit"><Button variant="secondary" className="mx-auto text-orange-600 shadow-xl">Plan A Visit</Button></a>
            </div>
          </div>
        </section>



        {/* 7. NEXT STEPS (Interactive Grid) */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <SectionTitle title="Take Your Next Step" subtitle="Growth Track" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nextSteps.map((step, idx) => (
                  <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-gray-100 text-center group cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-6 text-3xl group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-500 mb-6">{step.desc}</p>
                    <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <ArrowUpRight size={16} />
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. STORIES OF CHANGE (CAROUSEL) */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

          <div className="container mx-auto px-6 relative z-10">
            <SectionTitle title="Stories of Change" subtitle="Real People. Real God." />

            <div className="max-w-4xl mx-auto relative">
              <AnimatePresence mode='wait'>
                <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                  <Card className="p-10 md:p-16 border border-gray-100 flex flex-col md:flex-row gap-8 items-center text-center md:text-left shadow-2xl relative">
                    {/* Quote Icon Background */}
                    <Quote className="absolute top-8 right-8 text-orange-100 w-24 h-24 rotate-12 opacity-50" fill="currentColor" />

                    <div className="flex-shrink-0 relative">
                      <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-2 border-2 border-dashed border-orange-200">
                        <img
                            src={testimonials[currentTestimonial].image}
                            alt={testimonials[currentTestimonial].name}
                            className="w-full h-full rounded-full object-cover shadow-lg"
                        />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <Quote className="text-orange-500 mb-6 mx-auto md:mx-0 w-8 h-8" fill="currentColor" />
                      <p className="text-xl md:text-2xl font-medium text-gray-800 mb-8 italic leading-relaxed">
                        "{testimonials[currentTestimonial].quote}"
                      </p>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-1">{testimonials[currentTestimonial].name}</h4>
                        <span className="text-sm text-orange-600 font-bold uppercase tracking-wide bg-orange-50 px-3 py-1 rounded-full">
                              {testimonials[currentTestimonial].role}
                           </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                      <button
                          key={idx}
                          onClick={() => setCurrentTestimonial(idx)}
                          className={`h-2 rounded-full transition-all ${idx === currentTestimonial ? 'w-8 bg-orange-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                      />
                  ))}
                </div>
                <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Share Your Story Button */}
              <div className="mt-12 text-center">
                <p className="text-gray-500 mb-4">Has God done something amazing in your life?</p>
                <a href="/testimonies/submit">
                  <Button variant="secondary" className="mx-auto !border-orange-200 text-orange-600 hover:!bg-orange-50 shadow-md">
                    <PenTool size={16} /> Share Your Story
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FAQ SECTION */}
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

        {/* 10. STAY CONNECTED */}
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

        {/* 11. GALLERY */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <SectionTitle title="Life At Reach" subtitle="Gallery" />

            <div className="columns-2 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {galleryImages.map((img, idx) => (
                  <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="break-inside-avoid rounded-2xl overflow-hidden shadow-lg group relative cursor-pointer"
                  >
                    <img src={img} alt="Gallery" className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white font-bold flex items-center gap-2">
                        <Instagram size={18} /> @LifeReachChurch
                      </p>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>
      </>
  );
}
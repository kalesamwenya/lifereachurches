'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sun, MapPin, Play, User, Calendar,
  Clock, Instagram, Coffee, Baby, Car, Quote,
  Smartphone, Mail, Heart, Users, Music, HelpCircle,
  ChevronDown, CheckCircle, ArrowUpRight, ChevronLeft, ChevronRight, PenTool
} from 'lucide-react';
import Hero from "@/components/home/Hero";
import GallerySnippet from "@/components/home/GallerySnippet";
import IntroSnippet from "@/components/home/IntroSnippet";
import VisionMission from "@/components/home/VisionMission";
import LatestSermon from "@/components/home/LatestSermon";
import MinistryHighlights from "@/components/home/MinistryHighlights";
import PlanVisitCTA from "@/components/home/PlanVisitCTA";
import GrowthTrack from "@/components/home/GrowthTrack";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import StayConnected from "@/components/home/StayConnected";

export default function HomePage() {


  return (
      <>
        {/* 1. HERO SECTION */}
        <Hero/>
        {/* 2. INTRO SNIPPET */}
       <IntroSnippet/>

        {/* 6. VISION & MISSION */}
        <VisionMission/>

        {/* 3. FEATURED SERMON BRIEF */}
       {/* <LatestSermon/> */}

        {/* 4. MINISTRY HIGHLIGHTS */}
       <MinistryHighlights/>

        {/* 5. PLAN YOUR VISIT */}
       <PlanVisitCTA/>

        {/* 7. NEXT STEPS (Interactive Grid) */}
        <GrowthTrack/>

        {/* 8. STORIES OF CHANGE (CAROUSEL) */}
       <Testimonials/>

        {/* 9. FAQ SECTION */}
       <Faq/>

        {/* 10. STAY CONNECTED */}
        <StayConnected/>
        {/* 11. GALLERY */}
       <GallerySnippet/>
      </>
  );
}
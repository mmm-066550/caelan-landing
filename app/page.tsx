"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoCalendarSharp } from "react-icons/io5";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import { FaLinkedin, FaExternalLinkAlt } from "react-icons/fa";
import { RiHandHeartFill } from "react-icons/ri";
import { TbReportMoney } from "react-icons/tb";


export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [inSections, setInSections] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("rostering");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "It's simple, clear, and doesn't feel complicated. Staff picked it up quickly without needing much explanation.",
      name: "Mercy Okaye",
      role: "Registered Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      quote: "The platform has transformed how we manage our care services. Everything we need is in one place.",
      name: "John Smith",
      role: "Care Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      quote: "Our team's efficiency has improved significantly since implementing this system.",
      name: "Sarah Johnson",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    }
  ];

  const contactCards = [
    {
      icon: HiLocationMarker,
      text: "Essex, United Kingdom",
      showExternalLink: true,
      iconBg: "bg-[#0B2230]",
      iconColor: "text-white"
    },
    {
      icon: HiMail,
      text: "hello@caelan.com",
      showExternalLink: false,
      iconBg: "bg-[#0B2230]",
      iconColor: "text-white"
    },
    {
      icon: FaLinkedin,
      text: "Caelan care",
      showExternalLink: false,
      iconBg: "bg-[#0B2230]",
      iconColor: "text-white"
    },
    {
      icon: HiPhone,
      text: "01268 203030",
      showExternalLink: false,
      iconBg: "bg-[#0B2230]",
      iconColor: "text-white"
    }
  ];

  const sectionOrder = ['rostering', 'referral', 'careplanning', 'compliance', 'payroll', 'trainings'];
  
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({
    rostering: null,
    referral: null,
    careplanning: null,
    compliance: null,
    payroll: null,
    trainings: null,
  });

  const isExpanded = (sectionId: string) => {
    const activeSectionIndex = sectionOrder.indexOf(activeSection);
    const currentSectionIndex = sectionOrder.indexOf(sectionId);
    // Expand current and all sections below it
    return currentSectionIndex >= activeSectionIndex;
  };

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
      
      // Check if we're in the sections area (after hero section)
      const heroHeight = window.innerHeight;
      setInSections(scrollY > heroHeight - 200);

      // Determine active section based on scroll position
      const sections = ['rostering', 'referral', 'careplanning', 'compliance', 'payroll', 'trainings'];
      let foundActive = false;
      
      for (let i = 0; i < sections.length; i++) {
        const section = sectionRefs.current[sections[i]];
        if (section) {
          const rect = section.getBoundingClientRect();
          // If section top is at or above the sticky position (132px)
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveSection(sections[i]);
            foundActive = true;
            break;
          }
        }
      }
      
      // If no section is active yet, keep the first one expanded
      if (!foundActive && scrollY < heroHeight) {
        setActiveSection('rostering');
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navbar */}
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full px-4"
      >
        <div className="container-1200">
          <div className={`backdrop-blur-md ${inSections ? 'bg-white/90 shadow-2xl' : scrolled ? 'bg-white/50 shadow-xl' : 'bg-white/40 shadow-lg'} rounded-full border-2 border-white/60 px-3.5 py-2.5 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image 
                  src="/assets/images/logo_dark.svg" 
                  alt="Caelan Logo" 
                  width={120} 
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 cursor-pointer text-white rounded-full font-medium transition-all flex items-center gap-2 animate-gradient-bg"
                style={{
                  background: 'linear-gradient(90deg, #0d9488, #06b6d4, #2563eb, #7c3aed)',
                  backgroundSize: '200% auto',
                  animation: 'gradient 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                Get in Touch
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-linear-to-b from-pink-50 via-purple-50 to-white relative overflow-hidden">
        {/* Background Color Spots */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="relative w-full max-w-[1200px] h-full">
            {/* Top Left Pink Spot */}
            <div className="absolute top-20 left-40 w-[600px] h-[600px] bg-pink-200/25 rounded-full" style={{ filter: 'blur(120px)' }}></div>
            {/* Top Right Purple Spot */}
            <div className="absolute top-10 right-32 w-[550px] h-[550px] bg-purple-200/25 rounded-full" style={{ filter: 'blur(120px)' }}></div>
            {/* Center Blue Spot */}
            <div className="absolute top-40 left-1/4 w-125 h-125 bg-blue-200/25 rounded-full" style={{ filter: 'blur(120px)' }}></div>
            {/* Right Yellow Spot */}
            <div className="absolute top-32 right-20 w-[600px] h-[600px] bg-yellow-200/35 rounded-full" style={{ filter: 'blur(120px)' }}></div>
            {/* Center Purple Spot */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-purple-300/20 rounded-full" style={{ filter: 'blur(120px)' }}></div>
          </div>
        </div>

        <div className="container-1200 py-20 w-full relative z-10">
          <div className="grid lg:grid-cols-2 items-center gap-16 w-full">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12 text-center lg:text-left flex flex-col items-center lg:items-start w-full"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-400 to-blue-400 text-white rounded-full text-sm font-medium"
              >
                <span className="text-lg">✨</span>
                <span className="font-medium px-2">AI-powered Care Management Software</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-[3rem] font-semibold leading-tight"
              >
                <span className="text-[#1a1f3c]">Everything You Need<br />to Run a Care Service<br /></span>
                <span className="gradient-text-animated bg-linear-to-r from-teal-600 via-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient inline-block">
                  in One Place
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-base leading-8 text-gray-600 max-w-lg mx-auto lg:mx-0"
              >
                Manage care, staff, compliance, and finances through one simple, intelligent system.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 cursor-pointer text-white rounded-full font-medium transition-all flex items-center gap-2 mx-auto lg:mx-0"
                  style={{
                    background: 'linear-gradient(90deg, #0d9488, #06b6d4, #2563eb, #7c3aed)',
                    backgroundSize: '200% auto',
                    animation: 'gradient 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                >
                  Get in Touch
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Content - Circular Images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative h-128 hidden lg:flex items-center justify-center"
              style={{
                backgroundImage: 'url(/assets/images/style/net_square.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              {/* Top Left Circle - Small */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [-20, 0, -20],
                  x: [10, 0, 10]
                }}
                transition={{ 
                  opacity: { delay: 0.6, duration: 0.5 },
                  scale: { delay: 0.6, duration: 0.5 },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-3 left-25 w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white z-20"
              >
                <Image 
                  src="/assets/images/healthcare-1.jpg" 
                  alt="Healthcare professional with patient"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Top Right Circle - Large */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [-15, 0, -15],
                  x: [-10, 0, -10]
                }}
                transition={{ 
                  opacity: { delay: 0.7, duration: 0.5 },
                  scale: { delay: 0.7, duration: 0.5 },
                  y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-8 right-8 w-56 h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white z-20"
              >
                <Image 
                  src="/assets/images/healthcare-2.jpg" 
                  alt="Healthcare team collaboration"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Bottom Left Circle - Largest (Nurse) */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [-25, 0, -25],
                  x: [15, 0, 15]
                }}
                transition={{ 
                  opacity: { delay: 0.8, duration: 0.5 },
                  scale: { delay: 0.8, duration: 0.5 },
                  y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-8 left-8 w-70 h-70 rounded-full overflow-hidden shadow-2xl border-4 border-white z-30"
              >
                <Image 
                  src="/assets/images/healthcare-3.jpg" 
                  alt="Nurse using tablet"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Bottom Right Circle - Medium */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [-18, 0, -18],
                  x: [-12, 0, -12]
                }}
                transition={{ 
                  opacity: { delay: 1, duration: 0.5 },
                  scale: { delay: 1, duration: 0.5 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-19 right-14 w-36 h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white z-20"
              >
                <Image 
                  src="/assets/images/healthcare-4.jpg" 
                  alt="Elderly care service"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Solutions Header Section */}
      <section className="py-16 bg-white -mt-15">
        <div className="container-1200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <p className="text-gray-500 text-lg uppercase tracking-wider mb-6">
              Our Solutions
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
              <span className="gradient-text-animated bg-linear-to-r from-teal-600 via-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Everything You Need in One Place</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Rostering & HR Section */}
      <section 
        ref={(el) => { sectionRefs.current.rostering = el; }}
        className="sticky top-33 bg-[#e2fafe] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('rostering') ? '530px' : '80px', 
          zIndex: 10 
        }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="container-1200"
        >
          {/* Expanded Content */}
          {isExpanded('rostering') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-20"
            >
              <div className="grid lg:grid-cols-2 items-center" style={{ gap: '90px' }}>
                {/* Left Content */}
                <div className="space-y-8">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-linear-to-b from-cyan-100 to-[#ffffff] rounded-2xl shadow-sm flex items-center justify-center shrink-0 border-2 border-white">
                      <IoCalendarSharp className="w-8 h-8 text-[#079CB6]"/>
                    </div>
                    <div className="flex-1 space-y-8 mt-3">
                      <h3 className="text-4xl font-semibold" style={{ color: '#193650' }}>
                        Rostering & HR
                      </h3>
                      <p className="text-lg leading-relaxed" style={{ color: '#304A61' }}>
                        Automated rostering and HR tools that manage shifts, absences, onboarding, and contracts while adapting to staff availability.
                      </p>

                      {/* Feature List */}
                      <div className="space-y-4 pt-2">
                    {[
                      "Automated rostering and HR tools",
                      "Integrated absence and leave management",
                      "Fast digital staff onboarding",
                      "Secure HR and contract records"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Image */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Image 
                      src="/assets/images/sections/rostering.svg" 
                      alt="Rostering & HR"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Referral Management Section */}
      <section 
        ref={(el) => { sectionRefs.current.referral = el; }}
        className="sticky top-33 bg-[#fef6e6] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('referral') ? '530px' : '80px', 
          zIndex: 20 
        }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="container-1200"
        >
          {/* Expanded Content */}
          {isExpanded('referral') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-20"
            >
              <div className="grid lg:grid-cols-2 items-center" style={{ gap: '90px' }}>
                {/* Left Content */}
                <div className="space-y-8">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-linear-to-b from-yellow-100 to-[#ffffff] rounded-2xl shadow-sm flex items-center justify-center shrink-0 border-2 border-white">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-8 mt-3">
                      <h3 className="text-4xl font-semibold" style={{ color: '#193650' }}>
                        Referral Management
                      </h3>
                      <p className="text-lg leading-relaxed" style={{ color: '#304A61' }}>
                        Manage referrals from first enquiry to placement with structured workflows, AI-assisted assessments, and insights into care needs.
                      </p>

                      {/* Feature List */}
                      <div className="space-y-4 pt-2">
                    {[
                      "End-to-end referral tracking",
                      "AI-supported care assessments",
                      "Streamlined placement workflows",
                      "Real-time referral status visibility"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Image */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Image 
                      src="/assets/images/sections/referal.svg" 
                      alt="Referral Management"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Care Planning Section */}
      <section 
        ref={(el) => { sectionRefs.current.careplanning = el; }}
        className="sticky top-33 bg-[#f6eefb] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('careplanning') ? '530px' : '80px', 
          zIndex: 30 
        }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="container-1200"
        >
          {/* Expanded Content */}
          {isExpanded('careplanning') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-20"
            >
              <div className="grid lg:grid-cols-2 items-center" style={{ gap: '90px' }}>
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-linear-to-b from-[#e7d0f5] to-[##FFFFFF] rounded-2xl shadow-sm flex items-center justify-center shrink-0 border-2 border-white">
                      {/* <svg " fill="none" stroke="currentColor" viewBox="0 0 24 24"> */}
                        {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> */}
                      {/* </svg> */}
                      <RiHandHeartFill className="w-8 h-8 text-purple-600"/>
                    </div>
                    <div className="flex-1 space-y-8 mt-3">
                      <h3 className="text-4xl font-semibold" style={{ color: '#193650' }}>
                        Care Planning
                      </h3>
                      <p className="text-lg leading-relaxed" style={{ color: '#304A61' }}>
                        Digital care planning with AI-assisted notes, intelligent eMAR, and insights to support proactive care decisions.
                      </p>

                      {/* Feature List */}
                      <div className="space-y-4 pt-2">
                        {[
                          "Digital, person-centred care plans",
                          "AI-assisted notes and updates",
                          "Smart eMAR for medication management",
                          "Proactive care insights"
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4"
                          >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#078C96' }}>
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-lg" style={{ color: '#304A61' }}>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Image */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Image 
                      src="/assets/images/sections/care.svg" 
                      alt="Care Planning"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Compliance Section */}
      <section 
        ref={(el) => { sectionRefs.current.compliance = el; }}
        className="sticky top-33 bg-[#fae9e9] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('compliance') ? '530px' : '80px', 
          zIndex: 40 
        }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="container-1200"
        >
          {/* Expanded Content */}
          {isExpanded('compliance') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-20"
            >
              <div className="grid lg:grid-cols-2 items-center" style={{ gap: '90px' }}>
                {/* Left Content */}
                <div className="space-y-8">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-linear-to-b from-red-100 to-[#ffffff] rounded-2xl shadow-sm flex items-center justify-center shrink-0 border-2 border-white">
                      <svg className="w-8 h-8 text-[#DF6E6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-8 mt-3">
                      <h3 className="text-4xl font-semibold" style={{ color: '#193650' }}>
                        Compliance
                      </h3>
                      <p className="text-lg leading-relaxed" style={{ color: '#304A61' }}>
                        Identify gaps early with AI-assisted mock inspections, alerts, and structured compliance records.
                      </p>

                      {/* Feature List */}
                      <div className="space-y-4 pt-2">
                        {[
                          "Ongoing compliance visibility",
                          "Smart alerts for risks and actions",
                          "Audit-ready documentation",
                          "Early identification of gaps"
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4"
                          >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#078C96' }}>
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-lg" style={{ color: '#304A61' }}>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Image */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Image 
                      src="/assets/images/sections/compliance.svg" 
                      alt="Compliance"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>
      {/*  */}

      {/* Payroll & Finance Section */}
      <section 
        ref={(el) => { sectionRefs.current.payroll = el; }}
        className="sticky top-33 bg-[#ecf6ea] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('payroll') ? '530px' : '80px', 
          zIndex: 50 
        }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="container-1200"
        >
          {/* Expanded Content */}
          {isExpanded('payroll') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-20"
            >
              <div className="grid lg:grid-cols-2 items-center" style={{ gap: '90px' }}>
                {/* Left Content */}
                <div className="space-y-8">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-linear-to-b from-[#d7edd2] to-[#ffffff] rounded-2xl shadow-sm flex items-center justify-center shrink-0 border-2 border-white">
                      <TbReportMoney className="w-8 h-8 text-[#5DBA4C]"/>
                    </div>
                    <div className="flex-1 space-y-8 mt-3">
                      <h3 className="text-4xl font-semibold" style={{ color: '#193650' }}>
                        Payroll & Finance
                      </h3>
                      <p className="text-lg leading-relaxed" style={{ color: '#304A61' }}>
                        Gain clear visibility into payroll, income, costs, and financial performance across your care services.
                      </p>

                      {/* Feature List */}
                      <div className="space-y-4 pt-2">
                        {[
                          "Accurate payroll linked directly to rotas",
                          "Track costs and income across services",
                          "Identify overtime and staffing inefficiencies",
                          "Simple, visual financial overviews"
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4"
                          >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#078C96' }}>
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-lg" style={{ color: '#304A61' }}>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Image */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Image 
                      src="/assets/images/sections/payroll.svg" 
                      alt="Payroll & Finance"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Trainings Section */}
      <section 
        ref={(el) => { sectionRefs.current.trainings = el; }}
        className="sticky top-33 bg-[#ffecfa] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('trainings') ? '530px' : '80px', 
          zIndex: 60 
        }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="container-1200"
        >
          {/* Expanded Content */}
          {isExpanded('trainings') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-20"
            >
              <div className="grid lg:grid-cols-2 items-center" style={{ gap: '90px' }}>
                {/* Left Content */}
                <div className="space-y-8">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-linear-to-b from-[#ffddf6] to-[#ffffff] rounded-2xl shadow-sm flex items-center justify-center shrink-0 border-2 border-white">
                      <svg className="w-8 h-8 text-[#D31CA3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-8 mt-3">
                      <h3 className="text-4xl font-semibold" style={{ color: '#193650' }}>
                        Trainings
                      </h3>
                      <p className="text-lg leading-relaxed" style={{ color: '#304A61' }}>
                        Centralised training management that tracks mandatory courses, monitors progress, and ensures staff remain compliant and up to date.
                      </p>

                      {/* Feature List */}
                      <div className="space-y-4 pt-2">
                    {[
                      "Simple access to training and learning records",
                      "Clear visibility of staff progress and gaps",
                      "Automatic reminders for expiring courses",
                      "Confidently meet training requirements"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Image */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Image 
                      src="/assets/images/sections/trainings.svg" 
                      alt="Trainings"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Mobile App Section */}
      <section className="py-42 bg-linear-to-b from-[#1a2332] via-[#1e2a3a] to-[#152a35] relative overflow-hidden z-70">
        {/* Background Circle Pattern - Upper Half Only */}
        <div className="absolute top-100 left-0 right-0 h-full opacity-50 overflow-hidden">
          <Image 
            src="/assets/images/style/circles.svg" 
            alt="" 
            width={1200}
            height={600}
            className="w-full h-auto object-contain object-top scale-80"
          />
        </div>

        {/* Color Spots */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-cyan-400/5 rounded-full blur-3xl"></div>

        <div className="container-1200 relative z-10">
          <div className="text-center mb-30">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm uppercase tracking-wider mb-4"
            >
              Mobile App
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Everything <span className="gradient-text-animated bg-linear-to-r from-teal-600 via-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">You Need</span>
            </motion.h2>
          </div>

          <div className="relative flex items-center justify-center gap-32">
            {/* Left Side - Features */}
            <div className="flex-1 max-w-60 flex flex-col justify-center pt-48">
              <div className="space-y-24">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: "Today's shift details",
                    description: "See your upcoming shifts at a glance"
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ),
                    title: "Hours worked",
                    description: "Monitor total hours worked in real time"
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "Upcoming shift info",
                    description: "See when and where you're working next"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="text-right">
                      <div className="flex justify-end mb-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                    {/* Arrow - right side of feature */}
                    <div className={`absolute -right-22 -top-8 ${index===1?'top-8':null}  -translate-y-1/2 translate-x-8 w-20 h-20`}>
                      <Image 
                        src={`/assets/images/style/arrows/${index === 0 ? 'left_bottom.svg' : index === 1 ? 'left.svg' : 'left_more_bottom.svg'}`}
                        alt="" 
                        width={80}
                        height={80}
                        className="w-full h-full brightness-0 invert opacity-90"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Center - Phone Mockup */}
            <div className="shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <Image 
                  src="/assets/images/phone.svg" 
                  alt="Mobile App Interface" 
                  width={280}
                  height={560}
                  className="w-70 h-auto"
                />
              </motion.div>
            </div>

            {/* Right Side - Features */}
            <div className="flex-1 max-w-60 flex flex-col justify-start -mt-32">
              <div className="space-y-24">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    ),
                    title: "Notifications & alerts",
                    description: "Stay updated with important announcements"
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "One-tap clock in",
                    description: "Easily clock in/out with a single tap"
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ),
                    title: "Real time earnings",
                    description: "Track wages earned so far"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="text-left">
                      <div className="flex justify-start mb-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                    {/* Arrow - left side of feature */}
                    <div className="absolute -left-22 top-1/2 -translate-y-1/2 -translate-x-8 w-20 h-20">
                      <Image 
                        src={`/assets/images/style/arrows/${index === 0 ? 'right_top.svg' : index === 1 ? 'right.svg' : 'right_bottom.svg'}`}
                        alt="" 
                        width={80}
                        height={80}
                        className="w-full h-full brightness-0 invert"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden z-70">
        {/* Background Color Spots */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="relative w-full h-full">
            <div className="absolute top-20 left-20 w-125 h-125 bg-purple-200/30 rounded-full" style={{ filter: 'blur(100px)' }}></div>
            <div className="absolute bottom-20 right-20 w-md h-112 bg-pink-200/30 rounded-full" style={{ filter: 'blur(100px)' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-200/20 rounded-full" style={{ filter: 'blur(120px)' }}></div>
          </div>
        </div>

        <div className="container-1200 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-medium">
              <span className="gradient-text-animated bg-linear-to-r from-teal-600 via-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">What our pilot users say</span>
            </h2>
          </motion.div>

          <div className="relative flex justify-center pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl"
              >
                <div 
                  className="rounded-[24px] border border-[#DCCEE9] p-8 md:px-16 md:py-12 flex flex-row items-start gap-8"
                  style={{ 
                    background: 'rgba(191, 165, 215, 0.09)',
                    backdropFilter: 'blur(21.55px)'
                  }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 relative">
                    <Image 
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-lg md:text-xl font-semibold text-[#193650] mb-6 leading-relaxed">
                      {testimonials[currentTestimonial].quote}
                    </p>
                    <div>
                      <p className="text-base md:text-lg font-semibold text-[#193650]">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-sm text-[#475E73] mt-1">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots indicator */}
            <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-teal-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="py-24 bg-white relative z-70">
        <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-medium mb-4">
              <span className="gradient-text-animated bg-linear-to-r from-teal-600 via-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Get in Touch</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Gain clear visibility into payroll, income, costs, and financial performance across your care services.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                placeholder=""
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                Email ID
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                placeholder=""
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <label htmlFor="company" className="block text-base font-medium text-gray-700 mb-2">
                Company Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                placeholder=""
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-base"
                placeholder=""
              ></textarea>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-8 py-5 text-white rounded-lg text-lg font-medium transition-all flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(90deg, #0d9488, #06b6d4, #2563eb, #7c3aed)',
                backgroundSize: '200% auto',
                animation: 'gradient 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            >
              Get in Touch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-b from-[#051018] from-30% to-[#174E67] text-white relative z-70 overflow-hidden" style={{ minHeight: '650px' }}>
        <div className="container-1200 pt-19 flex flex-col justify-between" style={{ minHeight: '650px' }}>
          {/* Logo Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-18"
          >
            <div className="flex items-center gap-3">
              <Image src="/assets/images/logo_light.svg" alt="Caelan" width={184} height={48} className="w-46" />
            </div>
          </motion.div>

          {/* Contact Info Cards - Full Width */}
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#0D2636] rounded-2xl p-6 border border-[#1B3A4D] hover:border-teal-500 transition-colors group relative flex flex-col justify-center items-start gap-4 flex-1 self-stretch"
                >
                  {card.showExternalLink && (
                    <FaExternalLinkAlt className="w-4 h-4 text-white absolute top-6 right-6" />
                  )}
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition-colors`}>
                    <IconComponent className={`w-6 h-6 ${card.iconColor} group-hover:text-white transition-colors`} />
                  </div>
                  <p className="text-base text-white font-normal">{card.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Bar with Background and Border */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-[#1A3444] border border-[#2A4454] rounded-xl px-6 py-5 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-200">
                ©caelancloud. All Rights Reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Terms & Conditions</a>
              </div>
            </div>
          </motion.div>

          {/* Large Caelan Typography */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="relative w-full overflow-hidden h-32 md:h-48"
          >
            <p className="absolute -top-5 left-1/2 -translate-x-1/2 text-[150px] md:text-[280px] font-semibold  text-white/5 leading-none select-none whitespace-nowrap">Caelan</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

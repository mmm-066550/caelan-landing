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

  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setFormError("");
    try {
      const payload = {
        access_key: "98dc8459-782f-438b-bdfa-0d909693e1c2",
        subject: `New Contact Form Submission from ${formData.name}`,
        from_name: "Caelan Contact Form",
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
      };
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }
      setFormStatus("success");
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (err: any) {
      console.error("Form submission error:", err);
      setFormStatus("error");
      setFormError(err.message || "Failed to send message. Please try again.");
    }
  };

  const testimonials = [
    {
      quote: "It's simple, clear, and doesn't feel complicated. Staff picked it up quickly without needing much explanation.",
      name: "Mercy Okaye",
      role: "Registered Manager",
      image: "/assets/images/testimonial.png"
    },
  ];

  const contactCards = [
    {
      icon: HiLocationMarker,
      text: "Office 1, Church Walk House, Great Oaks, Basildon SS14 1GJ, United Kingdom",
      showExternalLink: true,
      iconBg: "bg-[#0B2230]",
      iconColor: "text-white"
    },
    {
      icon: HiMail,
      text: "admin@caelan.care",
      showExternalLink: true,
      iconBg: "bg-[#0B2230]",
      iconColor: "text-white"
    },
    {
      icon: FaLinkedin,
      text: "Caelan care",
      showExternalLink: true,
      iconBg: "bg-[#0B2230]",
      iconColor: "text-white"
    },
    {
      icon: HiPhone,
      text: "+44 01268 203030",
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

  const getInTouchRef = useRef<HTMLElement | null>(null);

  const isExpanded = (sectionId: string) => {
    const activeSectionIndex = sectionOrder.indexOf(activeSection);
    const currentSectionIndex = sectionOrder.indexOf(sectionId);
    // Expand current and all sections below it
    return currentSectionIndex >= activeSectionIndex;
  };

  const scrollToGetInTouch = () => {
    getInTouchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                onClick={scrollToGetInTouch}
                className="px-4 py-2 sm:px-6 sm:py-2.5 cursor-pointer text-white rounded-full text-sm sm:text-base font-medium transition-all flex items-center gap-1.5 sm:gap-2 animate-gradient-bg"
                style={{
                  background: 'linear-gradient(90deg, #0d9488, #06b6d4, #2563eb, #7c3aed)',
                  backgroundSize: '200% auto',
                  animation: 'gradient 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                Get in Touch
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-30 flex items-center justify-center bg-gradient-to-b from-pink-50 via-purple-50 to-white relative overflow-hidden">
        {/* Background Color Spots */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="relative w-full max-w-[1200px] h-full">
            {/* Top Left Pink Spot */}
            <div className="absolute top-20 left-40 w-[600px] h-[600px] bg-pink-200/25 rounded-full" style={{ filter: 'blur(120px)' }}></div>
            {/* Top Right Purple Spot */}
            <div className="absolute top-10 right-32 w-[550px] h-[550px] bg-purple-200/25 rounded-full" style={{ filter: 'blur(120px)' }}></div>
            {/* Center Blue Spot */}
            <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-blue-200/25 rounded-full" style={{ filter: 'blur(120px)' }}></div>
            {/* Right Yellow Spot */}
            <div className="absolute top-32 right-20 w-[600px] h-[600px] bg-yellow-200/35 rounded-full" style={{ filter: 'blur(120px)' }}></div>
            {/* Center Purple Spot */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-purple-300/20 rounded-full" style={{ filter: 'blur(120px)' }}></div>
          </div>
        </div>

        <div className="container-1200 py-12 sm:py-16 lg:py-20 w-full relative z-10 px-4 sm:px-6 lg:px-0">
          <div className="grid lg:grid-cols-2 items-center gap-8 sm:gap-12 lg:gap-16 w-full">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 sm:space-y-10 lg:space-y-12 text-center lg:text-left flex flex-col items-center lg:items-start w-full"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-linear-to-r from-purple-400 to-blue-400 text-white rounded-full text-xs sm:text-sm font-medium"
              >
                <span className="text-base sm:text-lg">✨</span>
                <span className="font-medium px-1 sm:px-2">AI-powered Care Management Software</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] font-semibold leading-tight"
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
                  onClick={scrollToGetInTouch}
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

              {/* Circular Images - Mobile/Tablet (Below Button) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative h-96 w-full max-w-md mx-auto flex lg:hidden items-center justify-center mt-8"
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
                  className="absolute top-8 left-8 w-28 h-28 rounded-full overflow-hidden shadow-2xl border-2 border-white z-20"
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
                  className="absolute top-4 right-4 w-44 h-44 rounded-full overflow-hidden shadow-2xl border-2 border-white z-20"
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
                  className="absolute bottom-4 left-0 w-52 h-52 rounded-full overflow-hidden shadow-2xl border-2 border-white z-30"
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
                  className="absolute bottom-16 right-4 w-32 h-32 rounded-full overflow-hidden shadow-2xl border-2 border-white z-20"
                >
                  <Image 
                    src="/assets/images/healthcare-4.jpg" 
                    alt="Elderly care service"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Content - Circular Images (Desktop Only) */}
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
      <section className="py-14 sm:py-16 lg:py-20 bg-white -mt-10 sm:-mt-12 lg:-mt-15 px-4 sm:px-6 lg:px-0">
        <div className="container-1200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <p className="text-gray-500 text-base sm:text-lg uppercase tracking-wider mb-8 sm:mb-10">
              Our Solutions
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight">
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
          minHeight: isExpanded('rostering') ? 'auto' : '80px', 
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
              className="py-12 px-4 lg:px-0 lg:py-20"
            >
              <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-[90px]">
                {/* Left Content */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Icon & Heading */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-4 md:space-y-0">
                    <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-b from-cyan-100 to-[#ffffff] rounded-xl lg:rounded-2xl shadow-sm flex items-center justify-center border-2 border-white flex-shrink-0">
                      <IoCalendarSharp className="w-6 lg:w-8 h-6 lg:h-8 text-[#079CB6]"/>
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-semibold" style={{ color: '#193650' }}>
                      Rostering & HR
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#304A61' }}>
                    Automated rostering and HR tools that manage shifts, absences, onboarding, and contracts while adapting to staff availability.
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3 lg:space-y-4">
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
                        className="flex items-center gap-3 lg:gap-4"
                      >
                        <div className="w-4 lg:w-5 h-4 lg:h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-2.5 lg:w-3 h-2.5 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm lg:text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Image - Mobile Only (Full Width Below List) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:hidden w-full"
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

                {/* Right Content - Image (Desktop Only) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="hidden lg:block relative"
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
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Referral Management Section */}
      <section 
        ref={(el) => { sectionRefs.current.referral = el; }}
        className="sticky top-33 bg-[#fef6e6] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('referral') ? 'auto' : '80px', 
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
              className="py-12 px-4 lg:px-0 lg:py-20"
            >
              <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-[90px]">
                {/* Left Content */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Icon & Heading */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-4 md:space-y-0">
                    <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-b from-yellow-100 to-[#ffffff] rounded-xl lg:rounded-2xl shadow-sm flex items-center justify-center border-2 border-white flex-shrink-0">
                      <svg className="w-6 lg:w-8 h-6 lg:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-semibold" style={{ color: '#193650' }}>
                      Referral Management
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#304A61' }}>
                    Manage referrals from first enquiry to placement with structured workflows, AI-assisted assessments, and insights into care needs.
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3 lg:space-y-4">
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
                        className="flex items-center gap-3 lg:gap-4"
                      >
                        <div className="w-4 lg:w-5 h-4 lg:h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-2.5 lg:w-3 h-2.5 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm lg:text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Image - Mobile Only (Full Width Below List) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:hidden w-full"
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

                {/* Right Content - Image (Desktop Only) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="hidden lg:block relative"
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
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Care Planning Section */}
      <section 
        ref={(el) => { sectionRefs.current.careplanning = el; }}
        className="sticky top-33 bg-[#f6eefb] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('careplanning') ? 'auto' : '80px', 
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
              className="py-12 px-4 lg:px-0 lg:py-20"
            >
              <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-[90px]">
                {/* Left Content */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Icon & Heading */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-4 md:space-y-0">
                    <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-b from-[#e7d0f5] to-[##FFFFFF] rounded-xl lg:rounded-2xl shadow-sm flex items-center justify-center border-2 border-white flex-shrink-0">
                      <RiHandHeartFill className="w-6 lg:w-8 h-6 lg:h-8 text-purple-600"/>
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-semibold" style={{ color: '#193650' }}>
                      Care Planning
                    </h3>
                  </div>
                  
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#304A61' }}>
                    Digital care planning with AI-assisted notes, intelligent eMAR, and insights to support proactive care decisions.
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3 lg:space-y-4">
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
                        className="flex items-center gap-3 lg:gap-4"
                      >
                        <div className="w-4 lg:w-5 h-4 lg:h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-2.5 lg:w-3 h-2.5 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm lg:text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Image - Mobile Only (Full Width Below List) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:hidden w-full"
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

                {/* Right Content - Image (Desktop Only) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="hidden lg:block relative"
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
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Compliance Section */}
      <section 
        ref={(el) => { sectionRefs.current.compliance = el; }}
        className="sticky top-33 bg-[#fae9e9] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('compliance') ? 'auto' : '80px', 
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
              className="py-12 px-4 lg:px-0 lg:py-20"
            >
              <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-[90px]">
                {/* Left Content */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Icon & Heading */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-4 md:space-y-0">
                    <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-b from-red-100 to-[#ffffff] rounded-xl lg:rounded-2xl shadow-sm flex items-center justify-center border-2 border-white flex-shrink-0">
                      <svg className="w-6 lg:w-8 h-6 lg:h-8 text-[#DF6E6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-semibold" style={{ color: '#193650' }}>
                      Compliance
                    </h3>
                  </div>
                  
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#304A61' }}>
                    Identify gaps early with AI-assisted mock inspections, alerts, and structured compliance records.
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3 lg:space-y-4">
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
                        className="flex items-center gap-3 lg:gap-4"
                      >
                        <div className="w-4 lg:w-5 h-4 lg:h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-2.5 lg:w-3 h-2.5 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm lg:text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Image - Mobile Only (Full Width Below List) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:hidden w-full"
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

                {/* Right Content - Image (Desktop Only) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="hidden lg:block relative"
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
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Payroll & Finance Section */}
      <section 
        ref={(el) => { sectionRefs.current.payroll = el; }}
        className="sticky top-33 bg-[#ecf6ea] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('payroll') ? 'auto' : '80px', 
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
              className="py-12 px-4 lg:px-0 lg:py-20"
            >
              <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-[90px]">
                {/* Left Content */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Icon & Heading */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-4 md:space-y-0">
                    <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-b from-[#d7edd2] to-[#ffffff] rounded-xl lg:rounded-2xl shadow-sm flex items-center justify-center border-2 border-white flex-shrink-0">
                      <TbReportMoney className="w-6 lg:w-8 h-6 lg:h-8 text-[#5DBA4C]"/>
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-semibold" style={{ color: '#193650' }}>
                      Payroll & Finance
                    </h3>
                  </div>
                  
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#304A61' }}>
                    Gain clear visibility into payroll, income, costs, and financial performance across your care services.
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3 lg:space-y-4">
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
                        className="flex items-center gap-3 lg:gap-4"
                      >
                        <div className="w-4 lg:w-5 h-4 lg:h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-2.5 lg:w-3 h-2.5 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm lg:text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Image - Mobile Only (Full Width Below List) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:hidden w-full"
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

                {/* Right Content - Image (Desktop Only) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="hidden lg:block relative"
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
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Trainings Section */}
      <section 
        ref={(el) => { sectionRefs.current.trainings = el; }}
        className="sticky top-33 bg-[#ffecfa] rounded-t-3xl transition-all duration-300" 
        style={{ 
          minHeight: isExpanded('trainings') ? 'auto' : '80px', 
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
              className="py-12 px-4 lg:px-0 lg:py-20"
            >
              <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-[90px]">
                {/* Left Content */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Icon & Heading */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-4 md:space-y-0">
                    <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-b from-[#ffddf6] to-[#ffffff] rounded-xl lg:rounded-2xl shadow-sm flex items-center justify-center border-2 border-white flex-shrink-0">
                      <svg className="w-6 lg:w-8 h-6 lg:h-8 text-[#D31CA3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-semibold" style={{ color: '#193650' }}>
                      Trainings
                    </h3>
                  </div>
                  
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#304A61' }}>
                    Centralised training management that tracks mandatory courses, monitors progress, and ensures staff remain compliant and up to date.
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3 lg:space-y-4">
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
                        className="flex items-center gap-3 lg:gap-4"
                      >
                        <div className="w-4 lg:w-5 h-4 lg:h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#078C96' }}>
                          <svg className="w-2.5 lg:w-3 h-2.5 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm lg:text-lg" style={{ color: '#304A61' }}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Image - Mobile Only (Full Width Below List) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:hidden w-full"
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

                {/* Right Content - Image (Desktop Only) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="hidden lg:block relative"
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
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Mobile App Section */}
      <section className="py-12 lg:py-42 bg-gradient-to-b from-[#1a2332] via-[#1e2a3a] to-[#152a35] relative overflow-hidden z-[70]">
        {/* Background Circle Pattern - Upper Half Only */}
        <div className="absolute top-100 left-0 right-0 h-full opacity-50 overflow-hidden hidden lg:block">
          <Image 
            src="/assets/images/style/circles.svg" 
            alt="" 
            width={1200}
            height={600}
            className="w-full h-auto object-contain object-top scale-80"
          />
        </div>

        {/* Color Spots */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl hidden lg:block"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl hidden lg:block"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-3xl"></div>

        <div className="container-1200 relative z-10 px-4 sm:px-6 lg:px-0">
          <div className="text-center mb-8 sm:mb-10 lg:mb-30">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm lg:text-sm uppercase tracking-wider mb-3 lg:mb-4"
            >
              Mobile App
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            >
              Everything <span className="gradient-text-animated bg-linear-to-r from-teal-600 via-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">You Need</span>
            </motion.h2>
          </div>

          {/* Mobile Layout (Below 1024px) */}
          <div className="lg:hidden px-0 sm:px-4 max-w-sm mx-auto">
            {/* Feature Grid - Single Column */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  ),
                  title: "Notifications & alerts",
                  description: "Stay updated with important announcements"
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: "Today's shift details",
                  description: "See your upcoming shifts at a glance"
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "One-tap clock in",
                  description: "Easily clock in/out with a single tap"
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Upcoming shift info",
                  description: "See when and where you're working next"
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ),
                  title: "Hours worked",
                  description: "Monitor total hours worked in real time"
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: "Real time earnings",
                  description: "Track wages earned so far"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Phone Mockup - Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img 
                src="/assets/images/phone.svg" 
                alt="Mobile App Interface" 
                className="w-[240px] h-auto"
              />
            </motion.div>
          </div>

          {/* Desktop Layout (1024px and above) */}
          <div className="relative hidden lg:flex items-center justify-center gap-32">
            {/* Left Side - Features */}
            <div className="flex-1 max-w-[240px] flex flex-col justify-center pt-48">
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
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                    {/* Arrow - right side of feature */}
                    <div className={`absolute -right-22 -top-8 ${index===1?'top-8':null}  -translate-y-1/2 translate-x-8 w-20 h-20`}>
                      <img 
                        src={`/assets/images/style/arrows/${index === 0 ? 'left_bottom.svg' : index === 1 ? 'left.svg' : 'left_more_bottom.svg'}`}
                        alt="" 
                        className="w-full h-full brightness-0 invert opacity-90"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Center - Phone Mockup */}
            <div className="flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <img 
                  src="/assets/images/phone.svg" 
                  alt="Mobile App Interface" 
                  className="w-[280px] h-auto"
                />
              </motion.div>
            </div>

            {/* Right Side - Features */}
            <div className="flex-1 max-w-[240px] flex flex-col justify-start -mt-32">
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
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                    {/* Arrow - left side of feature */}
                    <div className="absolute -left-22 top-1/2 -translate-y-1/2 -translate-x-8 w-20 h-20">
                      <img 
                        src={`/assets/images/style/arrows/${index === 0 ? 'right_top.svg' : index === 1 ? 'right.svg' : 'right_bottom.svg'}`}
                        alt="" 
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
      <section className="px-4 sm:px-6 lg:px-0 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden z-[70]">
        {/* Background Color Spots */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="relative w-full h-full">
            <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-purple-200/30 rounded-full" style={{ filter: 'blur(100px)' }}></div>
            <div className="absolute bottom-20 right-20 w-[450px] h-[450px] bg-pink-200/30 rounded-full" style={{ filter: 'blur(100px)' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 rounded-full" style={{ filter: 'blur(120px)' }}></div>
          </div>
        </div>

        <div className="container-1200 relative z-10 px-8 lg:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium">
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
                  className="rounded-[24px] border border-[#DCCEE9] p-6 md:px-16 md:py-12 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8"
                  style={{ 
                    background: 'rgba(191, 165, 215, 0.09)',
                    backdropFilter: 'blur(21.55px)'
                  }}
                >
                  <div className="w-16 h-16 bg-[#e592a2] md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 relative">
                    <Image 
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <p className="text-base md:text-xl font-semibold text-[#193650] mb-4 md:mb-6 leading-relaxed">
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
            {/* <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 flex justify-center gap-2">
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
            </div> */}
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section ref={getInTouchRef} className="bg-white relative z-[70] px-4 sm:px-6 lg:px-0">
        <AnimatePresence mode="wait">
          {formStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center relative px-8 sm:px-16 lg:px-30 py-20"
              style={{
                background: "radial-gradient(ellipse 77.23px 265.81px at 49.5% 92.87%, rgba(255,255,255,1) 0%, rgba(244,250,251,1) 100%)",
                minHeight: "413px",
                gap: "48px",
              }}
            >
              {/* Icon group - exact Figma dimensions */}
              <div className="relative shrink-0" style={{ width: '138.425px', height: '102px' }}>
                <div className="absolute" style={{ inset: '-163.83% -98.91% -120.97% -94.4%' }}>
                  <svg width="407" height="393" viewBox="0 0 407 393" fill="none" xmlns="http://www.w3.org/2000/svg" className="block max-w-none w-full h-full">
                    <foreignObject x="154.847" y="151.723" width="129.636" height="125.241"><div style={{backdropFilter:'blur(7.69px)',clipPath:'url(#bgblur_0_755_1083_clip_path)',height:'100%',width:'100%'}}></div></foreignObject>
                    <g filter="url(#filter0_d_755_1083)">
                      <path d="M254.272 167.104C258.205 167.104 261.978 168.666 264.759 171.448C267.54 174.229 269.103 178.002 269.103 181.935V231.373C269.103 235.306 267.54 239.078 264.759 241.86C261.978 244.641 258.205 246.204 254.272 246.204H185.059C181.125 246.204 177.353 244.641 174.571 241.86C171.79 239.078 170.228 235.306 170.228 231.373V181.935C170.228 178.002 171.79 174.229 174.571 171.448C177.353 168.666 181.125 167.104 185.059 167.104H254.272Z" fill="url(#paint0_linear_755_1083)"/>
                    </g>
                    <g filter="url(#filter1_f_755_1083)">
                      <path d="M226.69 169.186C229.381 169.186 231.962 170.256 233.865 172.159C235.768 174.062 236.837 176.642 236.838 179.333V213.16C236.837 215.851 235.768 218.431 233.865 220.334C231.962 222.237 229.381 223.307 226.69 223.307H179.334C176.642 223.307 174.062 222.237 172.159 220.334C170.256 218.431 169.186 215.851 169.186 213.16V179.333C169.186 176.642 170.256 174.062 172.159 172.159C174.062 170.256 176.642 169.186 179.334 169.186H226.69Z" fill="url(#paint1_linear_755_1083)"/>
                    </g>
                    <foreignObject x="115.297" y="174.623" width="129.636" height="125.242"><div style={{backdropFilter:'blur(7.69px)',clipPath:'url(#bgblur_1_755_1083_clip_path)',height:'100%',width:'100%'}}></div></foreignObject>
                    <g filter="url(#filter2_d_755_1083)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M145.509 269.104C141.575 269.104 137.803 267.541 135.021 264.76C132.24 261.979 130.677 258.206 130.677 254.273V204.835C130.677 200.902 132.24 197.129 135.021 194.348C137.803 191.566 141.575 190.004 145.509 190.004H214.721C218.655 190.004 222.427 191.566 225.209 194.348C227.99 197.129 229.553 200.902 229.553 204.835V254.273C229.553 258.206 227.99 261.979 225.209 264.76C222.427 267.541 218.655 269.104 214.721 269.104H145.509ZM158.486 210.867C157.982 210.437 157.398 210.112 156.766 209.912C156.135 209.713 155.47 209.642 154.81 209.704C154.151 209.767 153.511 209.961 152.928 210.275C152.346 210.59 151.832 211.018 151.418 211.535C151.004 212.052 150.698 212.646 150.518 213.284C150.338 213.921 150.288 214.588 150.371 215.245C150.454 215.902 150.668 216.536 151 217.108C151.333 217.681 151.777 218.181 152.306 218.579L170.845 233.415C173.476 235.521 176.745 236.669 180.115 236.669C183.485 236.669 186.754 235.521 189.385 233.415L207.924 218.584C208.431 218.178 208.853 217.676 209.166 217.107C209.479 216.538 209.677 215.913 209.749 215.268C209.82 214.623 209.764 213.969 209.583 213.346C209.403 212.722 209.101 212.14 208.695 211.633C208.289 211.126 207.787 210.704 207.218 210.39C206.65 210.077 206.025 209.879 205.379 209.808C204.734 209.736 204.08 209.792 203.457 209.973C202.833 210.154 202.251 210.456 201.744 210.862L183.205 225.693C182.328 226.395 181.238 226.777 180.115 226.777C178.992 226.777 177.902 226.395 177.025 225.693L158.486 210.867Z" fill="url(#paint2_linear_755_1083)" shapeRendering="crispEdges"/>
                      <path d="M145.509 191.927H214.721C218.145 191.927 221.429 193.286 223.849 195.707C226.27 198.128 227.63 201.411 227.63 204.835V254.272C227.63 257.696 226.27 260.98 223.849 263.4C221.429 265.821 218.145 267.182 214.721 267.182H145.509C142.085 267.182 138.801 265.821 136.381 263.4C133.96 260.98 132.6 257.696 132.6 254.272V204.835C132.6 201.411 133.96 198.128 136.381 195.707C138.801 193.286 142.085 191.927 145.509 191.927ZM157.345 208.079C156.469 207.802 155.545 207.704 154.63 207.79C153.714 207.877 152.825 208.146 152.015 208.583C151.206 209.02 150.493 209.615 149.918 210.333C149.343 211.051 148.917 211.877 148.668 212.762C148.418 213.647 148.349 214.573 148.464 215.485C148.579 216.398 148.876 217.278 149.338 218.073C149.79 218.852 150.391 219.533 151.105 220.079V220.08L169.644 234.916C172.616 237.295 176.309 238.591 180.115 238.591C183.803 238.591 187.384 237.375 190.305 235.136L190.586 234.916L209.125 220.085C209.829 219.521 210.415 218.824 210.85 218.034C211.285 217.244 211.56 216.377 211.66 215.48C211.759 214.584 211.681 213.677 211.429 212.811C211.178 211.944 210.76 211.136 210.196 210.432C209.633 209.727 208.935 209.141 208.145 208.706C207.355 208.271 206.488 207.996 205.592 207.896C204.695 207.797 203.788 207.876 202.922 208.127C202.164 208.347 201.45 208.695 200.811 209.156L200.543 209.36L182.004 224.191V224.192C181.468 224.621 180.801 224.854 180.115 224.854C179.429 224.854 178.762 224.621 178.226 224.192V224.191L159.687 209.365H159.686C158.998 208.788 158.203 208.35 157.345 208.079Z" stroke="url(#paint3_linear_755_1083)" strokeWidth="3.84514" shapeRendering="crispEdges"/>
                    </g>
                    <defs>
                      <filter id="filter0_d_755_1083" x="154.847" y="151.723" width="129.636" height="125.241" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="15.3806"/>
                        <feGaussianBlur stdDeviation="7.69028"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_755_1083"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_755_1083" result="shape"/>
                      </filter>
                      <clipPath id="bgblur_0_755_1083_clip_path" transform="translate(-154.847 -151.723)"><path d="M254.272 167.104C258.205 167.104 261.978 168.666 264.759 171.448C267.54 174.229 269.103 178.002 269.103 181.935V231.373C269.103 235.306 267.54 239.078 264.759 241.86C261.978 244.641 258.205 246.204 254.272 246.204H185.059C181.125 246.204 177.353 244.641 174.571 241.86C171.79 239.078 170.228 235.306 170.228 231.373V181.935C170.228 178.002 171.79 174.229 174.571 171.448C177.353 168.666 181.125 167.104 185.059 167.104H254.272Z"/></clipPath>
                      <filter id="filter1_f_755_1083" x="0" y="0" width="406.024" height="392.493" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="84.5931" result="effect1_foregroundBlur_755_1083"/>
                      </filter>
                      <filter id="filter2_d_755_1083" x="115.297" y="174.623" width="129.636" height="125.242" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="15.3806"/>
                        <feGaussianBlur stdDeviation="7.69028"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_755_1083"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_755_1083" result="shape"/>
                      </filter>
                      <clipPath id="bgblur_1_755_1083_clip_path" transform="translate(-115.297 -174.623)"><path fillRule="evenodd" clipRule="evenodd" d="M145.509 269.104C141.575 269.104 137.803 267.541 135.021 264.76C132.24 261.979 130.677 258.206 130.677 254.273V204.835C130.677 200.902 132.24 197.129 135.021 194.348C137.803 191.566 141.575 190.004 145.509 190.004H214.721C218.655 190.004 222.427 191.566 225.209 194.348C227.99 197.129 229.553 200.902 229.553 204.835V254.273C229.553 258.206 227.99 261.979 225.209 264.76C222.427 267.541 218.655 269.104 214.721 269.104H145.509ZM158.486 210.867C157.982 210.437 157.398 210.112 156.766 209.912C156.135 209.713 155.47 209.642 154.81 209.704C154.151 209.767 153.511 209.961 152.928 210.275C152.346 210.59 151.832 211.018 151.418 211.535C151.004 212.052 150.698 212.646 150.518 213.284C150.338 213.921 150.288 214.588 150.371 215.245C150.454 215.902 150.668 216.536 151 217.108C151.333 217.681 151.777 218.181 152.306 218.579L170.845 233.415C173.476 235.521 176.745 236.669 180.115 236.669C183.485 236.669 186.754 235.521 189.385 233.415L207.924 218.584C208.431 218.178 208.853 217.676 209.166 217.107C209.479 216.538 209.677 215.913 209.749 215.268C209.82 214.623 209.764 213.969 209.583 213.346C209.403 212.722 209.101 212.14 208.695 211.633C208.289 211.126 207.787 210.704 207.218 210.39C206.65 210.077 206.025 209.879 205.379 209.808C204.734 209.736 204.08 209.792 203.457 209.973C202.833 210.154 202.251 210.456 201.744 210.862L183.205 225.693C182.328 226.395 181.238 226.777 180.115 226.777C178.992 226.777 177.902 226.395 177.025 225.693L158.486 210.867Z"/></clipPath>
                      <linearGradient id="paint0_linear_755_1083" x1="259.736" y1="238.918" x2="151.494" y2="149.41" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#078C96"/>
                        <stop offset="1" stopColor="white"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_755_1083" x1="230.428" y1="218.322" x2="156.368" y2="157.08" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF0000"/>
                        <stop offset="1" stopColor="white"/>
                      </linearGradient>
                      <linearGradient id="paint2_linear_755_1083" x1="115.846" y1="277.014" x2="205.467" y2="169.859" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0.2"/>
                        <stop offset="1" stopColor="white" stopOpacity="0.5"/>
                      </linearGradient>
                      <linearGradient id="paint3_linear_755_1083" x1="219.665" y1="277.014" x2="152.792" y2="177.17" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0"/>
                        <stop offset="1" stopColor="white"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Check badge - positioned like Figma: absolute left=630px from 1200px container, top=129px */}
              <div className="absolute" style={{ left: '52.5%', top: '129px', width: '60px', height: '60px' }}>
                <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="block max-w-none w-full h-full" style={{ margin: '0 -20% -40% -20%', width: '140%', height: '140%' }}>
                  <circle cx="48" cy="38" r="26" fill="white" stroke="#078C96" strokeWidth="3"/>
                  <path d="M36 38L44 46L60 30" stroke="#078C96" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Text */}
              <div className="flex flex-col items-center" style={{ gap: '24px' }}>
                <h2 className="font-bold text-[#078C96] text-center" style={{ fontSize: '40px', lineHeight: '50px' }}>
                  Request sent Successfully..!
                </h2>
                <p className="font-normal text-[#5E7284] text-center" style={{ fontSize: '18px', lineHeight: '29px' }}>
                  Our team will reach out to you shortly.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-12 sm:py-16 lg:py-24"
            >
              <div className="container-1200 px-4 sm:px-6 lg:px-0">
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

                <form
                  className="space-y-6"
                  onSubmit={handleFormSubmit}
                  action="https://api.web3forms.com/submit"
                  method="POST"
                >
                  <input type="hidden" name="access_key" value="98dc8459-782f-438b-bdfa-0d909693e1c2" />
                  <input type="hidden" name="subject" value="New Contact Form Submission - Caelan" />
                  <input type="hidden" name="from_name" value="Caelan Contact Form" />
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
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base text-black"
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
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base text-black"
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
                      value={formData.company}
                      onChange={handleFormChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base text-black"
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
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-base text-black"
                      placeholder=""
                      style={{color:'black !important'}}
                    ></textarea>
                  </motion.div>

                  {formStatus === "error" && (
                    <p className="text-red-600 font-medium text-center py-3 bg-red-50 rounded-lg">{formError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="w-full px-8 py-5 text-white rounded-lg text-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{
                      background: 'linear-gradient(90deg, #0d9488, #06b6d4, #2563eb, #7c3aed)',
                      backgroundSize: '200% auto',
                      animation: 'gradient 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  >
                    {formStatus === "sending" ? "Sending..." : "Get in Touch"}
                    {formStatus !== "sending" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-0 bg-gradient-to-b from-[#051018] from-30% to-[#174E67] text-white relative z-[70] overflow-hidden" style={{ minHeight: '650px' }}>
        <div className="container-1200 pt-12 sm:pt-16 lg:pt-19 flex flex-col justify-between px-4 sm:px-6 lg:px-0" style={{ minHeight: '650px' }}>
          {/* Logo Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-18"
          >
            <div className="flex items-center gap-3">
              <img src="assets/images/logo_light.svg" alt="Caelan" className="w-46" />
            </div>
          </motion.div>

          {/* Contact Info Cards - Full Width */}
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactCards.map((card, index) => {
              const IconComponent = card.icon;
              const handleClick = () => {
                if (card.icon === HiLocationMarker) {
                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.text)}`, '_blank');
                } else if (card.icon === HiMail) {
                  window.location.href = `mailto:${card.text}`;
                } else if (card.icon === FaLinkedin) {
                  window.open('https://www.linkedin.com/company/caelan-care', '_blank');
                } else if (card.icon === HiPhone) {
                  window.location.href = `tel:${card.text}`;
                }
              };
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={handleClick}
                  className="bg-[#0D2636] rounded-2xl p-6 border border-[#1B3A4D] hover:border-teal-500 transition-colors group relative flex flex-col justify-center items-start gap-4 flex-1 self-stretch cursor-pointer"
                >
                  {card.showExternalLink && (
                    <FaExternalLinkAlt className="w-4 h-4 text-white absolute top-6 right-6" />
                  )}
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600 transition-colors`}>
                    <IconComponent className={`w-6 h-6 ${card.iconColor} group-hover:text-white transition-colors`} />
                  </div>
                  <p className="text-sm text-white font-normal">{card.text}</p>
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
            <p className="absolute -top-5 left-1/2 -translate-x-1/2 font-semibold text-white/5 leading-none select-none whitespace-nowrap" style={{ fontSize: 'clamp(100px, 20vw, 300px)' }}>Caelan</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

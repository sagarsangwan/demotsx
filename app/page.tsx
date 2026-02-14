'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

import elephantIdle from '@/public/elephant-idle.json';
import elephantHappy from '@/public/elephant-happy.json';
import sparrowFlying from '@/public/sparrow.json';

export default function ValentinePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Baby';

  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const phrases = [
    "No 😐",
    "Are you really sure? 🥺",
    "Think again 😤",
    "Dare you to say no again 😏",
    "You're testing me now 😭",
    "My heart can't take this 💔",
    "Last chance... choose wisely 😌"
  ];

  const handleNoClick = () => {
    setNoCount((prev) => prev + 1);
  };

  const handleNoHover = () => {
    if (!isMobile) {
      const padding = 150;
      const maxX = window.innerWidth / 2 - padding;
      const maxY = window.innerHeight / 3;

      const x = (Math.random() - 0.5) * maxX;
      const y = (Math.random() - 0.5) * maxY;

      setPosition({ x, y });
    }
  };

  const handleYesClick = () => {
    setYesPressed(true);
    confetti({
      particleCount: 180,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#FF69B4', '#FFC0CB']
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 to-pink-100 px-4 overflow-hidden relative">

      {/* Floating Background Hearts */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none text-rose-200 text-7xl opacity-10"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        💖 💕 💗 💞 💘
      </motion.div>

      {/* Sparrow */}
      <motion.div
        className="absolute top-10 right-6 md:right-20 z-10 flex flex-col items-center"
        animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <div className="w-24 h-24 md:w-40 md:h-40">
          <Lottie animationData={sparrowFlying} loop />
        </div>
        <span className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs md:text-sm font-bold text-rose-500 shadow-sm -mt-4 border border-rose-100">
          Bubu 🐦
        </span>
      </motion.div>

      <div className="text-center z-10 w-full max-w-md flex flex-col items-center">

        {/* Elephant */}
        <div className="relative mb-6 flex flex-col items-center">

          <motion.span
            className="absolute -top-8 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs md:text-sm font-bold text-sky-600 shadow-sm border border-sky-100"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Dudu 🐘
          </motion.span>

          <div className="w-64 h-64 md:w-80 md:h-80">
            <AnimatePresence mode="wait">
              {yesPressed ? (
                <motion.div
                  key="happy"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Lottie animationData={elephantHappy} loop />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Lottie animationData={elephantIdle} loop />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content */}
        {yesPressed ? (
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="text-4xl md:text-6xl font-bold text-rose-600"
          >
            Yay!! Love you {name}! ❤️
          </motion.h1>
        ) : (
          <>
            <h1 className="text-3xl md:text-5xl font-bold text-rose-600 mb-8 leading-tight">
              Will you be my Valentine, {name}?
            </h1>

          <div className="relative flex flex-col items-center justify-center gap-4 min-h-[180px]">

  {/* YES BUTTON */}
  <motion.div
    animate={{
      scale: 1 + noCount * 0.15,
      boxShadow:
        noCount > 2
          ? "0px 0px 40px rgba(225,29,72,0.6)"
          : "0px 10px 20px rgba(0,0,0,0.1)"
    }}
    transition={{ type: "spring", stiffness: 200 }}
    className="z-20"
  >
    <Button
      className="bg-gradient-to-r from-rose-500 to-pink-500 
      hover:from-rose-600 hover:to-pink-600 
      text-white font-bold py-4 px-10 text-xl 
      rounded-full"
      onClick={handleYesClick}
    >
      Yes 💖
    </Button>
  </motion.div>

  {/* NO BUTTON */}
  <motion.div
    className="relative z-10"
    animate={!isMobile ? { x: position.x, y: position.y } : {}}
    transition={{ type: "spring", stiffness: 500, damping: 25 }}
    onMouseEnter={handleNoHover}
  >
    <Button
      variant="secondary"
      className="bg-slate-200 hover:bg-slate-300 
      text-slate-700 font-medium py-3 px-6 
      rounded-full"
      onClick={handleNoClick}
    >
      {phrases[Math.min(noCount, phrases.length - 1)]}
    </Button>
  </motion.div>

</div>


            {/* Emotional escalation text */}
            {noCount > 3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-rose-500 font-medium"
              >
                You keep pressing no… but destiny says yes 😌
              </motion.p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

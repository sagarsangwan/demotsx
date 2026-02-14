'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

// Dynamic import for Lottie to prevent SSR hydration errors
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Import your JSON files directly
import elephantIdle from '@/public/elephant-idle.json';
import elephantHappy from '@/public/elephant-happy.json';
import sparrowFlying from '@/public/sparrow.json';

export default function ValentinePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Baby'; // Default if no name provided

  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Desktop "Runaway" State
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 1. Detect Screen Size (Hydration Safe)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. The "Guilt Trip" Text Array
  const phrases = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it another thought!",
    "Are you absolutely certain?",
    "This could be a mistake!",
    "Have a heart!",
    "Don't be so cold!",
    "Change of heart?",
    "Wouldn't you reconsider?",
    "Is that your final answer?",
    "You're breaking my heart ;(",
    "Plsss? :( You're my fav person"
  ];

  // 3. Logic: Handle "No" Interaction
  const handleNoClick = () => {
    if (isMobile) {
      setNoCount(noCount + 1);
    }
  };

  const handleNoHover = () => {
    if (!isMobile) {
      // Calculate random position within viewport, ensuring it stays on screen
      // We limit movement to +/- 300px from center to keep it visible but annoying
      const x = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2 - 100);
      const y = Math.random() * (window.innerHeight - 200) - (window.innerHeight / 2 - 100);
      setPosition({ x, y });
    }
  };

  // 4. Logic: Handle "Yes" Interaction
  const handleYesClick = () => {
    setYesPressed(true);
    // Fire confetti from center
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#FF69B4', '#FFC0CB'] // Rose/Pink colors
    });
    
    // Optional: Fire a second burst for effect
    setTimeout(() => confetti({ particleCount: 50, spread: 100, origin: { y: 0.7 } }), 500);
  };

  // Dynamic size for "Yes" button (grows as she clicks No on mobile)
  const yesButtonSize = noCount * 20 + 16;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 px-4 overflow-hidden relative selection:bg-rose-200">
      
      {/* --- Floating Sparrow (Her) --- */}
      {/* Represents her hovering around you. Top right position. */}
      <motion.div
        className="absolute top-10 right-10 w-24 h-24 z-10 pointer-events-none"
        animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <Lottie animationData={sparrowFlying} loop={true} />
      </motion.div>

      <div className="text-center z-10 w-full max-w-md flex flex-col items-center">
        
        {/* --- Elephant (You) --- */}
        <div className="relative w-64 h-64 mb-6">
          <AnimatePresence mode="wait">
            {yesPressed ? (
              <motion.div
                key="happy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <Lottie animationData={elephantHappy} loop={true} />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <Lottie animationData={elephantIdle} loop={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Text & Buttons --- */}
        {yesPressed ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h1 className="text-4xl font-bold text-rose-600 font-sans tracking-tight">
              Yay!! Love you {name}! ❤️
            </h1>
            <p className="mt-4 text-rose-800 text-lg">
              (I knew you&apos;d say yes 😉)
            </p>
          </motion.div>
        ) : (
          <>
            <h1 className="text-3xl md:text-5xl font-bold text-rose-600 mb-8 font-sans leading-tight tracking-tight drop-shadow-sm">
              Will you be my Valentine, {name}?
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full relative">
              
              {/* YES Button */}
              <Button
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all duration-300 shadow-xl shadow-rose-200 rounded-full z-20"
                style={{ fontSize: yesButtonSize, padding: `${noCount * 2 + 10}px ${noCount * 5 + 20}px` }}
                onClick={handleYesClick}
              >
                Yes
              </Button>

              {/* NO Button (Tricky Logic) */}
              <motion.div
                className="relative inline-block"
                animate={!isMobile ? { x: position.x, y: position.y } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onMouseEnter={handleNoHover} // Desktop: Run away
              >
                <Button
                  variant="secondary"
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-all duration-300 rounded-full min-w-[100px]"
                  onClick={handleNoClick} // Mobile: Shrink/Change Text
                  style={isMobile ? { transform: `scale(${Math.max(0.6, 1 - noCount * 0.1)})` } : {}}
                >
                  {phrases[Math.min(noCount, phrases.length - 1)]}
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
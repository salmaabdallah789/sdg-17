import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface StoryFrame {
  text: string;
  icon: string;
  delay: number;
}

const StoryIntroPage = () => {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [character, setCharacter] = useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    const savedCharacter = localStorage.getItem('game-character');
    if (savedCharacter) {
      setCharacter(JSON.parse(savedCharacter));
    } else {
      navigate('/character');
      return;
    }
  }, [navigate]);

  const storyFrames: StoryFrame[] = [
    {
      text: `The year is 2024. ${character?.name || 'You'} are a decision-maker in your community.`,
      icon: '📅',
      delay: 2000
    },
    {
      text: 'You receive a mysterious invitation to participate in a time-travel experiment.',
      icon: '✉️',
      delay: 3000
    },
    {
      text: 'The mission: Travel to 2035 and help communities navigate crises using AI and ethical decision-making.',
      icon: '🚀',
      delay: 3000
    },
    {
      text: 'You step into the time machine, feeling a strange sensation as reality shifts around you...',
      icon: '⚡',
      delay: 3000
    },
    {
      text: 'The world around you transforms. Buildings look different. Technology is everywhere.',
      icon: '🌆',
      delay: 3000
    },
    {
      text: 'Welcome to 2035. Your journey begins now.',
      icon: '🌍',
      delay: 2500
    }
  ];

  useEffect(() => {
    if (currentFrame < storyFrames.length - 1) {
      const timer = setTimeout(() => {
        setCurrentFrame(currentFrame + 1);
      }, storyFrames[currentFrame].delay);
      return () => clearTimeout(timer);
    } else {
      // After last frame, wait a bit then navigate
      const timer = setTimeout(() => {
        navigate('/simulate');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentFrame, navigate]);

  const handleSkip = () => {
    navigate('/simulate');
  };

  if (!character) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrame}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-8xl mb-8"
            >
              {storyFrames[currentFrame].icon}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white mb-6 leading-relaxed"
            >
              {storyFrames[currentFrame].text}
            </motion.h2>
          </motion.div>
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="mt-12 flex justify-center gap-2">
          {storyFrames.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full ${
                index <= currentFrame ? 'bg-cyan-400' : 'bg-gray-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: index <= currentFrame ? 40 : 10 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleSkip}
          className="mt-8 text-cyan-300 hover:text-cyan-200 text-sm underline"
        >
          Skip Story
        </motion.button>
      </div>
    </div>
  );
};

export default StoryIntroPage;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Character {
  name: string;
  avatar: string;
}

const CharacterCreationPage = () => {
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const [error, setError] = useState('');

  const avatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🎓', '👩‍🎓', '🧑‍⚕️', '👨‍🚀', '👩‍🚀'];

  const handleContinue = () => {
    if (!characterName.trim()) {
      setError('Please enter a name for your character');
      return;
    }
    if (characterName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    const character: Character = {
      name: characterName.trim(),
      avatar: selectedAvatar
    };

    localStorage.setItem('game-character', JSON.stringify(character));
    navigate('/story-intro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="card bg-slate-800/90 backdrop-blur-sm border-2 border-blue-500/30">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Create Your Character
            </h1>
            <p className="text-blue-200 text-lg">
              You're about to travel to 2035. Who will you be?
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Avatar Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-cyan-300 font-semibold mb-3 text-lg">
                Choose Your Avatar
              </label>
              <div className="grid grid-cols-6 gap-3">
                {avatars.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-5xl p-4 rounded-lg border-2 transition-all ${
                      selectedAvatar === avatar
                        ? 'border-cyan-400 bg-cyan-500/20 scale-110'
                        : 'border-blue-500/30 bg-slate-700/50 hover:border-cyan-300'
                    }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="characterName" className="block text-cyan-300 font-semibold mb-3 text-lg">
                Enter Your Name
              </label>
              <input
                id="characterName"
                type="text"
                value={characterName}
                onChange={(e) => {
                  setCharacterName(e.target.value);
                  setError('');
                }}
                placeholder="Your name..."
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border-2 border-blue-500/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-lg"
                maxLength={20}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            {/* Preview */}
            {characterName.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-900/30 border border-cyan-500/30 rounded-lg p-4 text-center"
              >
                <div className="text-6xl mb-2">{selectedAvatar}</div>
                <p className="text-cyan-300 text-xl font-semibold">{characterName}</p>
                <p className="text-blue-200 text-sm mt-1">Ready to travel to 2035?</p>
              </motion.div>
            )}

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              disabled={!characterName.trim()}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                characterName.trim()
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/50'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to Story →
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CharacterCreationPage;


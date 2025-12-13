import { motion, AnimatePresence } from 'framer-motion';

interface NarrativeLogProps {
  log: string[];
}

const NarrativeLog: React.FC<NarrativeLogProps> = ({ log }) => {
  return (
    <div className="card sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Timeline</h3>
      <div className="space-y-3">
        <AnimatePresence>
          {log.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500"
            >
              {entry}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NarrativeLog;


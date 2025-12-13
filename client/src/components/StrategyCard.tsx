import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FinalSummary } from '../types/game';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface StrategyCardProps {
  summary: FinalSummary;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ summary }) => {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    const text = `
AI Strategy Card

Scenario: ${summary.scenario.name}
${summary.scenario.context}

Most Used AI Tools:
${summary.mostUsedTools.map(tool => `- ${tool}`).join('\n')}

${summary.ethicalDilemma ? `Ethical Dilemma Faced:
Question: ${summary.ethicalDilemma.question}
Your Choice: ${summary.ethicalDilemma.choice}
Impact: ${summary.ethicalDilemma.impact > 0 ? 'Positive' : 'Negative'}

` : ''}
Lesson Learned:
${summary.lesson}

Game Completed: ${summary.scenario.name}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportToPDF = async () => {
    if (!cardRef.current) return;

    setExporting(true);
    try {
      // Capture the card as canvas
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Generate filename with timestamp
      const filename = `SDG17-StrategyCard-${summary.scenario.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      
      // Save PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div 
      ref={cardRef}
      className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Your AI Strategy Card</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Scenario</h3>
          <p className="text-gray-700 font-medium">{summary.scenario.name}</p>
          <p className="text-gray-600 text-sm mt-1">{summary.scenario.context}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Tools You Used Most</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {summary.mostUsedTools.map((tool, index) => (
              <li key={index}>{tool}</li>
            ))}
          </ul>
        </div>

        {summary.ethicalDilemma && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ethical Dilemma You Faced</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Question:</span> {summary.ethicalDilemma.question}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Your Choice:</span> {summary.ethicalDilemma.choice}
              </p>
              <p className="text-sm text-gray-600">
                This decision had a {summary.ethicalDilemma.impact > 0 ? 'positive' : 'negative'} impact on ethical balance.
              </p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Lesson You Learned</h3>
          <div className="bg-white p-4 rounded-lg border-l-4 border-primary-500">
            <p className="text-gray-700 italic">{summary.lesson}</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-300">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="btn-primary flex-1"
          >
            {copied ? '✓ Copied!' : 'Copy Summary'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToPDF}
            disabled={exporting}
            className="btn-secondary"
            title={exporting ? "Exporting..." : "Export as PDF"}
          >
            {exporting ? 'Exporting...' : 'Export as PDF'}
          </motion.button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-1">Future Feature:</p>
          <p>Video reflection upload (2-3 minutes) - Coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;


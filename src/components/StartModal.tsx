import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, AlertCircle } from 'lucide-react';
import { InterviewType } from '../types';

interface Props {
  type: InterviewType;
  onStart: () => void;
  onClose: () => void;
}

export function StartModal({ type, onStart, onClose }: Props) {
  const getTypeInfo = (type: InterviewType) => {
    switch (type) {
      case 'behavioral':
        return {
          title: 'Behavioral Interview',
          description: 'Practice answering questions about your past experiences and behavior.',
          tips: [
            'Use the STAR method (Situation, Task, Action, Result)',
            'Be specific with examples',
            'Keep answers concise but detailed',
          ],
        };
      case 'technical':
        return {
          title: 'Technical Interview',
          description: 'Prepare for technical questions and problem-solving scenarios.',
          tips: [
            'Think out loud while solving problems',
            'Ask clarifying questions when needed',
            'Explain your thought process clearly',
          ],
        };
      case 'product':
        return {
          title: 'Product Management',
          description: 'Practice product strategy and stakeholder management.',
          tips: [
            'Focus on data-driven decisions',
            'Consider multiple stakeholders',
            'Explain trade-offs in your choices',
          ],
        };
      case 'f1-visa':
        return {
          title: 'F1 Student Visa Interview',
          description: 'Prepare for your student visa interview.',
          tips: [
            'Be clear about your study plans',
            'Have financial documentation ready',
            'Show strong ties to home country',
          ],
        };
      case 'b1b2-visa':
        return {
          title: 'B1/B2 Visitor Visa',
          description: 'Practice for visitor visa interviews.',
          tips: [
            'Be clear about visit purpose',
            'Show evidence of return',
            'Demonstrate financial capability',
          ],
        };
      default:
        return {
          title: 'Interview Practice',
          description: 'Practice with custom questions.',
          tips: [
            'Read each question carefully',
            'Take time to structure your response',
            'Be honest and specific',
          ],
        };
    }
  };

  const typeInfo = getTypeInfo(type);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl max-w-lg w-full relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {typeInfo.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {typeInfo.description}
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-blue-800 font-semibold flex items-center mb-3">
                <AlertCircle className="w-5 h-5 mr-2" />
                Tips for Success
              </h3>
              <ul className="space-y-2">
                {typeInfo.tips.map((tip, index) => (
                  <li key={index} className="text-blue-700 text-sm flex items-start">
                    <span className="mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Interview
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { InterviewOption } from '../types';

interface Props {
  interviewTypes: InterviewOption[];
  selectedType: string | null;
  setSelectedType: (type: any) => void;
  setShowStartModal: (show: boolean) => void;
}

export function HomePage({ 
  interviewTypes, 
  selectedType, 
  setSelectedType,
  setShowStartModal 
}: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Practice Interviews with AI
          </h1>
          <p className="text-xl text-gray-600">
            Choose an interview type to start practicing with our AI interviewer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => {
                    setSelectedType(type.id);
                    if (type.id !== 'custom') {
                      setShowStartModal(true);
                    }
                  }}
                  className={`w-full h-full p-6 rounded-xl shadow-md transition-colors ${
                    selectedType === type.id
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${
                      selectedType === type.id
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      {type.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {type.description}
                    </p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
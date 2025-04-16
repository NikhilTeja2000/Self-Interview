import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import { Question } from '../types';

interface Props {
  onSubmit: (questions: Question[]) => void;
  onBack: () => void;
}

export function CustomQuestions({ onSubmit, onBack }: Props) {
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', type: 'custom' }
  ]);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: (questions.length + 1).toString(), text: '', type: 'custom' }
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, text } : q
    ));
  };

  const handleSubmit = () => {
    const emptyQuestions = questions.some(q => !q.text.trim());
    if (emptyQuestions) {
      setError('Please fill in all questions');
      return;
    }
    if (questions.length < 3) {
      setError('Please add at least 3 questions');
      return;
    }
    setError('');
    onSubmit(questions);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={onBack}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to selection
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create Custom Interview
          </h2>

          <div className="space-y-4 mb-6">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <textarea
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                />
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addQuestion}
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <Plus className="w-5 h-5 mr-1" />
              Add Question
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Practice
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
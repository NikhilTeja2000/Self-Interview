import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, BarChart2, MessageSquare, AlertCircle } from 'lucide-react';
import { InterviewSession } from '../types';

interface Props {
  session: InterviewSession;
  onBack: () => void;
}

export function FeedbackView({ session, onBack }: Props) {
  const getAverageScore = () => {
    const scores = session.answers.map(answer => (
      (answer.feedback.clarity + answer.feedback.confidence + answer.feedback.completeness) / 3
    ));
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  const getOverallFeedback = () => {
    const avgScore = parseFloat(getAverageScore());
    if (avgScore >= 9) return "Exceptional performance! You're well-prepared for real interviews.";
    if (avgScore >= 8) return "Great job! With a few minor improvements, you'll be ready.";
    if (avgScore >= 7) return "Good effort! Focus on the suggested improvements.";
    return "Keep practicing! Review the feedback and try again.";
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
          Start New Interview
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-indigo-50 border-b border-indigo-100">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Interview Feedback
              </h2>
              <div className="flex items-center">
                <Award className="w-6 h-6 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold text-indigo-600">
                  {getAverageScore()}
                </span>
              </div>
            </div>
            <p className="mt-2 text-gray-600">
              {getOverallFeedback()}
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-8">
              {session.questions.map((question, index) => {
                const answer = session.answers[index];
                if (!answer) return null;

                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Question {index + 1}
                      </h3>
                      <p className="text-gray-700 mt-1">{question.text}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Your Answer:
                      </h4>
                      <p className="text-gray-600">{answer.text}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <MessageSquare className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">Clarity</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {answer.feedback.clarity}/10
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Award className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-800">Confidence</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {answer.feedback.confidence}/10
                        </div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <BarChart2 className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-purple-800">Completeness</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {answer.feedback.completeness}/10
                        </div>
                      </div>
                    </div>

                    {answer.feedback.suggestions.length > 0 && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                          <h4 className="text-sm font-medium text-yellow-800">
                            Suggestions for Improvement
                          </h4>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                          {answer.feedback.suggestions.map((suggestion, i) => (
                            <li key={i} className="text-sm text-yellow-700">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
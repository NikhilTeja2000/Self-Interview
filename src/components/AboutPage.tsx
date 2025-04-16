import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  BarChart, 
  Mic, 
  Video, 
  Upload 
} from 'lucide-react';

export function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Interviews',
      description: 'Practice with our intelligent AI interviewer that adapts to your responses and provides realistic scenarios.',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Feedback',
      description: 'Get instant feedback on your answers, including clarity, confidence, and areas for improvement.',
    },
    {
      icon: BarChart,
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time with detailed analytics and performance metrics.',
    },
    {
      icon: Mic,
      title: 'Voice Interaction',
      description: 'Natural conversation flow with voice recognition and text-to-speech capabilities.',
    },
    {
      icon: Video,
      title: 'Video Analysis',
      description: 'Optional video recording to analyze your body language and presentation skills.',
    },
    {
      icon: Upload,
      title: 'Custom Questions',
      description: 'Upload your own interview questions or choose from our curated question sets.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About MockMate AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personal AI interview coach that helps you prepare for any type of interview
            with realistic practice sessions and instant feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 bg-indigo-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Choose Interview Type</h3>
              <p className="text-gray-600">Select from various interview types or upload custom questions</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Practice with AI</h3>
              <p className="text-gray-600">Engage in realistic interview scenarios with our AI interviewer</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Feedback</h3>
              <p className="text-gray-600">Receive detailed feedback and track your improvement</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
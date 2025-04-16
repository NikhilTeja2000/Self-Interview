import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Calendar, Clock, Award, ArrowUp, ArrowDown } from 'lucide-react';

export function DashboardPage() {
  const mockStats = {
    totalInterviews: 12,
    averageScore: 8.2,
    streak: 5,
    lastSession: '2024-03-10',
    recentProgress: [
      { date: '2024-03-10', score: 8.5, type: 'behavioral' },
      { date: '2024-03-08', score: 7.8, type: 'technical' },
      { date: '2024-03-05', score: 8.1, type: 'product' },
      { date: '2024-03-03', score: 7.5, type: 'behavioral' },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
          <p className="text-gray-600 mt-2">Track your interview practice journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalInterviews}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BarChart2 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.averageScore}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.streak} days</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Last Session</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(mockStats.lastSession).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
          <div className="space-y-4">
            {mockStats.recentProgress.map((session, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    <p className="font-medium text-gray-900">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{session.type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`flex items-center ${
                    session.score >= 8 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {session.score >= 8 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {session.score}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
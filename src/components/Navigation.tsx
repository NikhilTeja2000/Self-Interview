import React from 'react';
import { motion } from 'framer-motion';
import { Home, Info, BarChart2 } from 'lucide-react';

interface Props {
  currentPage: 'home' | 'about' | 'dashboard';
  onPageChange: (page: 'home' | 'about' | 'dashboard') => void;
}

export function Navigation({ currentPage, onPageChange }: Props) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  ] as const;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                Self Practice AI
              </span>
            </div>
          </div>

          <div className="flex space-x-8">
            {navItems.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => onPageChange(id)}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium relative ${
                  currentPage === id
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5 mr-1" />
                {label}
                {currentPage === id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

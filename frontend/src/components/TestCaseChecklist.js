import React from 'react';
import { motion } from 'framer-motion';

export default function TestCaseChecklist({ testResults }) {
  return (
    <div className="space-y-4">
      {testResults.map((tr, idx) => (
        <motion.div
          key={idx}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`rounded-lg p-3 shadow-tech border-2 ${tr.passed ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <motion.span
              animate={tr.passed ? { scale: [1, 1.2, 1] } : { x: [0, -5, 0] }}
              className={`w-6 h-6 flex items-center justify-center rounded-full ${tr.passed ? 'bg-green-400' : 'bg-red-400'}`}
            >
              {tr.passed ? '✅' : '❌'}
            </motion.span>
            <span className="font-bold text-tech-700">Test Case {idx + 1}</span>
          </div>
          <div className="ml-8 text-xs font-code text-tech-900">
            <div><span className="font-semibold">Input:</span> {tr.input}</div>
            <div><span className="font-semibold">Expected Output:</span> {tr.expected}</div>
            <div><span className="font-semibold">Your Output:</span> {tr.actual}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 
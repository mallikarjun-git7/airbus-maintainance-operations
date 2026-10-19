import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StatusStepperProps {
  currentStatus: 'pending' | 'in-progress' | 'resolved' | 'closed';
  onStatusChange?: (status: 'pending' | 'in-progress' | 'resolved' | 'closed') => void;
  readOnly?: boolean;
}

const STEPS = [
  { key: 'pending', label: 'New Request', color: 'bg-blue-300' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-yellow-300' },
  { key: 'resolved', label: 'Repaired', color: 'bg-green-300' },
  { key: 'closed', label: 'Scrap', color: 'bg-red-300' },
];

export const StatusStepper: React.FC<StatusStepperProps> = ({
  currentStatus,
  onStatusChange,
  readOnly = false,
}) => {
  const currentIndex = STEPS.findIndex(s => s.key === currentStatus);

  return (
    <div className="flex items-center justify-between gap-2">
      {STEPS.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = step.key === currentStatus;

        return (
          <React.Fragment key={step.key}>
            {/* Step Circle */}
            <motion.button
              onClick={() => !readOnly && onStatusChange && onStatusChange(step.key as any)}
              disabled={readOnly}
              className={`relative flex-shrink-0 w-12 h-12 rounded-full border-4 border-black flex items-center justify-center font-bold text-sm transition ${
                isActive ? `${step.color} text-black` : 'bg-gray-200 text-gray-400'
              } ${!readOnly ? 'cursor-pointer hover:shadow-brutal' : 'cursor-default'}`}
              whileHover={!readOnly ? { scale: 1.1 } : {}}
              whileTap={!readOnly ? { scale: 0.95 } : {}}
            >
              {index < currentIndex ? (
                <Check className="h-6 w-6" />
              ) : (
                index + 1
              )}
            </motion.button>

            {/* Label */}
            <motion.div
              className="flex-1 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className={`text-xs font-bold text-center ${
                isCurrent ? 'text-black' : 'text-gray-500'
              }`}>
                {step.label}
              </p>
            </motion.div>

            {/* Connector Line */}
            {index < STEPS.length - 1 && (
              <div className={`h-1 flex-1 ${
                isActive && index < currentIndex
                  ? 'bg-black'
                  : 'bg-gray-300'
              } rounded-full`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

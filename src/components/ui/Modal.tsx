import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  accentColor?: 'green' | 'red' | 'yellow'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  accentColor = 'green'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-zinc-950 border border-cyber-border rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Decorative top accent */}
            <div
              className={cn("absolute top-0 left-0 right-0 h-1.5", {
                "bg-gradient-to-r from-neon-green to-emerald-600": accentColor === 'green',
                "bg-gradient-to-r from-neon-red to-rose-600": accentColor === 'red',
                "bg-gradient-to-r from-neon-yellow to-amber-500": accentColor === 'yellow'
              })}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white tracking-wide uppercase">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 text-zinc-500 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

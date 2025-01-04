'use client';

import { motion } from 'framer-motion';
import { FileText, Linkedin, Mail } from 'lucide-react';
import { Button } from './minicomp/button';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

interface PersonalInfoProps {
  name: string;
  resumeUrl: string;
  linkedinUrl: string;
  email: string;
}

export function PersonalInfo({ name, resumeUrl, linkedinUrl, email }: PersonalInfoProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "mb-8 p-6 backdrop-blur-lg rounded-xl shadow-md border",
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-700/30 to-pink-700/30 border-white/20'
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'
      )}
    >
      <motion.h2
        className={clsx(
          "text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r",
          theme === 'dark' ? 'from-purple-500 to-pink-500' : 'from-purple-600 to-blue-600'
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {name}
      </motion.h2>
      <motion.div
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Button
          variant="outline"
          className={clsx(
            "flex items-center space-x-2 transition-colors duration-300",
            theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
          )}
          asChild
        >
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
            <FileText className="w-4 h-4" />
            <span>Resume</span>
          </a>
        </Button>
        <Button
          variant="outline"
          className={clsx(
            "flex items-center space-x-2 transition-colors duration-300",
            theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
          )}
          asChild
        >
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
        </Button>
        <Button
          variant="outline"
          className={clsx(
            "flex items-center space-x-2 transition-colors duration-300",
            theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
          )}
          asChild
        >
          <a href={`mailto:${email}`}>
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </a>
        </Button>
      </motion.div>
      <motion.p
        className={clsx(
          "mt-4",
          theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Passionate developer with a keen eye for creating stunning and functional web applications.
      </motion.p>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import patternBg from '../assets/images/pattern.avif';

const Pattern = () => {
  return (
    <div className="w-full my-10 px-4 md:px-20">
      <div
        className="h-[18rem] bg-cover bg-center bg-no-repeat relative rounded-2xl overflow-hidden"
        style={{ backgroundImage: `url(${patternBg})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0  border border-secondaryText bg-opacity-80 rounded-2xl"></div>

        {/* Animated Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <motion.div
            className="text-white max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 leading-snug tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Discover tools & services <br className="hidden sm:block" />
              to grow your business
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Partner with experts in SEO, paid media, web design, and social media. Save time, grow faster, and thrive with Biz.Tech.Mgt.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pattern;

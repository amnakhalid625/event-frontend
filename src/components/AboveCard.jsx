import React from "react";
import { FaUsers, FaProjectDiagram, FaHandshake, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";

const CompanyStats = () => {
  const features = [
    {
      icon: <FaUsers className="text-2xl text-white" />,
      title: "500+ Clients",
      description: "We’ve served more than 500 satisfied clients worldwide.",
      bgColor: "bg-primary",
    },
    {
      icon: <FaProjectDiagram className="text-2xl text-white" />,
      title: "1200+ Projects",
      description: "Delivered successful projects for startups & enterprises.",
      bgColor: "bg-primary",
    },
    {
      icon: <FaHandshake className="text-2xl text-white" />,
      title: "50+ Partners",
      description: "Trusted by leading publishers and business partners.",
      bgColor: "bg-primary",
    },
    {
      icon: <FaGlobe className="text-2xl text-white" />,
      title: "Global Reach",
      description: "Content delivered in multiple languages across regions.",
      bgColor: "bg-primary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      className="text-center py-16 px-6 "
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Section Title */}
      <motion.p
        className="text-sm text-primary font-semibold uppercase mb-2"
        variants={cardVariants}
      >
        Why Choose Us
      </motion.p>
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-secondary mb-12"
        variants={cardVariants}
      >
        Our Company in Numbers
      </motion.h2>

      {/* Feature Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            variants={cardVariants}
          >
            <div
              className={`w-12 h-12 mx-auto flex items-center justify-center rounded-full ${feature.bgColor} mb-4`}
            >
              {feature.icon}
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default CompanyStats;

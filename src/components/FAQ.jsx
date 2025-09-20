import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I enroll in a language course?",
      answer: "You can enroll through our website by selecting your desired course and completing the registration process. Alternatively, visit our campus during office hours for in-person registration."
    },
    {
      question: "What languages do you offer?",
      answer: "We currently offer English, German, Chinese (Mandarin), and French courses at various proficiency levels from beginner to advanced."
    },
    {
      question: "Are your instructors qualified?",
      answer: "Yes, all our instructors are certified language teachers with degrees from recognized universities and extensive teaching experience."
    },
    {
      question: "What is the duration of each course?",
      answer: "Course duration varies by level: Beginner courses typically last 3 months, intermediate 4 months, and advanced levels 5-6 months. Intensive courses are also available."
    },
    {
      question: "Do you provide certification after completion?",
      answer: "Yes, we provide recognized certificates upon successful completion of each level. Our English courses prepare students for IELTS, and German courses for Goethe-Zertifikat exams."
    },
    {
      question: "What are your class timings?",
      answer: "We offer morning (9AM-12PM), afternoon (2PM-5PM), and evening (6PM-9PM) batches. Weekend-only classes are also available."
    },
   
  
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id='faq'>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary  mb-4">
            Frequently Asked Questions
          </h2>
          {/* <p className="text-lg text-gray-600">
            Find answers to common questions about our language programs
          </p> */}
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <span className="text-secondary">
                  {activeIndex === index ? <FiMinus size={20} /> : <FiPlus size={20} />}
                </span>
              </button>
              
              <div 
                className={`px-6 pb-6 pt-0 transition-all duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}
              >
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Still have questions? Contact our support team
          </p>
          <Link to="/contact">
          <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition">
            Contact Us
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
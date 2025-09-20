import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen, FaKeyboard, FaLink, FaLinkedin, FaArrowLeft, FaCheck } from 'react-icons/fa';
import WhatsAppButton from './WhatsAppButton';

const ServiceDetail = () => {
  const { serviceSlug } = useParams();

  const serviceData = {
    'content-one-time': {
      icon: <FaBookOpen className="text-3xl text-white" />,
      title: 'Content One-Time Order',
      bgColor: 'bg-blue-500',
      description: 'Professional content creation service for your website, blog, or marketing materials.',
      detailedDescription: 'Our one-time content service provides you with high-quality, SEO-optimized content tailored to your specific needs. Whether you need website copy, blog posts, or marketing materials, our expert writers deliver engaging content that resonates with your audience.',
      features: [
        'SEO-optimized content writing',
        'Original and plagiarism-free content',
        'Fast turnaround time (3-5 business days)',
        'Unlimited revisions until satisfied',
        'Content strategy consultation',
        'Keyword research and integration'
      ],
      price: '$31.5'
    },
    'monthly-content': {
      icon: <FaKeyboard className="text-3xl text-white" />,
      title: 'Monthly Content Campaign',
      bgColor: 'bg-orange-400',
      description: 'Consistent monthly content creation to keep your blog active and engaging.',
      detailedDescription: 'Our monthly content campaign ensures your website stays fresh with regular, high-quality content. We create a content calendar, research trending topics in your industry, and deliver consistent posts that drive traffic and engagement.',
      features: [
        'Monthly content calendar planning',
        'Industry-specific topic research',
        'Consistent publishing schedule',
        'Social media content included',
        'Performance tracking and reporting',
        'Content optimization based on analytics'
      ],
      price: '$63',
      packages: [
        {
          name: 'Starter Plan',
          price: '$299/month',
          includes: ['4 blog posts per month', 'Basic SEO optimization', 'Social media posts', 'Monthly report']
        },
        {
          name: 'Growth Plan',
          price: '$599/month',
          includes: ['8 blog posts per month', 'Advanced SEO optimization', 'Social media content', 'Email newsletter content', 'Bi-weekly calls']
        },
        {
          name: 'Scale Plan',
          price: '$193.5',
          includes: ['12 blog posts per month', 'Complete content strategy', 'Multi-platform content', 'Weekly strategy calls', 'Priority support']
        }
      ]
    },
    'backlinks-guest-posts': {
      icon: <FaLink className="text-3xl text-white" />,
      title: 'Backlinks & Guest Posts',
      bgColor: 'bg-pink-400',
      description: 'Build your website authority with high-quality backlinks and guest posting opportunities.',
      detailedDescription: 'Our backlink and guest posting service helps improve your website\'s search engine rankings through strategic link building. We identify high-authority websites in your niche and create valuable content that earns quality backlinks.',
      features: [
        'High-authority website outreach',
        'Quality guest post creation',
        'Natural link building strategies',
        'Domain authority analysis',
        'Detailed reporting and tracking',
        'White-hat SEO techniques only'
      ],
      price: '$193.5',
      packages: [
        {
          name: 'Basic Links',
          price: '$199/month',
          includes: ['5 high-quality backlinks', '2 guest posts', 'Monthly report', 'Link tracking']
        },
        {
          name: 'Power Links',
          price: '$499/month',
          includes: ['15 high-quality backlinks', '5 guest posts', 'Competitor analysis', 'Weekly updates']
        },
        {
          name: 'Authority Builder',
          price: '$899/month',
          includes: ['30 premium backlinks', '10 guest posts', 'Custom link strategy', 'Priority placement']
        }
      ]
    },
    'linkedin-outreach': {
      icon: <FaLinkedin className="text-3xl text-white" />,
      title: 'LinkedIn Outreach',
      bgColor: 'bg-purple-500',
      description: 'Professional LinkedIn outreach to connect with your ideal prospects and grow your network.',
      detailedDescription: 'Our LinkedIn outreach service helps you connect with potential clients, partners, and industry professionals. We create personalized outreach campaigns that generate meaningful connections and business opportunities.',
      features: [
        'Personalized connection requests',
        'Follow-up message sequences',
        'Profile optimization',
        'Lead qualification',
        'Weekly outreach campaigns',
        'Detailed analytics and reporting'
      ],
      price: '$1495.50',
      packages: [
        {
          name: 'Starter Outreach',
          price: '$199/month',
          includes: ['50 connection requests/week', 'Basic follow-ups', 'Monthly report', 'Profile review']
        },
        {
          name: 'Professional Outreach',
          price: '$399/month',
          includes: ['100 connection requests/week', 'Advanced sequences', 'Lead qualification', 'Bi-weekly calls']
        },
        {
          name: 'Enterprise Outreach',
          price: '$699/month',
          includes: ['200 connection requests/week', 'Custom campaigns', 'Dedicated account manager', 'Weekly strategy calls']
        }
      ]
    }
  };

  const currentService = serviceData[serviceSlug];

  if (!currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <Link to="/" className="text-blue-600 hover:underline"
          
          onClick={() => window.scrollTo(0, 0)}
          >
          
            <FaArrowLeft className="inline mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-white bg-opacity-20 mb-6">
              {currentService.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentService.title}
            </h1>
            <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto">
              {currentService.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Service Description */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Provide</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentService.detailedDescription}
            </p>
          </motion.section>

          {/* Features */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Service?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentService.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                  <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-primary bg-opacity-10 mb-4">
                    <FaCheck className="text-primary text-lg" />
                  </div>
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Service Info and CTA Section - Side by Side (Reversed) */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CTA Card - Now First */}
              <div className="bg-white border-2 border-primary rounded-xl shadow-lg p-8 text-center flex flex-col justify-center">
                <h2 className="text-3xl font-semibold text-primary mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-gray-700 mb-8">
                  Contact us today to discuss your project and get a custom quote for your specific requirements.
                </p>
                <div className="space-y-4">
                  <button className="w-full bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-dark transition">
                    Start Your Project
                  </button>
                  <button className="w-full border-2 border-primary text-primary font-semibold py-3 px-8 rounded-lg hover:bg-primary hover:text-white transition">
                    Schedule Consultation
                  </button>
                </div>
              </div>

              {/* Service Pricing Card - Now Second */}
              <div className="bg-primary rounded-xl shadow-lg p-8 text-white text-center">
                <h3 className="text-3xl font-bold mb-4">{currentService.title}</h3>
                <p className="text-white text-opacity-90 mb-8 text-lg">
                  Get this service without subscriptions or hassles.
                </p>
                
                <div className="space-y-4 mb-8">
                  {currentService.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-center text-left">
                      <FaCheck className="text-white mr-3 flex-shrink-0" />
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-4xl font-semibold text-white mb-8">
                  {currentService.price}
                </div>
                
                <button className="w-full bg-white text-primary font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition text-xl">
                  Order Now
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default ServiceDetail;
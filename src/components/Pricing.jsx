import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Plus } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const navigate = useNavigate();

  const handleCustomPlanClick = () => {
    navigate('/signup');
  };

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for small businesses getting started',
      monthlyPrice: 29,
      annualPrice: 25,
      features: [
        '5 Projects',
        'Basic Analytics',
        'Email Support',
        '3 Users',
        '5GB Storage'
      ],
      limitations: [
        'No Custom Domain',
        'No Advanced Analytics'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 79,
      annualPrice: 69,
      features: [
        'Unlimited Projects',
        'Advanced Analytics',
        'Priority Support',
        '10 Users',
        '50GB Storage',
        'Custom Domain',
        'Basic API Access'
      ],
      limitations: [],
      popular: true,
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with complex needs',
      monthlyPrice: 199,
      annualPrice: 179,
      features: [
        'Unlimited Projects',
        'Advanced Analytics + Reports',
        '24/7 Dedicated Support',
        'Unlimited Users',
        '500GB Storage',
        'Custom Domain + SSL',
        'Full API Access',
        'White Labeling'
      ],
      limitations: [],
      popular: false
    },
    {
      name: 'Custom',
      description: 'Tailored solutions for unique requirements',
      custom: true,
      features: [
        'Everything in Enterprise',
        'Custom Integrations',
        'Dedicated Account Manager',
        'SLA Guarantee',
        'Training & Onboarding',
        'Custom Development'
      ],
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary  mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your business. All plans include a 14-day free trial.
          </p>
          
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-xl overflow-hidden border ${
                plan.highlighted 
                  ? 'border-secondary bg-blue-50 shadow-lg transform scale-105' 
                  : plan.custom 
                  ? 'border-dashed border-2 border-secondary bg-white shadow-md flex flex-col justify-center items-center cursor-pointer hover:bg-blue-50 transition-colors'
                  : 'border border-gray-200 bg-white shadow-md'
              }`}
              onClick={plan.custom ? handleCustomPlanClick : undefined}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-secondary text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`p-6 ${plan.popular ? 'pt-16' : 'pt-8'} ${plan.custom ? 'flex flex-col items-center justify-center h-full' : ''}`}>
                {plan.custom ? (
                  <>
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                      <Plus size={32} className="text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-2 text-center">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6 text-center">{plan.description}</p>
                    <div className="text-center mb-6">
                      <span className="text-3xl font-bold text-secondary">Custom Pricing</span>
                      <p className="text-gray-600 mt-2">Contact us for a quote</p>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-secondary' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`mb-6 ${plan.highlighted ? 'text-secondary' : 'text-gray-600'}`}>{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className={`text-4xl font-bold ${plan.highlighted ? 'text-secondary' : 'text-gray-900'}`}>
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                      </span>
                      <span className={plan.highlighted ? 'text-secondary' : 'text-gray-600'}>/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                  </>
                )}
                
                {!plan.custom && (
                  <button
                    className={`w-full py-3 rounded-lg font-semibold ${
                      plan.highlighted
                        ? 'bg-secondary hover:bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    } transition-colors duration-200`}
                  >
                    Try Plan
                  </button>
                )}
                
                {!plan.custom ? (
                  <div className={`mt-8 ${plan.highlighted ? 'text-secondary' : ''}`}>
                    <h4 className={`font-semibold mb-4 ${plan.highlighted ? 'text-secondary' : 'text-gray-900'}`}>What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${plan.highlighted ? 'text-secondary' : 'text-green-500'}`} />
                          <span className={plan.highlighted ? 'text-black' : 'text-gray-700'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations && plan.limitations.length > 0 && (
                      <>
                        <h4 className={`font-semibold mt-6 mb-4 ${plan.highlighted ? 'text-blue-700' : 'text-gray-900'}`}>Limitations:</h4>
                        <ul className="space-y-3">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start">
                              <X className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${plan.highlighted ? 'text-red-400' : 'text-red-500'}`} />
                              <span className={plan.highlighted ? 'text-secondary' : 'text-gray-700'}>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-secondary font-medium mt-4 text-center">Click to contact us</p>
                )}
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default Pricing;
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Jack',
    title: 'CEO at Anthem Software',
    text: 'Biz.Tech.Mgt is great because I can get everything in one place. They handle the fulfillment which lets me focus on acquiring clients and increasing my MRR.',
    rating: 5,
  },
  {
    name: 'Henry',
    title: 'Skyrocket Business',
    text: 'Using Biz.Tech.Mgt allowed us to scale by outsourcing the items we no longer cared to deliver with our in-house team.',
    rating: 4,
  },
  {
    name: 'James Smith', 
    title: 'Detroit Web Design Co.',
    text: 'Biz.Tech.Mgt is great because I can get everything in one place. They handle the fulfillment which lets me focus on acquiring clients and increasing my MRR.',
    rating: 5,
  },
  {
    name: 'Theodore',
    title: 'ThickAFCredit',
    text: 'Using Biz.Tech.Mgt allowed us to scale by outsourcing the items we no longer cared to deliver with our in-house team.',
    rating: 4,
  },
  {
    name: 'Haith Johnson',
    title: 'CEO LeHost',
    text: 'Biz.Tech.Mgt is great because I can get everything in one place. They handle the fulfillment which lets me focus on acquiring clients and increasing my MRR.',
    rating: 5,
  }
];

const Testimonial = () => {
  // Function to render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover why businesses choose Biz.Tech.Mgt for their growth and success
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: '.testimonial-pagination',
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white p-8 h-full rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col relative overflow-hidden">
                  {/* Background decorative element */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-primary rounded-bl-full"></div>
                  
                  {/* Quote icon */}
                  <div className="mb-6 text-secondary relative z-10">
                    <svg
                      className="w-10 h-10 opacity-100"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.17 6A6.003 6.003 0 003 12c0 1.26.38 2.43 1.04 3.41a1 1 0 01-.84 1.55H2a1 1 0 01-1-1c0-4.97 4.03-9 9-9 .34 0 .67.02 1 .05V6.02a1 1 0 00-1-1H7.17zm10 0A6.003 6.003 0 0013 12c0 1.26.38 2.43 1.04 3.41a1 1 0 01-.84 1.55h-1.2a1 1 0 01-1-1c0-4.97 4.03-9 9-9 .34 0 .67.02 1 .05V6.02a1 1 0 00-1-1h-2.83z" />
                    </svg>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Client info */}
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="testimonial-pagination flex justify-center mt-12 space-x-2" />
        </div>
      </div>

      <style jsx>{`
        .testimonial-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background-color: #010767;
          border-radius: 9999px;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .testimonial-pagination .swiper-pagination-bullet-active {
          background-color: #911b17;
          opacity: 1;
          width: 24px;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(59, 130, 246, 0.15);
        }
      `}</style>
    </section>
  );
};

export default Testimonial;
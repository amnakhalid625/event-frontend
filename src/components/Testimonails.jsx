import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Sophia',
    title: 'Publisher, DigitalGrowth Media',
    text: 'Biz.Tech.Mgt simplified my publishing workflow. Now I can focus on creating quality content while they handle the backend processes.',
    rating: 5,
  },
  {
    name: 'Michael',
    title: 'Advertiser, BrandReach Agency',
    text: 'Using Biz.Tech.Mgt gave us access to high-quality publishers that improved our ad performance and ROI significantly.',
    rating: 5,
  },
  {
    name: 'Emily',
    title: 'Publisher, MarketVoice',
    text: 'The tools and reporting features made my job easier. I can now track campaigns and performance without any hassle.',
    rating: 4,
  },
  {
    name: 'David',
    title: 'Advertiser, AdBoost Co.',
    text: 'We scaled campaigns smoothly with the right publishers, saving us time and money. Highly recommend!',
    rating: 5,
  },
];

const Testimonial = () => {
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
            Hear from publishers and advertisers who trust Biz.Tech.Mgt for growth
          </p>
        </div>

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
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-md flex flex-col h-full">
                {/* Rating */}
                <div className="flex mb-3">{renderStars(testimonial.rating)}</div>

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

      <style jsx>{`
        .testimonial-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background-color: #010767;
          border-radius: 9999px;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .testimonial-pagination .swiper-pagination-bullet-active {
          background-color: #DC2626;
          opacity: 1;
          width: 20px;
        }
      `}</style>
    </section>
  );
};

export default Testimonial;

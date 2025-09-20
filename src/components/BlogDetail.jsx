import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogData } from '../blogData';

const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogData.find(blog => blog.id === parseInt(id));

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-primary transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/blogs" 
          className="inline-flex items-center mb-8 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Articles
        </Link>

        {/* Main Article Card */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Featured Image with Gradient Overlay */}
          <div className="relative h-96 w-full">
            <img 
              src={blog.image} 
              alt={blog.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`${blog.categoryColor} text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide inline-block mb-3`}>
                    {blog.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {blog.title}
                  </h1>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-lg">
                    {blog.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{blog.author}</p>
                  <p className="text-gray-500 text-sm">{blog.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">{blog.readTime}</p>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {blog.content.introduction}
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Deep Dive into {blog.category}</h2>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {blog.content.mainContent}
              </p>
              
              <div className="bg-background border-l-4 border-primary p-6 rounded-r-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Insight</h3>
                <p className="text-gray-700 italic">
                  "{blog.content.expertQuote}" — {blog.author}
                </p>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">Key Considerations</h3>
              <ul className="space-y-3 mb-8">
                {blog.content.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 mt-1 mr-3">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Looking Ahead</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {blog.content.futureOutlook}
              </p>
              
              <div className="bg-background p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Practical Next Steps</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {blog.content.actionSteps.map((step, index) => (
                    <li key={index} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {blog.content.conclusion}
              </p>
            </div>

            {/* Tags */}
            <div className="mt-12 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg mr-6">
                <span className="text-white font-semibold text-xl">
                  {blog.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">About {blog.author.split(' ')[0]}</h3>
                <p className="text-gray-600 mt-1">{blog.authorRole}</p>
              </div>
            </div>
            <p className="text-gray-700 mt-4 leading-relaxed">
              {blog.authorBio}
            </p>
            <div className="mt-4 flex space-x-4">
              <a href={blog.socialLinks.twitter} className="text-primary hover:text-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href={blog.socialLinks.linkedin} className="text-primary hover:text-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
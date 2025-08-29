'use client';

export default function AboutHero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-900">About Me</h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                I am a passionate PhD candidate dedicated to exploring how artificial intelligence can better understand and empower human society. My research sits at the fascinating intersection of computational social science and human-AI interaction.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                With a background in computer science and social psychology, I aim to bridge the gap between technological advancement and human welfare. My work focuses on developing AI systems that not only process data efficiently but also consider the complex nuances of human behavior and social dynamics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-graduation-cap-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
                <p className="text-gray-600 text-sm">PhD Candidate</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-focus-3-line text-purple-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Research Focus</h3>
                <p className="text-gray-600 text-sm">AI & Social Science</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20young%20academic%20researcher%20in%20a%20modern%20university%20setting%2C%20smiling%20confidently%2C%20wearing%20business%20casual%20attire%2C%20warm%20lighting%2C%20clean%20background%20with%20subtle%20academic%20elements%20like%20books%20or%20research%20materials&width=500&height=600&seq=about-portrait&orientation=portrait"
              alt="Professional Portrait"
              className="w-full h-auto rounded-2xl shadow-xl object-cover"
            />
            
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Available for</div>
                  <div className="text-gray-600 text-sm">Collaboration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
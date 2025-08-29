'use client';

export default function Education() {
  const education = [
    {
      degree: 'PhD in Computer Science',
      institution: 'University Name',
      period: '2022 - Present',
      description: 'Specializing in AI for Social Understanding and Human Empowerment',
      status: 'current'
    },
    {
      degree: 'Master of Science in Computer Science',
      institution: 'University Name',
      period: '2020 - 2022',
      description: 'Focus on Machine Learning and Human-Computer Interaction',
      status: 'completed'
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University Name',
      period: '2016 - 2020',
      description: 'Magna Cum Laude, Minor in Psychology',
      status: 'completed'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Education</h2>
          <p className="text-xl text-gray-600">Academic journey and achievements</p>
        </div>

        <div className="space-y-8">
          {education.map((item, index) => (
            <div key={index} className="flex items-start space-x-6 group">
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  item.status === 'current' ? 'bg-blue-500' : 'bg-gray-400'
                }`}>
                  <i className={`ri-graduation-cap-line text-white text-xl`}></i>
                </div>
                {index < education.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200 mx-auto mt-4"></div>
                )}
              </div>
              
              <div className="flex-1 bg-gray-50 p-8 rounded-xl group-hover:bg-blue-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{item.degree}</h3>
                    <p className="text-lg text-blue-600 font-medium">{item.institution}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    item.status === 'current' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.period}
                  </span>
                </div>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
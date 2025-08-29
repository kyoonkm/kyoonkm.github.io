'use client';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: ['Python', 'R', 'JavaScript', 'Java', 'C++'],
      icon: 'ri-code-line',
      color: 'blue'
    },
    {
      title: 'Machine Learning',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'MLflow'],
      icon: 'ri-brain-line',
      color: 'purple'
    },
    {
      title: 'Data Analysis',
      skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'D3.js'],
      icon: 'ri-bar-chart-line',
      color: 'green'
    },
    {
      title: 'Research Tools',
      skills: ['SPSS', 'Jupyter', 'Git', 'LaTeX', 'Zotero'],
      icon: 'ri-microscope-line',
      color: 'orange'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
          <p className="text-xl text-gray-600">Technical competencies and research capabilities</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                  <i className={`${category.icon} text-${category.color}-600 text-xl`}></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className={`px-4 py-2 bg-${category.color}-50 text-${category.color}-700 rounded-full text-sm font-medium hover:bg-${category.color}-100 transition-colors cursor-pointer`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Research Interests</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              My research explores the intersection of artificial intelligence and social sciences, with particular focus on 
              developing AI systems that can understand complex human behaviors and social patterns. I am passionate about 
              creating technology that empowers individuals and communities while maintaining ethical considerations and 
              promoting inclusive design principles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
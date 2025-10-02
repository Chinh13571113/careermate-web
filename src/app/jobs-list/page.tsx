import React from 'react';

// Example static job data
const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Hanoi',
    description: 'Build and maintain web applications using React and Next.js.'
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'Innovatech',
    location: 'Ho Chi Minh City',
    description: 'Develop RESTful APIs and work with databases.'
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Da Nang',
    description: 'Design user interfaces and improve user experience.'
  }
];

const JobsListPage = () => {
  return (
    <main style={{ padding: '2rem', backgroundColor: '#e6f2ff' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {jobs.map(job => (
          <li key={job.id} style={{ 
            marginBottom: '2rem', 
            border: '1px solid #4d94ff', 
            borderRadius: '8px', 
            padding: '1rem',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 102, 255, 0.15)'
          }}>
            <h2 style={{ color: '#0052cc' }}>{job.title}</h2>
            <p><strong style={{ color: '#0052cc' }}>Company:</strong> {job.company}</p>
            <p><strong style={{ color: '#0052cc' }}>Location:</strong> {job.location}</p>
            <p>{job.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default JobsListPage;

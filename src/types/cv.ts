export interface CVTemplate { 
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'modern' | 'classic' | 'creative' | 'minimalist' | 'professional';
  features: string[];
  previewImage?: string;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    position: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
  };
  experience: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
    achievements?: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    gpa?: string;
    description?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  languages: Array<{
    language: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>;
}

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'modern',
    name: 'Modern CV',
    description: 'Modern template with a clean and professional design',
    icon: '🏢',
    category: 'modern',
    features: ['Modern design', 'Two-column layout', 'Professional colors', 'ATS-friendly']
  },
  {
    id: 'classic',
    name: 'Classic CV',
    description: 'Traditional template suitable for all industries',
    icon: '📋',
    category: 'classic',
    features: ['Traditional design', 'Easy to read', 'Fits all industries', 'Print-friendly']
  },
  {
    id: 'creative',
    name: 'Creative CV',
    description: 'Creative template for design and marketing fields',
    icon: '🎨',
    category: 'creative',
    features: ['Creative design', 'Vibrant colors', 'Perfect for creatives', 'Unique style']
  },
  {
    id: 'minimalist',
    name: 'Minimalist CV',
    description: 'Minimalist template, refined and elegant',
    icon: '✨',
    category: 'minimalist',
    features: ['Minimalist design', 'Content-focused', 'Elegant', 'Easy to scan']
  },
  {
    id: 'professional',
    name: 'Professional CV',
    description: 'Professional template with a two-column layout',
    icon: '👔',
    category: 'professional',
    features: ['Two-column layout', 'Professional', 'Space optimized', 'Ideal for seniors']
  }
];

export const SAMPLE_CV_DATA: CVData = {
  personalInfo: {
    fullName: "Nguyen Van A",
    position: "Frontend Developer",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    location: "Hanoi, Vietnam",
    website: "https://nguyenvana.dev",
    linkedin: "https://linkedin.com/in/nguyenvana",
    summary: "Frontend Developer with 3 years of experience in building web applications using React, JavaScript, and modern technologies. Passionate about creating beautiful user interfaces and delivering the best user experiences."
  },
  experience: [
    {
      position: "Frontend Developer",
      company: "TechCorp Vietnam",
      period: "2022 - Present",
      description: "Develop and maintain web applications using React, TypeScript, and TailwindCSS.",
      achievements: [
        "Improved page load speed by 40% through code optimization",
        "Developed 15+ new features for the main product",
        "Mentored 3 junior developers"
      ]
    },
    {
      position: "Junior Frontend Developer",
      company: "StartupXYZ",
      period: "2021 - 2022",
      description: "Assisted in developing web and mobile applications using React and React Native.",
      achievements: [
        "Built 5+ reusable components",
        "Contributed to the development of the company’s MVP"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Information Technology",
      school: "Hanoi University of Science and Technology",
      period: "2017 - 2021",
      gpa: "3.5/4.0",
      description: "Major in Computer Science"
    }
  ],
  skills: [
    {
      category: "Programming Languages",
      items: ["JavaScript", "TypeScript", "Python", "Java"]
    },
    {
      category: "Frontend Technologies",
      items: ["React", "Next.js", "Vue.js", "HTML/CSS", "TailwindCSS"]
    },
    {
      category: "Tools & Others",
      items: ["Git", "Docker", "AWS", "MongoDB", "PostgreSQL"]
    }
  ],
  languages: [
    {
      language: "Vietnamese",
      level: "Native"
    },
    {
      language: "English",
      level: "Advanced"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "https://aws.amazon.com/certification/"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "An e-commerce platform built with React and Node.js",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      url: "https://demo-ecommerce.com",
      github: "https://github.com/nguyenvana/ecommerce"
    }
  ]
};
 
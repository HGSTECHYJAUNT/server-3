// types/fields.ts
export interface Field {
  id: string;
  name: string;
  category: string;
  description: string;
  requiredSkills: string[];
  optionalSkills: string[];
  typicalRoles: string[];
  averageSalaryRange?: { min: number; max: number };
  growthRate?: string;
  entryBarrier: 'low' | 'medium' | 'high';
  keywords: string[];
}

// data/fieldsDatabase.ts
export const fieldsDatabase: Field[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    category: 'Software Engineering',
    description: 'Building and maintaining websites and web applications',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'API'],
    optionalSkills: ['TypeScript', 'Node.js', 'Database', 'DevOps'],
    typicalRoles: ['Frontend Developer', 'Full Stack Developer', 'Web Developer'],
    entryBarrier: 'medium',
    keywords: ['web', 'frontend', 'backend', 'fullstack', 'website', 'application']
  },
  {
    id: 'data-science',
    name: 'Data Science',
    category: 'Analytics',
    description: 'Extracting insights from data using statistical methods and ML',
    requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'Data Analysis'],
    optionalSkills: ['Deep Learning', 'SQL', 'Tableau', 'R'],
    typicalRoles: ['Data Scientist', 'ML Engineer', 'Data Analyst'],
    entryBarrier: 'high',
    keywords: ['data', 'analytics', 'machine learning', 'AI', 'statistics']
  },
  // Add more fields...
];
import type { RawResponse } from './provider';

const KNOWLEDGE_BASE: Record<string, RawResponse> = {
  'frontend developer': {
    profession: 'Frontend Developer',
    categories: {
      Tools: [
        { name: 'Vite', url: 'https://vitejs.dev/', explanation: 'Fast build tool and dev server for modern frontend development.' },
        { name: 'React DevTools', url: 'https://react.dev/learn/react-devtools', explanation: 'Browser extension for debugging React component trees and state.' },
        { name: 'Tailwind Play', url: 'https://play.tailwindcss.com/', explanation: 'Online playground to test Tailwind CSS utilities without setup.' },
      ],
      Communities: [
        { name: 'r/webdev', url: 'https://www.reddit.com/r/webdev/', explanation: 'Large Reddit community for web development discussions and job opportunities.' },
        { name: 'Dev.to', url: 'https://dev.to/t/frontend', explanation: 'Community platform where developers share frontend articles and tutorials.' },
      ],
      LearningPlatforms: [
        { name: 'Frontend Mentor', url: 'https://www.frontendmentor.io/', explanation: 'Practice building real UIs with professional designs and mentorship.' },
        { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/', explanation: 'Free interactive tutorials covering HTML, CSS, JavaScript, and React.' },
      ],
      Documentation: [
        { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', explanation: 'Comprehensive reference for web standards including HTML, CSS, and JavaScript.' },
        { name: 'React Docs', url: 'https://react.dev/', explanation: 'Official React documentation with interactive examples and guides.' },
      ],
    },
  },
  'backend developer': {
    profession: 'Backend Developer',
    categories: {
      Tools: [
        { name: 'Postman', url: 'https://www.postman.com/', explanation: 'API testing and documentation platform for building and debugging APIs.' },
        { name: 'Docker', url: 'https://www.docker.com/', explanation: 'Containerization platform for consistent backend environments.' },
        { name: 'Prisma ORM', url: 'https://www.prisma.io/', explanation: 'Type-safe database client and ORM for Node.js and TypeScript.' },
      ],
      Communities: [
        { name: 'r/backend', url: 'https://www.reddit.com/r/backend/', explanation: 'Community discussing backend architecture, APIs, and infrastructure.' },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com/questions/tagged/backend', explanation: 'Q&A platform with extensive backend development questions and answers.' },
      ],
      LearningPlatforms: [
        { name: 'Udemy Backend Courses', url: 'https://www.udemy.com/courses/development/web-development/', explanation: 'Comprehensive courses on building REST APIs, databases, and microservices.' },
        { name: 'The Odin Project', url: 'https://theodinproject.com/', explanation: 'Free full-stack curriculum with backend-focused tracks.' },
      ],
      Documentation: [
        { name: 'Express.js Docs', url: 'https://expressjs.com/', explanation: 'Minimal web framework for Node.js API development.' },
        { name: 'Node.js Docs', url: 'https://nodejs.org/en/docs', explanation: 'Official runtime documentation with API reference and guides.' },
      ],
    },
  },
  'data scientist': {
    profession: 'Data Scientist',
    categories: {
      Tools: [
        { name: 'JupyterLab', url: 'https://jupyter.org/', explanation: 'Interactive development environment for notebooks and data analysis.' },
        { name: 'TensorBoard', url: 'https://www.tensorflow.org/tensorboard', explanation: 'Visualization toolkit for ML model training metrics and graphs.' },
        { name: 'Databricks', url: 'https://www.databricks.com/', explanation: 'Collaborative platform for big data processing and machine learning pipelines.' },
      ],
      Communities: [
        { name: 'Kaggle', url: 'https://www.kaggle.com/', explanation: 'Platform for data science competitions, notebooks, and discussion forums.' },
        { name: 'Towards Data Science', url: 'https://towardsdatascience.com/', explanation: 'Medium-published community blog covering ML, AI, and analytics topics.' },
      ],
      LearningPlatforms: [
        { name: 'Coursera Machine Learning', url: 'https://www.coursera.org/learn/machine-learning', explanation: 'Stanford course by Andrew Ng on foundational ML algorithms.' },
        { name: 'Fast.ai', url: 'https://www.fast.ai/', explanation: 'Free practical deep learning courses with a top-down teaching approach.' },
      ],
      Documentation: [
        { name: 'Scikit-learn Docs', url: 'https://scikit-learn.org/stable/', explanation: 'Comprehensive reference for machine learning algorithms in Python.' },
        { name: 'Pandas Docs', url: 'https://pandas.pydata.org/docs/', explanation: 'Essential data manipulation and analysis library documentation.' },
      ],
    },
  },
  'devops engineer': {
    profession: 'DevOps Engineer',
    categories: {
      Tools: [
        { name: 'Terraform', url: 'https://www.terraform.io/', explanation: 'Infrastructure as code tool for provisioning cloud resources.' },
        { name: 'Kubernetes', url: 'https://kubernetes.io/', explanation: 'Container orchestration platform for automating deployment and scaling.' },
        { name: 'GitHub Actions', url: 'https://github.com/features/actions', explanation: 'CI/CD platform for automating workflows directly in repositories.' },
      ],
      Communities: [
        { name: 'r/devops', url: 'https://www.reddit.com/r/devops/', explanation: 'Community discussing automation, CI/CD, and infrastructure practices.' },
        { name: 'CNCF Slack', url: 'https://slack.cncf.io/', explanation: 'Cloud Native Computing Foundation community for Kubernetes and related tools.' },
      ],
      LearningPlatforms: [
        { name: 'Katacoda', url: 'https://www.katacoda.com/', explanation: 'Interactive learning platform for DevOps scenarios and cloud technologies.' },
        { name: 'Linux Foundation Training', url: 'https://training.linuxfoundation.org/', explanation: 'Certified courses on Kubernetes, Linux, and open source infrastructure.' },
      ],
      Documentation: [
        { name: 'Docker Docs', url: 'https://docs.docker.com/', explanation: 'Official containerization platform documentation with guides and references.' },
        { name: 'Ansible Docs', url: 'https://docs.ansible.com/', explanation: 'Automation engine for configuration management and application deployment.' },
      ],
    },
  },
};

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim();
}

export function getKnowledgeBaseResponse(query: string): RawResponse | null {
  const normalized = normalizeQuery(query);

  for (const key of Object.keys(KNOWLEDGE_BASE)) {
    if (normalized.includes(key) || key.includes(normalized.split(' ')[0])) {
      return KNOWLEDGE_BASE[key];
    }
  }

  for (const key of Object.keys(KNOWLEDGE_BASE)) {
    const words = normalized.split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && key.includes(word)) {
        return KNOWLEDGE_BASE[key];
      }
    }
  }

  return null;
}

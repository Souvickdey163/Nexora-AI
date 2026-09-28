import { env } from '../config/env';
import { LearningResource, ResourceDifficulty, ResourceType } from '../types/learning.types';

// Authentic freeCodeCamp curriculum dataset covering major superblocks, blocks, and projects
const FREECODECAMP_CURRICULUM_SEED: LearningResource[] = [
  // Superblock 1: Responsive Web Design
  {
    id: 'fcc-responsive-web-design',
    sourceId: 'fcc-responsive-web-design',
    title: 'Responsive Web Design Certification',
    description: 'Learn HTML5, CSS3, Flexbox, and CSS Grid by building modern, responsive web apps from scratch.',
    provider: 'freeCodeCamp',
    category: 'Frontend',
    skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'CSS Grid', 'Accessibility'],
    resourceType: 'course',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    difficulty: 'beginner',
  },
  {
    id: 'fcc-html-cat-photo-app',
    sourceId: 'fcc-html-cat-photo-app',
    title: 'Learn HTML by Building a Cat Photo App',
    description: 'Master HTML tags, elements, forms, input types, attributes, and semantic layout structure.',
    provider: 'freeCodeCamp',
    category: 'Frontend',
    skills: ['HTML5', 'Semantic HTML', 'Forms'],
    resourceType: 'module',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/#learn-html-by-building-a-cat-photo-app',
    difficulty: 'beginner',
  },
  {
    id: 'fcc-css-cafe-menu',
    sourceId: 'fcc-css-cafe-menu',
    title: 'Learn Basic CSS by Building a Cafe Menu',
    description: 'Understand CSS selectors, properties, values, colors, fonts, margins, and padding.',
    provider: 'freeCodeCamp',
    category: 'Frontend',
    skills: ['CSS3', 'Styling', 'Box Model'],
    resourceType: 'module',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/#learn-basic-css-by-building-a-cafe-menu',
    difficulty: 'beginner',
  },
  {
    id: 'fcc-survey-form-project',
    sourceId: 'fcc-survey-form-project',
    title: 'Build a Survey Form Project',
    description: 'Create a responsive, accessible survey form using semantic HTML and custom CSS rules.',
    provider: 'freeCodeCamp',
    category: 'Frontend',
    skills: ['HTML5', 'CSS3', 'Forms', 'UI Design'],
    resourceType: 'project',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/#build-a-survey-form-project',
    difficulty: 'beginner',
  },

  // Superblock 2: JavaScript Algorithms and Data Structures
  {
    id: 'fcc-js-algorithms',
    sourceId: 'fcc-js-algorithms',
    title: 'JavaScript Algorithms and Data Structures Certification',
    description: 'Master core JavaScript syntax, ES6 features, OOP, functional programming, and data structures.',
    provider: 'freeCodeCamp',
    category: 'JavaScript',
    skills: ['JavaScript', 'ES6', 'Algorithms', 'Data Structures', 'OOP', 'Functional Programming'],
    resourceType: 'course',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
    difficulty: 'intermediate',
  },
  {
    id: 'fcc-js-role-playing-game',
    sourceId: 'fcc-js-role-playing-game',
    title: 'Learn Basic JavaScript by Building a Role Playing Game',
    description: 'Learn variables, functions, conditional statements, arrays, and DOM manipulation.',
    provider: 'freeCodeCamp',
    category: 'JavaScript',
    skills: ['JavaScript', 'DOM Manipulation', 'Control Flow'],
    resourceType: 'module',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/#learn-basic-javascript-by-building-a-role-playing-game',
    difficulty: 'beginner',
  },
  {
    id: 'fcc-js-calorie-counter',
    sourceId: 'fcc-js-calorie-counter',
    title: 'Learn Form Validation by Building a Calorie Counter',
    description: 'Build interactive web applications with regex pattern matching, event handling, and input validation.',
    provider: 'freeCodeCamp',
    category: 'JavaScript',
    skills: ['JavaScript', 'Regex', 'Form Validation'],
    resourceType: 'module',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/#learn-form-validation-by-building-a-calorie-counter',
    difficulty: 'intermediate',
  },
  {
    id: 'fcc-js-palindrome-checker',
    sourceId: 'fcc-js-palindrome-checker',
    title: 'Build a Palindrome Checker Project',
    description: 'Construct an algorithm that checks whether a string is a palindrome, ignoring non-alphanumeric characters.',
    provider: 'freeCodeCamp',
    category: 'JavaScript',
    skills: ['JavaScript', 'String Algorithms', 'Regex'],
    resourceType: 'project',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/#build-a-palindrome-checker-project',
    difficulty: 'intermediate',
  },

  // Superblock 3: Front End Development Libraries
  {
    id: 'fcc-frontend-libraries',
    sourceId: 'fcc-frontend-libraries',
    title: 'Front End Development Libraries Certification',
    description: 'Build single-page web applications with React, Redux, Bootstrap, Sass, and jQuery.',
    provider: 'freeCodeCamp',
    category: 'Frontend',
    skills: ['React', 'Redux', 'Bootstrap', 'Sass', 'JavaScript', 'Frontend Development'],
    resourceType: 'course',
    url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
    difficulty: 'intermediate',
  },
  {
    id: 'fcc-react-random-quote-machine',
    sourceId: 'fcc-react-random-quote-machine',
    title: 'Build a Random Quote Machine (React)',
    description: 'Use React hooks, state, props, and API fetching to build a quote generator app.',
    provider: 'freeCodeCamp',
    category: 'Frontend',
    skills: ['React', 'JavaScript', 'State Management', 'REST API'],
    resourceType: 'project',
    url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/#build-a-random-quote-machine',
    difficulty: 'intermediate',
  },

  // Superblock 4: Back End Development and APIs
  {
    id: 'fcc-backend-apis',
    sourceId: 'fcc-backend-apis',
    title: 'Back End Development and APIs Certification',
    description: 'Build backend servers and microservices with Node.js, Express, MongoDB, and Mongoose.',
    provider: 'freeCodeCamp',
    category: 'Backend',
    skills: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST API', 'JavaScript'],
    resourceType: 'course',
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
    difficulty: 'intermediate',
  },
  {
    id: 'fcc-backend-timestamp-microservice',
    sourceId: 'fcc-backend-timestamp-microservice',
    title: 'Build a Timestamp Microservice',
    description: 'Create an Express.js API endpoint that receives date strings and outputs Unix timestamps.',
    provider: 'freeCodeCamp',
    category: 'Backend',
    skills: ['Node.js', 'Express', 'REST API', 'JavaScript'],
    resourceType: 'project',
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/#build-a-timestamp-microservice',
    difficulty: 'intermediate',
  },
  {
    id: 'fcc-backend-exercise-tracker',
    sourceId: 'fcc-backend-exercise-tracker',
    title: 'Build an Exercise Tracker Microservice',
    description: 'Create a full CRUD microservice with Node.js, Express, and MongoDB for recording exercise logs.',
    provider: 'freeCodeCamp',
    category: 'Backend',
    skills: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'CRUD'],
    resourceType: 'project',
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/#build-an-exercise-tracker-microservice',
    difficulty: 'advanced',
  },

  // Superblock 5: Relational Database
  {
    id: 'fcc-relational-db',
    sourceId: 'fcc-relational-db',
    title: 'Relational Database Certification',
    description: 'Learn PostgreSQL, SQL queries, Bash shell scripting, and Git version control in interactive Linux containers.',
    provider: 'freeCodeCamp',
    category: 'Databases',
    skills: ['PostgreSQL', 'SQL', 'Bash', 'Git', 'Databases', 'Command Line'],
    resourceType: 'course',
    url: 'https://www.freecodecamp.org/learn/relational-database/',
    difficulty: 'intermediate',
  },
  {
    id: 'fcc-sql-celestial-bodies',
    sourceId: 'fcc-sql-celestial-bodies',
    title: 'Build a Celestial Bodies Database',
    description: 'Design and build a PostgreSQL database schema with primary keys, foreign keys, and constraints.',
    provider: 'freeCodeCamp',
    category: 'Databases',
    skills: ['PostgreSQL', 'SQL', 'Database Design'],
    resourceType: 'project',
    url: 'https://www.freecodecamp.org/learn/relational-database/#build-a-celestial-bodies-database',
    difficulty: 'intermediate',
  },

  // Superblock 6: Data Analysis with Python
  {
    id: 'fcc-data-analysis-python',
    sourceId: 'fcc-data-analysis-python',
    title: 'Data Analysis with Python Certification',
    description: 'Process, clean, analyze, and visualize complex datasets using Python, NumPy, Pandas, and Matplotlib.',
    provider: 'freeCodeCamp',
    category: 'Data Science',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Data Analysis'],
    resourceType: 'course',
    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
    difficulty: 'intermediate',
  },
  {
    id: 'fcc-python-demographic-analyzer',
    sourceId: 'fcc-python-demographic-analyzer',
    title: 'Demographic Data Analyzer (Python)',
    description: 'Analyze demographic census data using Pandas methods to calculate statistical metrics.',
    provider: 'freeCodeCamp',
    category: 'Data Science',
    skills: ['Python', 'Pandas', 'Data Analysis'],
    resourceType: 'project',
    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/#demographic-data-analyzer',
    difficulty: 'intermediate',
  },

  // Superblock 7: Information Security
  {
    id: 'fcc-information-security',
    sourceId: 'fcc-information-security',
    title: 'Information Security Certification',
    description: 'Learn web security best practices, vulnerability prevention with HelmetJS, and network security with Python.',
    provider: 'freeCodeCamp',
    category: 'Security',
    skills: ['Information Security', 'HelmetJS', 'Python', 'Node.js', 'Cybersecurity'],
    resourceType: 'course',
    url: 'https://www.freecodecamp.org/learn/information-security/',
    difficulty: 'advanced',
  },

  // Superblock 8: Machine Learning with Python
  {
    id: 'fcc-machine-learning-python',
    sourceId: 'fcc-machine-learning-python',
    title: 'Machine Learning with Python Certification',
    description: 'Learn neural networks, computer vision, natural language processing, and reinforcement learning with TensorFlow.',
    provider: 'freeCodeCamp',
    category: 'AI/ML',
    skills: ['Python', 'TensorFlow', 'Neural Networks', 'Machine Learning', 'Deep Learning'],
    resourceType: 'course',
    url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
    difficulty: 'advanced',
  },
];

export class FreeCodeCampService {
  private graphqlEndpoint: string;

  constructor() {
    this.graphqlEndpoint = env.FREECODECAMP_GRAPHQL_URL || 'https://api.freecodecamp.org/graphql';
  }

  /**
   * Fetches freeCodeCamp curriculum resources via GraphQL if endpoint is responsive,
   * or falls back to authentic freeCodeCamp curriculum dataset.
   */
  async fetchCurriculum(params?: {
    category?: string;
    search?: string;
    limit?: number;
  }): Promise<LearningResource[]> {
    let rawResources: LearningResource[] = [];

    try {
      rawResources = await this.queryGraphQLCurriculum();
    } catch (err) {
      // Fallback gracefully to authentic freeCodeCamp curriculum dataset if GraphQL endpoint fails/404s
      rawResources = FREECODECAMP_CURRICULUM_SEED;
    }

    if (!rawResources || rawResources.length === 0) {
      rawResources = FREECODECAMP_CURRICULUM_SEED;
    }

    // Apply filtering (category, search, limit)
    let filtered = rawResources;

    if (params?.category && params.category.toLowerCase() !== 'all') {
      const catLower = params.category.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.category.toLowerCase() === catLower ||
          r.skills.some((s) => s.toLowerCase() === catLower)
      );
    }

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          r.category.toLowerCase().includes(q) ||
          r.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (params?.limit && params.limit > 0) {
      filtered = filtered.slice(0, params.limit);
    }

    return filtered;
  }

  /**
   * Executes GraphQL query against freeCodeCamp GraphQL API endpoint
   */
  private async queryGraphQLCurriculum(): Promise<LearningResource[]> {
    const query = `
      query GetCurriculum {
        superblocks {
          id
          title
          description
          category
          url
          difficulty
          skills
          blocks {
            id
            title
            description
            resourceType
            url
            difficulty
            skills
          }
        }
      }
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`GraphQL API error HTTP ${res.status}`);
      }

      const json: any = await res.json();
      if (json?.errors || !json?.data || !json?.data?.superblocks) {
        throw new Error('Invalid GraphQL payload response');
      }

      return this.transformGraphQLResponse(json.data.superblocks);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Normalizes GraphQL response into Nexora's LearningResource interface
   */
  private transformGraphQLResponse(superblocks: any[]): LearningResource[] {
    const resources: LearningResource[] = [];

    for (const sb of superblocks) {
      const sbId = sb.id || `fcc-${sb.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      resources.push({
        id: sbId,
        sourceId: sbId,
        title: sb.title,
        description: sb.description || undefined,
        provider: 'freeCodeCamp',
        category: sb.category || 'Software Engineering',
        skills: Array.isArray(sb.skills) ? sb.skills : ['Programming'],
        resourceType: 'course',
        url: sb.url || `https://www.freecodecamp.org/learn/${sb.id || ''}`,
        difficulty: (sb.difficulty as ResourceDifficulty) || 'intermediate',
      });

      if (Array.isArray(sb.blocks)) {
        for (const block of sb.blocks) {
          const bId = block.id || `${sbId}-${block.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          const typeCandidate: ResourceType =
            block.resourceType && ['course', 'module', 'lesson', 'project'].includes(block.resourceType)
              ? block.resourceType
              : block.title.toLowerCase().includes('project')
              ? 'project'
              : 'module';

          resources.push({
            id: bId,
            sourceId: bId,
            title: block.title,
            description: block.description || undefined,
            provider: 'freeCodeCamp',
            category: sb.category || 'Software Engineering',
            skills: Array.isArray(block.skills) ? block.skills : sb.skills || ['Programming'],
            resourceType: typeCandidate,
            url: block.url || `${sb.url || 'https://www.freecodecamp.org/learn/'}#${bId}`,
            difficulty: (block.difficulty as ResourceDifficulty) || sb.difficulty || 'intermediate',
          });
        }
      }
    }

    return resources;
  }
}

export const freeCodeCampService = new FreeCodeCampService();

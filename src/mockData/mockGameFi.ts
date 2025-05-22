/**
 * Mock data for GameFi educational platform
 * Contains data for games, quests, rewards, leaderboards, and achievements
 */

import { v4 as uuidv4 } from 'uuid';

// Game difficulty levels
export enum DifficultyLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

// Game categories
export enum GameCategory {
  PROGRAMMING = 'Programming',
  MATHEMATICS = 'Mathematics',
  ALGORITHMS = 'Algorithms',
  DATABASE = 'Database',
  NETWORKING = 'Networking',
  CYBERSECURITY = 'Cybersecurity',
  WEB_DEVELOPMENT = 'Web Development',
  MOBILE_DEVELOPMENT = 'Mobile Development',
  MACHINE_LEARNING = 'Machine Learning',
  GENERAL_KNOWLEDGE = 'General Knowledge'
}

// Token types for rewards
export enum TokenType {
  KNOWLEDGE_TOKEN = 'Knowledge Token',
  SKILL_POINT = 'Skill Point',
  EXPERIENCE_POINT = 'Experience Point',
  ACHIEVEMENT_BADGE = 'Achievement Badge'
}

// Game types
export enum GameType {
  QUIZ = 'Quiz',
  CODE_CHALLENGE = 'Code Challenge',
  PUZZLE = 'Puzzle',
  SIMULATION = 'Simulation',
  FLASHCARDS = 'Flashcards',
  MEMORY_GAME = 'Memory Game',
  WORD_GAME = 'Word Game',
  MATCHING = 'Matching'
}

// Interface for game data
export interface Game {
  id: string;
  title: string;
  description: string;
  type: GameType;
  category: GameCategory;
  difficulty: DifficultyLevel;
  points: number;
  timeLimit: number; // in minutes
  imageUrl: string;
  completionRate: number; // percentage of users who completed
  averageRating: number; // out of 5
  totalPlays: number;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
  requiredLevel: number;
}

// Interface for quest data
export interface Quest {
  id: string;
  title: string;
  description: string;
  games: string[]; // Array of game IDs
  rewards: Reward[];
  deadline: string; // ISO date string
  isCompleted: boolean;
  progress: number; // percentage
  requiredLevel: number;
  xpReward: number;
}

// Interface for reward data
export interface Reward {
  id: string;
  name: string;
  description: string;
  tokenType: TokenType;
  amount: number;
  imageUrl: string;
}

// Interface for achievement data
export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isUnlocked: boolean;
  isClaimed: boolean;
  progress: number; // percentage
  requiredValue: number;
  currentValue: number;
  category: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

// Interface for leaderboard entry
export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatarUrl: string;
  score: number;
  level: number;
  badges: number;
  isCurrentUser: boolean;
}

// Interface for user profile in GameFi
export interface GameFiProfile {
  id: string;
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  knowledgeTokens: number;
  skillPoints: number;
  completedGames: number;
  completedQuests: number;
  achievements: number;
  rank: number;
  avatarUrl: string;
  joinDate: string; // ISO date string
  streak: number; // consecutive days played
  badges: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
}

// Mock Games Data
export const mockGames: Game[] = [
  {
    id: uuidv4(),
    title: 'Algorithm Mastery',
    description: 'Test your knowledge of sorting and searching algorithms through interactive challenges.',
    type: GameType.CODE_CHALLENGE,
    category: GameCategory.ALGORITHMS,
    difficulty: DifficultyLevel.INTERMEDIATE,
    points: 150,
    timeLimit: 30,
    imageUrl: 'https://www.shutterstock.com/image-photo/desktop-source-code-technology-background-600w-1168655290.jpg',
    completionRate: 68,
    averageRating: 4.7,
    totalPlays: 1245,
    isNew: false,
    isFeatured: true,
    tags: ['algorithms', 'sorting', 'searching', 'big-o-notation'],
    requiredLevel: 3
  },
  {
    id: uuidv4(),
    title: 'Database Design Challenge',
    description: 'Design and optimize database schemas to solve real-world problems.',
    type: GameType.SIMULATION,
    category: GameCategory.DATABASE,
    difficulty: DifficultyLevel.ADVANCED,
    points: 200,
    timeLimit: 45,
    imageUrl: 'https://www.figma.com/community/resource/3c500ee9-1392-461a-b6c0-c1a38e319f76/thumbnail',
    completionRate: 52,
    averageRating: 4.5,
    totalPlays: 876,
    isNew: false,
    isFeatured: false,
    tags: ['database', 'SQL', 'normalization', 'schema-design'],
    requiredLevel: 5
  },
  {
    id: uuidv4(),
    title: 'Web Security Defender',
    description: 'Identify and fix common web security vulnerabilities in this interactive simulation.',
    type: GameType.SIMULATION,
    category: GameCategory.CYBERSECURITY,
    difficulty: DifficultyLevel.ADVANCED,
    points: 250,
    timeLimit: 40,
    imageUrl: 'https://st.quantrimang.com/photos/image/2022/09/07/phan-mem-diet-virus-duoc-microsoft-khuyen-nghi-dung-cho-windows.jpg',
    completionRate: 45,
    averageRating: 4.8,
    totalPlays: 723,
    isNew: true,
    isFeatured: true,
    tags: ['security', 'web', 'vulnerabilities', 'OWASP'],
    requiredLevel: 6
  },
  {
    id: uuidv4(),
    title: 'React Component Builder',
    description: 'Build React components to match specific requirements and pass all test cases.',
    type: GameType.CODE_CHALLENGE,
    category: GameCategory.WEB_DEVELOPMENT,
    difficulty: DifficultyLevel.INTERMEDIATE,
    points: 180,
    timeLimit: 35,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_BjfunzS5EzI6s4ScxQnvKLZJRKbhBEALcQ&s',
    completionRate: 63,
    averageRating: 4.6,
    totalPlays: 1089,
    isNew: false,
    isFeatured: true,
    tags: ['react', 'components', 'frontend', 'javascript'],
    requiredLevel: 4
  },
  {
    id: uuidv4(),
    title: 'Data Structures Quiz',
    description: 'Test your knowledge of fundamental data structures with this comprehensive quiz.',
    type: GameType.QUIZ,
    category: GameCategory.PROGRAMMING,
    difficulty: DifficultyLevel.BEGINNER,
    points: 100,
    timeLimit: 20,
    imageUrl: 'https://data-flair.training/blogs/wp-content/uploads/sites/2/2021/10/data-structure-quiz.webp',
    completionRate: 78,
    averageRating: 4.3,
    totalPlays: 1567,
    isNew: false,
    isFeatured: false,
    tags: ['data-structures', 'arrays', 'linked-lists', 'trees', 'graphs'],
    requiredLevel: 2
  },
  {
    id: uuidv4(),
    title: 'Network Protocol Puzzle',
    description: 'Solve puzzles related to network protocols and communication models.',
    type: GameType.PUZZLE,
    category: GameCategory.NETWORKING,
    difficulty: DifficultyLevel.INTERMEDIATE,
    points: 150,
    timeLimit: 25,
    imageUrl: 'https://img.freepik.com/premium-vector/puzzle-infographic_23-2147515139.jpg',
    completionRate: 59,
    averageRating: 4.4,
    totalPlays: 892,
    isNew: true,
    isFeatured: false,
    tags: ['networking', 'protocols', 'TCP/IP', 'OSI-model'],
    requiredLevel: 3
  },
  {
    id: uuidv4(),
    title: 'Machine Learning Basics',
    description: 'Learn the fundamentals of machine learning through interactive exercises.',
    type: GameType.QUIZ,
    category: GameCategory.MACHINE_LEARNING,
    difficulty: DifficultyLevel.BEGINNER,
    points: 120,
    timeLimit: 25,
    imageUrl: 'https://buffml.com/wp-content/uploads/2022/12/machine_learning_basics.png',
    completionRate: 72,
    averageRating: 4.5,
    totalPlays: 1032,
    isNew: false,
    isFeatured: true,
    tags: ['machine-learning', 'AI', 'algorithms', 'data-science'],
    requiredLevel: 2
  },
  {
    id: uuidv4(),
    title: 'Mobile UI Challenge',
    description: 'Design mobile interfaces that meet usability and accessibility standards.',
    type: GameType.SIMULATION,
    category: GameCategory.MOBILE_DEVELOPMENT,
    difficulty: DifficultyLevel.INTERMEDIATE,
    points: 160,
    timeLimit: 30,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUZU9JORRUolhRLStRw4xf1m0iD6-76nUIeA&s',
    completionRate: 65,
    averageRating: 4.2,
    totalPlays: 785,
    isNew: false,
    isFeatured: false,
    tags: ['mobile', 'UI/UX', 'design', 'accessibility'],
    requiredLevel: 3
  },
  {
    id: uuidv4(),
    title: 'Programming Icons Memory Game',
    description: 'Test your memory skills by matching programming language icons.',
    type: GameType.MEMORY_GAME,
    category: GameCategory.PROGRAMMING,
    difficulty: DifficultyLevel.BEGINNER,
    points: 100,
    timeLimit: 15,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXkLi9uAQcCslFvmbtoQv4amZDO75oBqP93w&s',
    completionRate: 82,
    averageRating: 4.7,
    totalPlays: 2103,
    isNew: true,
    isFeatured: true,
    tags: ['memory', 'programming', 'icons', 'fun'],
    requiredLevel: 1
  }
];

// Mock Quests Data
export const mockQuests: Quest[] = [
  {
    id: uuidv4(),
    title: 'Algorithm Explorer',
    description: 'Complete a series of algorithm challenges to earn special rewards.',
    games: [mockGames[0].id, mockGames[4].id],
    rewards: [
      {
        id: uuidv4(),
        name: 'Algorithm Master Badge',
        description: 'Badge for completing the Algorithm Explorer quest',
        tokenType: TokenType.ACHIEVEMENT_BADGE,
        amount: 1,
        imageUrl: '/assets/rewards/algorithm-badge.png'
      },
      {
        id: uuidv4(),
        name: 'Knowledge Tokens',
        description: 'Tokens for completing algorithm challenges',
        tokenType: TokenType.KNOWLEDGE_TOKEN,
        amount: 300,
        imageUrl: '/assets/rewards/knowledge-token.png'
      }
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    isCompleted: false,
    progress: 50,
    requiredLevel: 2,
    xpReward: 500
  },
  {
    id: uuidv4(),
    title: 'Web Development Journey',
    description: 'Master the fundamentals of web development through a series of challenges.',
    games: [mockGames[3].id, mockGames[2].id],
    rewards: [
      {
        id: uuidv4(),
        name: 'Web Developer Badge',
        description: 'Badge for completing the Web Development Journey quest',
        tokenType: TokenType.ACHIEVEMENT_BADGE,
        amount: 1,
        imageUrl: '/assets/rewards/web-dev-badge.png'
      },
      {
        id: uuidv4(),
        name: 'Skill Points',
        description: 'Points to upgrade your web development skills',
        tokenType: TokenType.SKILL_POINT,
        amount: 200,
        imageUrl: '/assets/rewards/skill-point.png'
      }
    ],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    isCompleted: false,
    progress: 25,
    requiredLevel: 3,
    xpReward: 750
  },
  {
    id: uuidv4(),
    title: 'Database Master',
    description: 'Become proficient in database design and optimization.',
    games: [mockGames[1].id],
    rewards: [
      {
        id: uuidv4(),
        name: 'Database Expert Badge',
        description: 'Badge for completing the Database Master quest',
        tokenType: TokenType.ACHIEVEMENT_BADGE,
        amount: 1,
        imageUrl: '/assets/rewards/database-badge.png'
      },
      {
        id: uuidv4(),
        name: 'Experience Points',
        description: 'XP for mastering database concepts',
        tokenType: TokenType.EXPERIENCE_POINT,
        amount: 1000,
        imageUrl: '/assets/rewards/xp.png'
      }
    ],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    isCompleted: false,
    progress: 0,
    requiredLevel: 4,
    xpReward: 800
  }
];

// Mock Achievements Data
export const mockAchievements: Achievement[] = [
  {
    id: "code-warrior-achievement",
    name: 'Code Warrior',
    description: 'Complete 10 coding challenges',
    imageUrl: 'https://png.pngtree.com/png-clipart/20230617/ourlarge/pngtree-3d-golden-trophy-champion-isolated-image-transparent-background-png-image_7153527.png',
    isUnlocked: true,
    isClaimed: true,
    progress: 100,
    requiredValue: 10,
    currentValue: 12,
    category: 'Coding',
    rarity: 'Common'
  },
  {
    id: "quiz-master-achievement",
    name: 'Quiz Master',
    description: 'Score 90% or higher on 5 quizzes',
    imageUrl: 'https://img.pikbest.com/origin/09/24/46/36upIkbEsTS4V.png!w700wp',
    isUnlocked: false,
    isClaimed: false,
    progress: 0,
    requiredValue: 5,
    currentValue: 0,
    category: 'Quizzes',
    rarity: 'Uncommon'
  },
  {
    id: "consistent-learner-achievement",
    name: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThV1TIV1z1SsHrNzp06RCyYiCal5qIC4Twv5a92s7OgAUbWdbJd7H7eGn6ukaTyfHG7Ss&usqp=CAU',
    isUnlocked: true,
    isClaimed: true,
    progress: 100,
    requiredValue: 7,
    currentValue: 9,
    category: 'Engagement',
    rarity: 'Common'
  },
  {
    id: "algorithm-genius-achievement",
    name: 'Algorithm Genius',
    description: 'Solve 20 algorithm challenges',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgx1mdXei_LG7JtWz8a6uCoKAYyknKnT501pJObJPRzTghmZiXc9NtK4PN8bbqBKxM9KiXP_q87bxmOeP4o8uVqO6gJ7O0vyzLygJHubwXX-t_PTsHKU0I8IiDWRAYl3L8kjQjVh4rXPsNyLVi7ZZCpK9c0ETUYWCbMMCML-O398gNciNAWfq35RRAZhDk/s1600/(%20Anhpng.com%20)%20-%20C%C3%9AP%20-%20HUY%20CH%C6%AF%C6%A0NG%20-%20HUY%20HI%E1%BB%86U%20(120).png',
    isUnlocked: false,
    isClaimed: false,
    progress: 45,
    requiredValue: 20,
    currentValue: 9,
    category: 'Algorithms',
    rarity: 'Rare'
  },
  {
    id: uuidv4(),
    name: 'Security Specialist',
    description: 'Complete all cybersecurity challenges',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTKEdIh0GWqK0nhoQmjVS593leJh70IEQU65xcUXDKiuaAEC_zSPdJebsHO7oTOwwH2W8&usqp=CAU',
    isUnlocked: false,
    progress: 33,
    requiredValue: 6,
    currentValue: 2,
    category: 'Security',
    rarity: 'Epic'
  },
  {
    id: uuidv4(),
    name: 'Full Stack Developer',
    description: 'Master both frontend and backend challenges',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ54sTwFXzfG4-623RpdYBiJn9KjYIzI5qgUDHo6-4S2eNlA80qwn1Z6WG1f93-CaAIFE&usqp=CAU',
    isUnlocked: false,
    progress: 70,
    requiredValue: 10,
    currentValue: 7,
    category: 'Web Development',
    rarity: 'Rare'
  }
];

// Mock Leaderboard Data
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: uuidv4(),
    rank: 1,
    username: 'CodeMaster2023',
    avatarUrl: '/assets/avatars/user1.png',
    score: 9850,
    level: 42,
    badges: 28,
    isCurrentUser: false
  },
  {
    id: uuidv4(),
    rank: 2,
    username: 'AlgorithmQueen',
    avatarUrl: '/assets/avatars/user2.png',
    score: 9720,
    level: 40,
    badges: 26,
    isCurrentUser: false
  },
  {
    id: uuidv4(),
    rank: 3,
    username: 'DevNinja',
    avatarUrl: '/assets/avatars/user3.png',
    score: 9540,
    level: 39,
    badges: 25,
    isCurrentUser: false
  },
  {
    id: uuidv4(),
    rank: 4,
    username: 'CurrentUser',
    avatarUrl: '/assets/avatars/user4.png',
    score: 9350,
    level: 38,
    badges: 23,
    isCurrentUser: true
  },
  {
    id: uuidv4(),
    rank: 5,
    username: 'TechWizard',
    avatarUrl: '/assets/avatars/user5.png',
    score: 9200,
    level: 37,
    badges: 22,
    isCurrentUser: false
  },
  {
    id: uuidv4(),
    rank: 6,
    username: 'DataScientist',
    avatarUrl: '/assets/avatars/user6.png',
    score: 9050,
    level: 36,
    badges: 21,
    isCurrentUser: false
  },
  {
    id: uuidv4(),
    rank: 7,
    username: 'CyberDefender',
    avatarUrl: '/assets/avatars/user7.png',
    score: 8900,
    level: 35,
    badges: 20,
    isCurrentUser: false
  },
  {
    id: uuidv4(),
    rank: 8,
    username: 'WebGuru',
    avatarUrl: '/assets/avatars/user8.png',
    score: 8750,
    level: 34,
    badges: 19,
    isCurrentUser: false
  },
  {
    id: uuidv4(),
    rank: 9,
    username: 'MobileDev',
    avatarUrl: '/assets/avatars/user9.png',
    score: 8600,
    level: 33,
    badges: 18,
    isCurrentUser: false
  },
  {
    id: uuidv4(),
    rank: 10,
    username: 'AIEnthusiast',
    avatarUrl: '/assets/avatars/user10.png',
    score: 8450,
    level: 32,
    badges: 17,
    isCurrentUser: false
  }
];

// Mock User Profile Data
export const mockUserProfile: GameFiProfile = {
  id: uuidv4(),
  username: 'CurrentUser',
  level: 38,
  xp: 9350,
  xpToNextLevel: 1000,
  knowledgeTokens: 2450,
  skillPoints: 1850,
  completedGames: 87,
  completedQuests: 12,
  achievements: 23,
  rank: 4,
  avatarUrl: '/assets/avatars/user4.png',
  joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
  streak: 9,
  badges: [
    {
      id: "code-warrior-achievement",
      name: 'Code Warrior',
      imageUrl: 'https://png.pngtree.com/png-clipart/20230617/ourlarge/pngtree-3d-golden-trophy-champion-isolated-image-transparent-background-png-image_7153527.png'
    },
    {
      id: "consistent-learner-achievement",
      name: 'Consistent Learner',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThV1TIV1z1SsHrNzp06RCyYiCal5qIC4Twv5a92s7OgAUbWdbJd7H7eGn6ukaTyfHG7Ss&usqp=CAU'
    }
  ]
};

// Daily challenges
export const mockDailyChallenges = [
  {
    id: uuidv4(),
    title: 'Daily Coding Challenge',
    description: 'Solve today\'s coding problem to earn bonus tokens',
    points: 50,
    timeLimit: 15, // minutes
    isCompleted: false,
    category: GameCategory.PROGRAMMING,
    difficulty: DifficultyLevel.INTERMEDIATE
  },
  {
    id: uuidv4(),
    title: 'Quick Quiz',
    description: 'Test your knowledge with 5 random questions',
    points: 30,
    timeLimit: 5, // minutes
    isCompleted: true,
    category: GameCategory.GENERAL_KNOWLEDGE,
    difficulty: DifficultyLevel.BEGINNER
  },
  {
    id: uuidv4(),
    title: 'Memory Challenge',
    description: 'Improve your memory with this quick game',
    points: 20,
    timeLimit: 3, // minutes
    isCompleted: false,
    category: GameCategory.GENERAL_KNOWLEDGE,
    difficulty: DifficultyLevel.BEGINNER
  }
];

// Learning paths
export const mockLearningPaths = [
  {
    id: uuidv4(),
    title: 'Full Stack Web Development',
    description: 'Master both frontend and backend web development',
    games: [mockGames[3].id, mockGames[2].id, mockGames[1].id],
    progress: 45,
    totalGames: 12,
    completedGames: 5,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ54sTwFXzfG4-623RpdYBiJn9KjYIzI5qgUDHo6-4S2eNlA80qwn1Z6WG1f93-CaAIFE&usqp=CAU',
    estimatedTime: '3 months',
    level: DifficultyLevel.INTERMEDIATE
  },
  {
    id: uuidv4(),
    title: 'Data Science Fundamentals',
    description: 'Learn the basics of data science and machine learning',
    games: [mockGames[6].id, mockGames[4].id],
    progress: 20,
    totalGames: 10,
    completedGames: 2,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdPj3EGP36Vn1IrCMQUm9m3-xsrn2Awe5Nvw&s',
    estimatedTime: '2 months',
    level: DifficultyLevel.INTERMEDIATE
  },
  {
    id: uuidv4(),
    title: 'Cybersecurity Specialist',
    description: 'Become proficient in cybersecurity concepts and practices',
    games: [mockGames[2].id],
    progress: 10,
    totalGames: 15,
    completedGames: 1,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG7XcVLVZMrqwZ_wSoG-Zl3x1ZjICAsAGzqQ&s',
    estimatedTime: '4 months',
    level: DifficultyLevel.ADVANCED
  }
];
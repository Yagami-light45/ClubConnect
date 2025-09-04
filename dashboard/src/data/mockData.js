import { USER_ROLES, APPLICATION_STATUS, CLUB_STATUS, NOTIFICATION_TYPES } from '../utils/constants';

export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@college.edu',
    role: USER_ROLES.ADMIN,
    password: 'admin123'
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john@college.edu',
    role: USER_ROLES.CLUB_HEAD,
    password: 'club123',
    clubId: 1
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    email: 'sarah@college.edu',
    role: USER_ROLES.CLUB_HEAD,
    password: 'club123',
    clubId: 2
  },
  {
    id: 4,
    name: 'Mike Wilson',
    email: 'mike@college.edu',
    role: USER_ROLES.STUDENT,
    password: 'student123',
    branch: 'Computer Science',
    year: 2
  },
  {
    id: 5,
    name: 'Emma Davis',
    email: 'emma@college.edu',
    role: USER_ROLES.STUDENT,
    password: 'student123',
    branch: 'Electronics',
    year: 1
  },
  {
    id: 6,
    name: 'Alex Chen',
    email: 'alex@college.edu',
    role: USER_ROLES.CLUB_HEAD,
    password: 'club123',
    clubId: 4
  },
  {
    id: 7,
    name: 'Lisa Rodriguez',
    email: 'lisa@college.edu',
    role: USER_ROLES.STUDENT,
    password: 'student123',
    branch: 'Mechanical Engineering',
    year: 3
  }
];

export const mockClubs = [
  {
    id: 1,
    name: 'Computer Science Society',
    description: 'A community for tech enthusiasts to learn, build, and network with industry professionals.',
    category: 'Technical',
    headId: 2,
    headName: 'John Smith',
    status: CLUB_STATUS.APPROVED,
    isRecruiting: true,
    recruitmentDeadline: '2024-12-15',
    members: 150,
    location: 'Engineering Building',
    customQuestions: [
      'What programming languages do you know?',
      'Describe a project you have worked on.',
      'Why do you want to join the Computer Science Society?'
    ]
  },
  {
    id: 2,
    name: 'Photography Club',
    description: 'Capture moments, develop skills, and explore the art of photography through workshops and exhibitions.',
    category: 'Arts',
    headId: 3,
    headName: 'Sarah Johnson',
    status: CLUB_STATUS.APPROVED,
    isRecruiting: true,
    recruitmentDeadline: '2024-12-20',
    members: 80,
    location: 'Arts Center',
    customQuestions: [
      'Do you have experience with photography?',
      'What type of photography interests you most?',
      'Do you own a camera?'
    ]
  },
  {
    id: 3,
    name: 'Debate Society',
    description: 'Sharpen your critical thinking and public speaking skills through competitive debates.',
    category: 'Academic',
    headId: null,
    headName: null,
    status: CLUB_STATUS.APPROVED,
    isRecruiting: false,
    recruitmentDeadline: null,
    members: 45,
    location: 'Student Center',
    customQuestions: []
  },
  {
    id: 4,
    name: 'Robotics Club',
    description: 'Design, build, and program robots while learning cutting-edge automation technologies.',
    category: 'Technical',
    headId: 6,
    headName: 'Alex Chen',
    status: CLUB_STATUS.APPROVED,
    isRecruiting: true,
    recruitmentDeadline: '2025-01-10',
    members: 65,
    location: 'Engineering Lab',
    customQuestions: [
      'Do you have experience with robotics or automation?',
      'What programming languages are you familiar with?',
      'Describe any hardware projects you have worked on.'
    ]
  }
];

export const mockApplications = [
  {
    id: 1,
    studentId: 4,
    studentName: 'Mike Wilson',
    studentEmail: 'mike@college.edu',
    studentBranch: 'Computer Science',
    studentYear: 2,
    clubId: 1,
    clubName: 'Computer Science Society',
    status: APPLICATION_STATUS.PENDING,
    appliedAt: '2024-12-03T10:30:00Z',
    answers: [
      'JavaScript, Python, Java',
      'Built a web app for task management using React and Node.js',
      'I want to improve my coding skills and work on exciting projects'
    ]
  },
  {
    id: 2,
    studentId: 5,
    studentName: 'Emma Davis',
    studentEmail: 'emma@college.edu',
    studentBranch: 'Electronics',
    studentYear: 1,
    clubId: 2,
    clubName: 'Photography Club',
    status: APPLICATION_STATUS.ACCEPTED,
    appliedAt: '2024-12-02T14:20:00Z',
    answers: [
      'Yes, I have been doing photography as a hobby for 2 years',
      'Portrait and landscape photography',
      'Yes, I have a DSLR camera'
    ]
  },
  {
    id: 3,
    studentId: 4,
    studentName: 'Mike Wilson',
    studentEmail: 'mike@college.edu',
    studentBranch: 'Computer Science',
    studentYear: 2,
    clubId: 4,
    clubName: 'Robotics Club',
    status: APPLICATION_STATUS.PENDING,
    appliedAt: '2024-12-01T16:45:00Z',
    answers: [
      'I have built some Arduino projects and worked with sensors',
      'Python, C++, and some JavaScript',
      'Created an automated plant watering system using Arduino and moisture sensors'
    ]
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Mike Wilson',
    studentEmail: 'mike@college.edu',
    studentBranch: 'Computer Science',
    studentYear: 2,
    clubId: 2,
    clubName: 'Photography Club',
    status: APPLICATION_STATUS.PENDING,
    appliedAt: '2024-11-28T09:15:00Z',
    answers: [
      'I am a beginner but very interested in learning',
      'Street photography and tech events',
      'No, but I plan to get one if accepted'
    ]
  },
  {
    id: 5,
    studentId: 4,
    studentName: 'Mike Wilson',
    studentEmail: 'mike@college.edu',
    studentBranch: 'Computer Science',
    studentYear: 2,
    clubId: 3,
    clubName: 'Debate Society',
    status: APPLICATION_STATUS.REJECTED,
    appliedAt: '2024-11-20T11:30:00Z',
    answers: []
  },
  {
    id: 6,
    studentId: 7,
    studentName: 'Lisa Rodriguez',
    studentEmail: 'lisa@college.edu',
    studentBranch: 'Mechanical Engineering',
    studentYear: 3,
    clubId: 4,
    clubName: 'Robotics Club',
    status: APPLICATION_STATUS.ACCEPTED,
    appliedAt: '2024-11-25T13:20:00Z',
    answers: [
      'Yes, I have experience with mechanical design and 3D printing',
      'Python, MATLAB, and C',
      'Designed and built a robotic arm for my capstone project'
    ]
  }
];

export const mockNotifications = [
  {
    id: 1,
    userId: 5,
    type: NOTIFICATION_TYPES.APPLICATION_ACCEPTED,
    title: 'Application Accepted!',
    message: 'Your application to Photography Club has been accepted.',
    read: false,
    createdAt: '2024-12-04T09:00:00Z'
  },
  {
    id: 2,
    userId: 4,
    type: NOTIFICATION_TYPES.APPLICATION_SUBMITTED,
    title: 'Application Submitted',
    message: 'Your application to Computer Science Society has been submitted successfully.',
    read: true,
    createdAt: '2024-12-03T10:35:00Z'
  },
  {
    id: 3,
    userId: 4,
    type: NOTIFICATION_TYPES.APPLICATION_REJECTED,
    title: 'Application Update',
    message: 'Your application to Debate Society was not selected this time.',
    read: false,
    createdAt: '2024-11-22T15:45:00Z'
  },
  {
    id: 4,
    userId: 7,
    type: NOTIFICATION_TYPES.APPLICATION_ACCEPTED,
    title: 'Welcome to Robotics Club!',
    message: 'Congratulations! You have been accepted to Robotics Club.',
    read: true,
    createdAt: '2024-11-26T10:15:00Z'
  }
];
import {
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  threejs,
  python,
  pytorch,
  tensorflow,
  flutter,
  dart,
  java,
  csharp,
  cpp,
  gct,
  gogs,
  jiotify,
  chattyBatty1,
  chattyBatty2,
  gogs1,
  gogs2,
  gogs3,
  olively1,
  olively2,
  olively3,
  olively4,
  rounda1,
  rounda2,
  rounda3,
  rounda4,
  rounda5,
  tasky1,
  tasky2,
  rabiaaSmida,
  ridhaZaghdoud,
  samyBenjeddou,
} from "../assets";

export const navLinks = [
  { id: "about", title: "About" },
  { id: "experience", title: "Experience" },
  { id: "work", title: "Projects" },
];

export const technologies = [
  { name: "HTML 5", icon: html, color: '#ffffff' },
  { name: "CSS 3", icon: css, color: '#264de4' },
  { name: "JavaScript", icon: javascript, color: '#f7df1e' },
  { name: "TypeScript", icon: typescript, color: '#3178c6' },
  { name: "React", icon: reactjs, color: '#61dafb' },
  { name: "Redux", icon: redux, color: '#764abc' },
  { name: "Tailwind", icon: tailwind, color: '#38bdf8' },
  { name: "Node.js", icon: nodejs, color: '#3c873a' },
  { name: "MongoDB", icon: mongodb, color: '#13aa52' },
  { name: "Three.js", icon: threejs, color: '#ffffff' },
  { name: "Git", icon: git, color: '#f05033' },
  { name: "Figma", icon: figma, color: '#a259ff' },
  { name: "Docker", icon: docker, color: '#099cec' },
  { name: "Python", icon: python, color: '#3776ab' },
  { name: "PyTorch", icon: pytorch, color: '#ee4c2c' },
  { name: "TensorFlow", icon: tensorflow, color: '#ff6f00' },
  { name: "Flutter", icon: flutter, color: '#02569b' },
  { name: "Dart", icon: dart, color: '#0175c2' },
  { name: "Java", icon: java, color: '#e56f0f' },
  { name: "C#", icon: csharp, color: '#682a9b' },
  { name: "C++", icon: cpp, color: '#00599c' },
];

// Ordered most recent -> oldest
export const experiences = [
  {
    title: "Freelance",
    company_name: "GOGS Consulting",
    icon: gogs,
    iconBg: "#1e2a47",
    date: "2025",
    points: [
      "Designed and built the company presentation website highlighting services and industry focus.",
      "Collaborated directly with stakeholders to refine structure, copy, and visual identity.",
      "Implemented responsive UI with performance‑minded component patterns.",
    ],
  },
  {
    title: "Internship",
    company_name: "Academic / Jiotify",
    icon: git,
    iconBg: "#253047",
    date: "2025",
    points: [
      "Developed and deployed a model to predict olive tree diseases.",
      "Delivered treatment guidance and user forum to share experiences",
      "Iterated on performance using validation feedback loops.",
    ],
  },
  {
    title: "Internship",
    company_name: "Jiotify",
    icon: jiotify,
    iconBg: "#2d3142",
    date: "2024",
    points: [
      "Explored sensor data acquisition for smart irrigation systems.",
      "Helped draft early anomaly detection strategy for system health.",
      "Prototyped a simulation environment for iterative model testing.",
    ],
  },
  {
    title: "Internship",
    company_name: "Groupe Chimique Tunisien (GCT)",
    icon: gct,
    iconBg: "#3a2e2a",
    date: "2023",
    points: [
      "Cleaned and normalized machine maintenance datasets.",
      "Built dashboards supporting operational and business decisions."
    ],
  },
];

export const testimonials = [
  {
    testimonial:
      "I am highly impressed with Amin's skill and professional approach. It was a delightful experience, and I am completely satisfied with the results.",
    name: "Rabiaa Smida",
    designation: "Dr, Geology expert and CEO at",
    company: "GoGs Consulting",
    image: rabiaaSmida,
  },
  {
    testimonial:
      "It has been a profound honor to supervise Amin on his End of Studies project. His exceptional intelligence and unwavering work ethic make him a truly remarkable student.",
    name: "Ridha Zaghdoud",
    designation: "Dr, Researcher and expert in AI",
    company: "",
    image: ridhaZaghdoud,
  },
  {
    testimonial:
      "Amin is a dedicated and talented individual. His contributions to our project were invaluable, and his positive attitude made working with him a pleasure.",
    name: "Sami Benjeddou",
    designation: "HR Manager",
    company: "at Jiotify",
    image: samyBenjeddou,
  },
];

export const projects = [
  {
    name: "CHATTY BATTY",
    description:
      "Desktop application that integrates OpenAI API to provide users with direct access to ChatGPT. Features include text chat, vocal message support, and AI-powered image generation capabilities.",
    tags: [
      { name: "java", color: "blue-text-gradient" },
      { name: "openai", color: "green-text-gradient" },
      { name: "json", color: "pink-text-gradient" },
    ],
    image: chattyBatty1,
    gallery: [chattyBatty1, chattyBatty2],
    source_code_link: "https://github.com/",
  },
  {
    name: "GOGS",
    description:
      "Corporate presentation website showcasing GOGS as an enterprise, highlighting their services, expertise, and industry focus areas with modern web design.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "tailwind", color: "green-text-gradient" },
      { name: "3JS", color: "pink-text-gradient" },
    ],
    image: gogs1,
    gallery: [gogs1, gogs2, gogs3],
    source_code_link: "https://github.com/",
  },
  {
    name: "OLIVELY",
    description:
      "End of studies project featuring an AI model that detects olive tree diseases from leaf images. Deployed as an Android app with photo diagnosis, community forum for sharing experiences, and diagnosis history tracking.",
    tags: [
      { name: "python", color: "blue-text-gradient" },
      { name: "tensorflow", color: "green-text-gradient" },
      { name: "flutter", color: "pink-text-gradient" },
    ],
    image: olively1,
    gallery: [olively1, olively2, olively3, olively4],
    source_code_link: "https://github.com/",
  },
  {
    name: "ROUNDA",
    description:
      "Interactive quiz game application offering both offline and online multiplayer modes. Features include real-time competitive gameplay with other users and a comprehensive ranking system.",
    tags: [
      { name: "flutter", color: "blue-text-gradient" },
      { name: "dart", color: "green-text-gradient" },
      { name: "firebase", color: "pink-text-gradient" },
    ],
    image: rounda1,
    gallery: [rounda1, rounda2, rounda3, rounda4, rounda5],
    source_code_link: "https://github.com/",
  },
  {
    name: "TASKY",
    description:
      "Daily task management application that helps users organize their schedule with smart reminders and calendar integration for tracking and future consultation of completed tasks.",
    tags: [
      { name: "flutter", color: "blue-text-gradient" },
      { name: "dart", color: "green-text-gradient" },
      { name: "Firebase", color: "pink-text-gradient" },
    ],
    image: tasky1,
    gallery: [tasky1, tasky2],
    source_code_link: "https://github.com/",
  },
];

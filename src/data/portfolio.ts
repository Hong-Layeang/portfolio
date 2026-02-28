// ============================================
// Portfolio Data — Single source of truth
// ============================================

// ─── Image Imports ───────────────────────────
import nisitUserCover from "../assets/images/NisitTrade-User-Cover.png";
import nisitAdminCover from "../assets/images/NisitTrade-Admin-Cover.png";
import quizzy1 from "../assets/images/quizzy/quizzy1.png";
import quizzy2 from "../assets/images/quizzy/quizzy2.png";
import quizzy3 from "../assets/images/quizzy/quizzy3.png";
import quizzy4 from "../assets/images/quizzy/quizzy4.png";
import quizzy5 from "../assets/images/quizzy/quizzy5.png";

export interface NavLink {
  label: string;
  href: string;
}

export interface SkillItem {
  name: string;
}

export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;    // GitHub repo URL
  live?: string;      // Live demo URL
  videoId?: string;   // YouTube video ID (autoplay on hover)
  images?: string[];  // Array of image paths (carousel if multiple)
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

// ─── Navigation ──────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// ─── Personal Info ───────────────────────────
export const PERSONAL = {
  name: "HONG LAYEANG",
  firstName: "HONG",
  lastName: "LAYEANG",
  title: "Software Engineering",
  tagline: "Eager to learn, build, and grow — one project at a time.",
  location: "Phnom Penh / Remote",
  email: "layeangkh@gmail.com",
  resumeUrl: "/resume.pdf",
  bio: `I'm a software engineering intern with a passion for building clean, practical solutions. Currently sharpening my skills across frontend and backend development — always eager to learn new technologies, tackle real-world problems, and grow as a developer.`,
};

// ─── Skills (Icons Grid) ─────────────────────
export const SKILLS: SkillItem[] = [
  { name: "React" },
  { name: "Next.js" },
  { name: "TypeScript" },
  { name: "JavaScript" },
  { name: "Node.js" },
  { name: "Python" },
  { name: "PostgreSQL" },
  { name: "MongoDB" },
  { name: "Redis" },
  { name: "GraphQL" },
  { name: "Docker" },
  { name: "AWS" },
  { name: "Git" },
  { name: "Tailwind" },
  { name: "Figma" },
  { name: "Linux" },
];

// ─── Projects ────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: "01",
    category: "FULLSTACK",
    title: "NisitTrade – Campus Marketplace (User)",
    description:
      "A university-focused marketplace platform allowing verified students to browse and manage product listings securely within a trusted campus community. It uses Microsoft OAuth for student identity verification and JWT for secure sessions.",
    tags: ["Node.js", "Express.js", "Sequelize", "JWT", "Microsoft OAuth", "Flutter"],
    github: "https://github.com/Hong-Layeang/NisitTrade-User",
    images: [nisitUserCover],
  },
  {
    id: "02",
    category: "FULLSTACK",
    title: "NisitTrade – Campus Marketplace (Admin)",
    description:
      "Admin interface for the NisitTrade marketplace. Provides administrators with user management, product moderation, and platform policy enforcement. Shares backend and frontend structure with the user app.",
    tags: ["Node.js", "Express.js", "Sequelize", "JWT", "Flutter"],
    github: "https://github.com/Hong-Layeang/NisitTrade-Admin",
    images: [nisitAdminCover],
  },
  {
    id: "03",
    category: "GAME DEV",
    title: "The Blade: Twin Vengeance",
    description:
      "A high-octane, third-person action experience built in Unity. Master the art of the blade, execute fluid combos, and survive the challenge.",
    tags: ["Unity", "C#"],
    github: "https://github.com/Haysansan/Game-Development----Final-Project",
    videoId: "aTNigJfAk4Q",
  },
  {
    id: "04",
    category: "FULLSTACK",
    title: "QuickStock – Inventory Management",
    description:
      "Streamlined inventory management system with role-based dashboards for Admins and Suppliers, product management, inventory tracking, low stock alerts, and analytics UI.",
    tags: ["Node.js", "Express.js", "MySQL", "JWT", "React", "Vite", "Tailwind CSS", "Zustand", "Chart.js"],
    github: "https://github.com/Hong-Layeang/QuickStock",
    videoId: "IfQ-KSUv7IY",
  },
  {
    id: "05",
    category: "FULLSTACK",
    title: "Grand Cineplex – Database Admin",
    description:
      "A database management system with data generation utilities and a modern web interface for PostgreSQL administration. Includes scalable data generation, SQL console, role/privilege management, and schema visualization.",
    tags: ["PostgreSQL", "Python", "Next.js", "TypeScript", "TailwindCSS", "Axios"],
    github: "https://github.com/Hong-Layeang/Grand-Cineplex-DBA",
    videoId: "goEl2iz4AUI",
  },
  {
    id: "06",
    category: "FRONTEND",
    title: "Keyboard Showcase",
    description:
      "A frontend project to display and explore keyboard layouts and components with an interactive, visually rich interface.",
    tags: ["React", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/Hong-Layeang/keyboard-showcase",
    videoId: "GHxzL1t8x6E"
  },
  {
    id: "07",
    category: "FULLSTACK",
    title: "Learning Management System",
    description:
      "An educational platform designed for efficient administration and seamless interaction between students, teachers, and administrators. Includes course management, user roles, and classroom features.",
    tags: ["Fullstack"],
    github: "https://github.com/RaksaOC/Learning-Management-System",
    videoId: "TtJ_sTZEOfY",
  },
  {
    id: "08",
    category: "FRONTEND",
    title: "Quizzy – Fun Educational Quizzes & Games",
    description:
      "A kid-friendly interactive web application featuring multiple quiz and game components, such as multiple-choice quizzes, a memory match game, and simple math challenges. Designed to make learning fun and engaging with animations, score tracking, and responsive interfaces.",
    tags: ["Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/Hong-Layeang/Quizzy",
    live: "https://quizzy-orpin.vercel.app/",
    images: [quizzy1, quizzy2, quizzy3, quizzy4, quizzy5],
  },
];

// ─── Social Links ────────────────────────────
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "github",
    url: "https://github.com/Hong-Layeang",
    label: "GitHub",
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/hong-layeang-ba182a365",
    label: "LinkedIn",
  },
  {
    platform: "email",
    url: "mailto:layeangkh@gmail.com",
    label: "Email",
  },
];

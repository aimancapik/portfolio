// x/y in SVG viewBox coords (0–1200 wide, 0–750 tall)
// Matched to terrain drawn in WorldMap.jsx SVG
export const locations = [
  {
    id: 'uthm_castle',
    name: 'UTHM Castle',
    x: 130,
    y: 560,
    color: '#f5a623',
    type: 'castle',
    content: {
      title: 'UTHM Castle',
      subtitle: 'Education',
      details: [
        'Degree: Bachelor of Software Engineering',
        'University: Universiti Tun Hussein Onn Malaysia',
        'Year: 2020 - 2024',
        'CGPA: 3.73',
      ],
      dialogue:
        "Welcome, traveller. This ancient castle holds the knowledge of software engineering. I studied here for 4 years, mastering the fundamentals of my craft.",
    },
  },
  {
    id: 'amast_city',
    name: 'AMAST City',
    x: 320,
    y: 340,
    color: '#a9a9ff',
    type: 'city',
    content: {
      title: 'AMAST City',
      subtitle: 'Internship',
      details: [
        'Role: Mobile Application Developer (Contract + Internship)',
        'Company: AMAST Sdn Bhd',
        'Skills: Python, ChatGPT API, YOLOv8, Grafana',
        'Domain: AI Planogramming & retail shelf detection',
      ],
      dialogue:
        "This bustling tech city was my first real adventure. I built AI systems here — teaching machines to see retail shelves and automating workflows with language models.",
    },
  },
  {
    id: 'skills_dungeon',
    name: 'Skills Dungeon',
    x: 430,
    y: 430,
    color: '#e94560',
    type: 'dungeon',
    content: {
      title: 'Skills Dungeon',
      subtitle: 'Tech Stack',
      details: [
        'Frontend: Angular (Lv.8), Ionic (Lv.8), React (Lv.6), HTML/CSS (Lv.9)',
        'Backend: Node.js (Lv.7), TypeScript (Lv.7), SQL Server (Lv.6)',
        'Cloud: AWS (Lv.5), Supabase (Lv.5)',
        'AI/ML: YOLOv8 (Lv.4), Ollama/LLM (Lv.5)',
        'Other: Flutter (Lv.4), Git (Lv.8)',
      ],
      dialogue:
        "The dungeon where I forged my abilities. Each skill earned through real battles — not tutorials. Enter and witness the arsenal.",
    },
  },
  {
    id: 'proppy_tower',
    name: 'ProppyApp Tower',
    x: 700,
    y: 310,
    color: '#c0c0ff',
    type: 'tower',
    content: {
      title: 'ProppyApp Tower',
      subtitle: 'Work Experience',
      details: [
        'Role: Full-Stack Developer',
        'Company: ProppyApp Sdn Bhd (Proptech Startup)',
        'Duration: ~2 years',
        'Stack: Angular, Ionic, Node.js, TypeScript, SQL Server, AWS SES, Puppeteer',
        'Built: Event mgmt, OCR card scanning, PDF tickets, RSVP, Market360 analytics',
      ],
      dialogue:
        "The great tower where I truly leveled up. Built real features used by real users. From email systems to analytics dashboards, every floor holds a different challenge I conquered.",
    },
  },
  {
    id: 'project_ruins',
    name: 'Project Ruins',
    x: 900,
    y: 430,
    color: '#2ecc71',
    type: 'ruins',
    content: {
      title: 'Project Ruins',
      subtitle: 'Side Projects',
      details: [
        'Recipe App: React + Vite + Supabase + Tailwind (in progress)',
        'Vista: Property investment calculator — Flutter/Dart, Malaysian market',
        'Hangout Finder: Location-based social discovery web app',
      ],
      dialogue:
        "These ancient ruins hold projects born from curiosity. Some complete, some still being excavated. Each one a lesson, each one mine.",
    },
  },
  {
    id: 'tavern',
    name: 'Tavern',
    x: 1060,
    y: 520,
    color: '#cd853f',
    type: 'building',
    content: {
      title: 'Tavern',
      subtitle: 'Contact',
      details: [
        'Email: muhammadaimansyafiq@email.com',
        'GitHub: github.com/aimancapik',
        'LinkedIn: linkedin.com/in/muhammad-aiman-syafiq',
        'Status: Open to work — BA, SA, Full-Stack in KL/Selangor',
      ],
      dialogue:
        "Ah, a visitor who made it this far. Pull up a chair. I am open to new quests — Business Analyst, System Analyst, or Full-Stack adventures. Shall we talk?",
    },
  },
];

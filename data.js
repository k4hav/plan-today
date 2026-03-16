/* =====================================================
   PlanToday — data.js
   All static data: goal presets, templates, quotes
   ===================================================== */

const GOAL_PRESETS = {
  jee: {
    label: '🎓 JEE', name: 'JEE Preparation',
    cats: [
      {id:'physics',   label:'Physics',       emoji:'⚛',  color:'#3b82f6'},
      {id:'chemistry', label:'Chemistry',     emoji:'🧪', color:'#8b5cf6'},
      {id:'maths',     label:'Maths',         emoji:'📐', color:'#f59e0b'},
      {id:'revision',  label:'Revision',      emoji:'🔄', color:'#22c55e'},
      {id:'mocktest',  label:'Mock Test',     emoji:'📝', color:'#ef4444'},
    ]
  },
  neet: {
    label: '🩺 NEET', name: 'NEET Preparation',
    cats: [
      {id:'biology',   label:'Biology',       emoji:'🧬', color:'#22c55e'},
      {id:'chemistry', label:'Chemistry',     emoji:'🧪', color:'#8b5cf6'},
      {id:'physics',   label:'Physics',       emoji:'⚛',  color:'#3b82f6'},
      {id:'revision',  label:'Revision',      emoji:'🔄', color:'#f59e0b'},
      {id:'mocktest',  label:'Mock Test',     emoji:'📝', color:'#ef4444'},
    ]
  },
  upsc: {
    label: '🏛 UPSC', name: 'UPSC Preparation',
    cats: [
      {id:'polity',    label:'Polity',        emoji:'⚖',  color:'#3b82f6'},
      {id:'history',   label:'History',       emoji:'📜', color:'#f59e0b'},
      {id:'geography', label:'Geography',     emoji:'🗺', color:'#22c55e'},
      {id:'economy',   label:'Economy',       emoji:'📊', color:'#8b5cf6'},
      {id:'current',   label:'Current Affairs',emoji:'📰',color:'#ef4444'},
      {id:'mocktest',  label:'Mock Test',     emoji:'📝', color:'#6c63ff'},
    ]
  },
  gate: {
    label: '⚙ GATE', name: 'GATE Preparation',
    cats: [
      {id:'core',      label:'Core Subject',  emoji:'⚙',  color:'#3b82f6'},
      {id:'maths',     label:'Engg Maths',    emoji:'📐', color:'#f59e0b'},
      {id:'aptitude',  label:'Aptitude',      emoji:'🧠', color:'#22c55e'},
      {id:'revision',  label:'Revision',      emoji:'🔄', color:'#8b5cf6'},
      {id:'mocktest',  label:'Mock Test',     emoji:'📝', color:'#ef4444'},
    ]
  },
  cat: {
    label: '📊 CAT', name: 'CAT/MBA Prep',
    cats: [
      {id:'quant',     label:'Quant',         emoji:'🔢', color:'#3b82f6'},
      {id:'verbal',    label:'Verbal',        emoji:'📖', color:'#22c55e'},
      {id:'dilr',      label:'DILR',          emoji:'🧩', color:'#f59e0b'},
      {id:'gk',        label:'GK/Current',    emoji:'🌍', color:'#8b5cf6'},
      {id:'mocktest',  label:'Mock Test',     emoji:'📝', color:'#ef4444'},
    ]
  },
  work: {
    label: '💼 Work', name: 'Professional',
    cats: [
      {id:'work',      label:'Work',          emoji:'💼', color:'#6c63ff'},
      {id:'project',   label:'Project',       emoji:'🚀', color:'#f97316'},
      {id:'meeting',   label:'Meetings',      emoji:'🤝', color:'#3b82f6'},
      {id:'learning',  label:'Learning',      emoji:'📚', color:'#22c55e'},
      {id:'personal',  label:'Personal',      emoji:'👤', color:'#ec4899'},
    ]
  },
  fitness: {
    label: '🏃 Fitness', name: 'Health & Fitness',
    cats: [
      {id:'workout',   label:'Workout',       emoji:'💪', color:'#22c55e'},
      {id:'diet',      label:'Diet',          emoji:'🥗', color:'#f59e0b'},
      {id:'cardio',    label:'Cardio',        emoji:'🏃', color:'#ef4444'},
      {id:'recovery',  label:'Recovery',      emoji:'🧘', color:'#8b5cf6'},
      {id:'tracking',  label:'Tracking',      emoji:'📊', color:'#3b82f6'},
    ]
  },
  ssc: {
    label: '📋 SSC', name: 'SSC Preparation',
    cats: [
      {id:'reasoning', label:'Reasoning',     emoji:'🧠', color:'#6c63ff'},
      {id:'english',   label:'English',       emoji:'📝', color:'#22c55e'},
      {id:'maths',     label:'Maths',         emoji:'📐', color:'#f59e0b'},
      {id:'gk',        label:'GK',            emoji:'🌍', color:'#3b82f6'},
      {id:'mocktest',  label:'Mock Test',     emoji:'📋', color:'#ef4444'},
    ]
  },
  custom: {
    label: '✏ Custom', name: 'Custom Goal',
    cats: [
      {id:'task1',     label:'Category 1',    emoji:'📌', color:'#6c63ff'},
      {id:'task2',     label:'Category 2',    emoji:'🎯', color:'#22c55e'},
      {id:'task3',     label:'Category 3',    emoji:'⭐', color:'#f59e0b'},
    ]
  },
};

const TEMPLATES = [
  {
    icon: '🎓', name: 'Student', desc: 'School / college',
    tasks: [
      {text:'Review lecture notes',     cat:'study',   time:'30m', pri:'high'},
      {text:'Complete assignment',      cat:'study',   time:'1.5h',pri:'high'},
      {text:'Practice problems',        cat:'study',   time:'1h',  pri:'med'},
      {text:'Plan tomorrow',            cat:'study',   time:'20m', pri:'low'},
    ]
  },
  {
    icon: '💼', name: 'Professional', desc: 'Work & career',
    tasks: [
      {text:'Check emails',             cat:'work',    time:'30m', pri:'high'},
      {text:'Complete priority task',   cat:'work',    time:'2h',  pri:'high'},
      {text:'Review project',           cat:'project', time:'45m', pri:'med'},
      {text:'Learn new skill',          cat:'learning',time:'30m', pri:'low'},
    ]
  },
  {
    icon: '🏃', name: 'Fitness', desc: 'Health goals',
    tasks: [
      {text:'Morning workout',          cat:'workout', time:'1h',  pri:'high'},
      {text:'Meal prep',                cat:'diet',    time:'30m', pri:'high'},
      {text:'Evening walk',             cat:'cardio',  time:'30m', pri:'med'},
    ]
  },
  {
    icon: '📝', name: 'Exam Prep', desc: 'Competitive exams',
    tasks: [
      {text:'Solve 25 practice questions', cat:'mocktest',time:'1.5h',pri:'high'},
      {text:'Revise weak topics',          cat:'revision',time:'1h',  pri:'high'},
      {text:'Full mock test',              cat:'mocktest',time:'3h',  pri:'high'},
      {text:'Review mistakes',             cat:'revision',time:'45m', pri:'med'},
    ]
  },
];

const QUOTES = [
  {t: "The secret of getting ahead is getting started.",             a: "Mark Twain"},
  {t: "Discipline is the bridge between goals and accomplishment.",   a: "Jim Rohn"},
  {t: "A little progress each day adds up to big results.",          a: "Satya Nani"},
  {t: "Don't count the days. Make the days count.",                  a: "Muhammad Ali"},
  {t: "Consistency beats talent when talent doesn't work hard.",     a: "Unknown"},
  {t: "Dreams don't work unless you do.",                            a: "John C. Maxwell"},
  {t: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar"},
  {t: "Hard work beats talent when talent fails to work hard.",      a: "Kevin Durant"},
  {t: "One day or day one — you decide.",                            a: "Unknown"},
  {t: "Small daily improvements lead to stunning results.",          a: "Robin Sharma"},
  {t: "Don't wish for it. Work for it.",                             a: "Unknown"},
  {t: "Success usually comes to those who are too busy to be looking for it.", a: "Henry Thoreau"},
];

const NOTE_CATS = {
  general:  {icon: '💡', color: '#6c63ff'},
  learning: {icon: '📖', color: '#8b5cf6'},
  doubt:    {icon: '❓', color: '#f59e0b'},
  win:      {icon: '🏆', color: '#22c55e'},
  reminder: {icon: '🔔', color: '#ef4444'},
  mood:     {icon: '😊', color: '#3b82f6'},
};

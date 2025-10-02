import { Skill } from "./SkillCard";

export const categorizeSkills = (skills: Skill[]) => ({
  "Programming Languages": skills.filter((s) =>
    ["HTML5","CSS","JavaScript","TypeScript","Python","PHP","Java","C++","VB.NET"].includes(s.name)
  ),
  "Frameworks & Libraries": skills.filter((s) =>
    ["React","Next.js","Tailwind","Framer Motion","Flask","Node.js"].includes(s.name)
  ),
  "Tools & Platforms": skills.filter((s) =>
    ["Git","GitHub","Supabase","SQLite3","MySQL","Firebase","MongoDB","NPM"].includes(s.name)
  ),
  "Data & ML": skills.filter((s) =>
    ["NumPy","pandas","scikit-learn","Machine Learning","Large Language Model"].includes(s.name)
  ),
  "Non-Technical Skills": skills.filter((s) =>
    ["Video Editing","Graphic Design","Photography","Creative Writing","Public Speaking","Presentation Skills"].includes(s.name)
  ),
  "Misc": skills.filter((s) =>
    ![
      "HTML5","CSS","JavaScript","TypeScript","Python","PHP","Java","C++","VB.NET",
      "React","Next.js","Tailwind","Framer Motion","Flask","Node.js",
      "Git","GitHub","Supabase","SQLite3","MySQL","Firebase","MongoDB","NPM",
      "NumPy","pandas","scikit-learn","Machine Learning","Large Language Model",
      "Video Editing","Graphic Design","Photography","Creative Writing","Public Speaking","Presentation Skills"
    ].includes(s.name)
  ),
});

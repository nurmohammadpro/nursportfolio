"use client";

import { motion } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import StorageIcon from "@mui/icons-material/Storage";
import DevicesIcon from "@mui/icons-material/Devices";

const Skills = () => {
  const skills = [
    {
      category: "Frontend",
      icon: <DesignServicesIcon className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Tailwind CSS", level: 95 },
        { name: "Material UI", level: 90 },
      ],
    },
    {
      category: "Backend",
      icon: <StorageIcon className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Express", level: 80 },
        { name: "MongoDB", level: 75 },
        { name: "PostgreSQL", level: 70 },
        { name: "REST APIs", level: 90 },
      ],
    },
    {
      category: "Tools & DevOps",
      icon: <DevicesIcon className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Git/GitHub", level: 90 },
        { name: "Docker", level: 75 },
        { name: "AWS", level: 70 },
        { name: "CI/CD", level: 80 },
        { name: "Figma", level: 85 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <CodeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Skills & Expertise
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          My technical toolkit and areas of expertise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {skills.map((skillGroup, index) => (
          <motion.div
            key={skillGroup.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`p-3 bg-gradient-to-br ${skillGroup.color} rounded-lg`}
              >
                {skillGroup.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {skillGroup.category}
              </h3>
            </div>

            <div className="space-y-5">
              {skillGroup.skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {skill.name}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: true }}
                      className={`h-full rounded-full bg-gradient-to-r ${skillGroup.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

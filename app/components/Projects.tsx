"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LaunchIcon from "@mui/icons-material/Launch";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with real-time inventory management and payment processing.",
      tags: ["React", "Next.js", "Node.js", "MongoDB", "Stripe"],
      image: "/project1.jpg",
      github: "https://github.com",
      demo: "https://demo.com",
      category: "fullstack",
      featured: true,
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "Collaborative task management application with drag-and-drop interface and real-time updates.",
      tags: ["React", "TypeScript", "Firebase", "Tailwind"],
      image: "/project2.jpg",
      github: "https://github.com",
      demo: "https://demo.com",
      category: "frontend",
      featured: true,
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description:
        "Real-time weather dashboard with interactive maps and historical data visualization.",
      tags: ["Next.js", "Chart.js", "API", "Material UI"],
      image: "/project3.jpg",
      github: "https://github.com",
      demo: "https://demo.com",
      category: "frontend",
      featured: false,
    },
    {
      id: 4,
      title: "AI Content Generator",
      description:
        "AI-powered content generation platform with advanced NLP capabilities.",
      tags: ["Python", "FastAPI", "React", "OpenAI"],
      image: "/project4.jpg",
      github: "https://github.com",
      demo: "https://demo.com",
      category: "ai",
      featured: false,
    },
  ];

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "frontend", label: "Frontend" },
    { id: "fullstack", label: "Full Stack" },
    { id: "ai", label: "AI/ML" },
  ];

  const filteredProjects = projects.filter(
    (project) => activeFilter === "all" || project.category === activeFilter,
  );

  return (
    <section id="projects" className="py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
          <WorkspacesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Projects
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A selection of my recent work showcasing different technologies and
          solutions
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
              project.featured ? "md:col-span-2 lg:col-span-2" : ""
            }`}
          >
            {/* Project Image */}
            <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <CodeIcon className="w-24 h-24 text-white/20" />
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                {project.featured && (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
                >
                  <GitHubIcon className="w-5 h-5" />
                  Code
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <LaunchIcon className="w-5 h-5" />
                  Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-12">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 font-medium rounded-lg transition-all duration-300"
        >
          View All Projects
          <GitHubIcon className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default Projects;

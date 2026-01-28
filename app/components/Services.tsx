"use client";

import { motion } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import SecurityIcon from "@mui/icons-material/Security";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CloudIcon from "@mui/icons-material/Cloud";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Services = () => {
  const services = [
    {
      icon: <CodeIcon className="w-8 h-8" />,
      title: "Web Application Development",
      description:
        "Custom React & Next.js applications with modern architecture and best practices.",
      features: [
        "SPA/MPA Development",
        "PWA Implementation",
        "API Integration",
        "Performance Optimization",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <CloudIcon className="w-8 h-8" />,
      title: "SaaS Development",
      description:
        "Scalable Software-as-a-Service solutions with subscription management and analytics.",
      features: [
        "Multi-tenant Architecture",
        "Payment Integration",
        "User Management",
        "Analytics Dashboard",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <SecurityIcon className="w-8 h-8" />,
      title: "Malware Removal & Security",
      description:
        "Complete website security audit, malware removal, and protection implementation.",
      features: [
        "Security Audit",
        "Malware Removal",
        "Firewall Setup",
        "Regular Monitoring",
      ],
      color: "from-red-500 to-orange-500",
    },
    {
      icon: <AutoFixHighIcon className="w-8 h-8" />,
      title: "Web Automation",
      description:
        "Custom automation bots and scripts to streamline business processes and workflows.",
      features: [
        "Data Scraping",
        "Process Automation",
        "API Bots",
        "Workflow Automation",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <StorefrontIcon className="w-8 h-8" />,
      title: "E-commerce Solutions",
      description:
        "Feature-rich online stores with secure payment gateways and inventory management.",
      features: [
        "Shopping Cart",
        "Payment Gateway",
        "Inventory System",
        "Order Management",
      ],
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: <SupportAgentIcon className="w-8 h-8" />,
      title: "Maintenance & Support",
      description:
        "Ongoing maintenance, updates, and technical support for existing applications.",
      features: [
        "Regular Updates",
        "Bug Fixes",
        "Performance Monitoring",
        "24/7 Support",
      ],
      color: "from-indigo-500 to-violet-500",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <CodeIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive web development and security solutions tailored to
            your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`inline-flex p-3 bg-gradient-to-br ${service.color} rounded-xl mb-6`}
                >
                  <div className="text-white">{service.icon}</div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Learn More Link */}
                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 mt-6 text-sm font-medium bg-gradient-to-r ${service.color} bg-clip-text text-transparent hover:gap-3 transition-all duration-300`}
                >
                  Discuss Project
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

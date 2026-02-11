"use client";

import { useRouter } from "next/navigation";
import { Code, Bot, Globe, ShieldCheck, Plus } from "lucide-react";
import Button from "@/app/components/Button";

const services = [
  {
    id: "web-development",
    name: "Web Application Development",
    description:
      "Custom web applications using Next.js or MERN stack with modern best practices.",
    icon: <Code size={24} />,
    startingPrice: 1200,
  },
  {
    id: "wordpress-design",
    name: "WordPress Design & Customization",
    description:
      "Custom WordPress themes and site designs tailored to your needs.",
    icon: <Globe size={24} />,
    startingPrice: 500,
  },
  {
    id: "wordpress-security",
    name: "WordPress Security",
    description: "Security audits, malware removal, and WordPress hardening.",
    icon: <ShieldCheck size={24} />,
    startingPrice: 400,
  },
  {
    id: "web-automation",
    name: "Web Automation & Bots",
    description: "Custom automation scripts and web bots for repetitive tasks.",
    icon: <Bot size={24} />,
    startingPrice: 600,
  },
];

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div className="fade-in space-y-8 md:space-y-12">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs text-(--text-subtle)">Engineering Catalog</p>
        <p className="text-xl md:text-2xl font-semibold">
          Available <span className="font-medium">Services</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-(--border-color) border border-(--border-color)">
        {services.map((service) => (
          <div
            key={service.id}
            className="group p-4 md:p-6 bg-(--surface) hover:bg-(--subtle) transition-all duration-300 flex flex-col justify-between min-h-72 md:min-h-72"
          >
            <div className="space-y-3">
              <div className="text-(--text-subtle) group-hover:text-(--text-main) transition-colors">
                {service.icon}
              </div>
              <p className="text-lg font-semibold">{service.name}</p>
              <p className="text-sm text-(--text-muted) line-clamp-2">
                {service.description}
              </p>
            </div>

            <div className="pt-4 flex justify-between items-end border-t border-(--border-color)/50">
              <div className="space-y-0.5">
                <p className="text-xs text-(--text-subtle)">Base Rate</p>
                <p className="text-base font-semibold">
                  ${service.startingPrice}
                </p>
              </div>
              <Button
                variant="outlined"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() =>
                  router.push(`/dashboard/services/new?type=${service.id}`)
                }
              >
                Initialize
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

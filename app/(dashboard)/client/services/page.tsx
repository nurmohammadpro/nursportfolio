"use client";

import { useRouter } from "next/navigation";
import { Code, Bot, Globe, ShieldCheck, Plus } from "lucide-react";
import Button from "@/app/components/Button";

const services = [
  {
    id: "web-development",
    name: "Web Application Development",
    description: "High-performance SaaS platforms and custom web ecosystems.",
    icon: <Code size={24} />,
    startingPrice: 1200,
  },
  {
    id: "web-automation",
    name: "Web Automation & Bots",
    description: "Custom workflow automations and intelligent bots.",
    icon: <Bot size={24} />,
    startingPrice: 800,
  },
  {
    id: "wordpress-design",
    name: "Premium WordPress Design",
    description: "Bespoke, high-converting WordPress sites.",
    icon: <Globe size={24} />,
    startingPrice: 600,
  },
  {
    id: "wordpress-security",
    name: "Advanced Security Audit",
    description: "Vulnerability scanning and hardening.",
    icon: <ShieldCheck size={24} />,
    startingPrice: 400,
  },
];

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div className="fade-in space-y-12">
      {/* Header - No Headings */}
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--text-subtle)">
          Engineering Catalog
        </p>
        <p className="text-3xl font-light tracking-tighter">
          Available <span className="font-bold italic">Services.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-(--border-color) border border-(--border-color)">
        {services.map((service) => (
          <div
            key={service.id}
            className="group p-10 bg-(--surface) hover:bg-(--subtle) transition-all duration-500 flex flex-col justify-between h-80"
          >
            <div className="space-y-4">
              <div className="text-(--text-subtle) group-hover:text-(--text-main) transition-colors">
                {service.icon}
              </div>
              <p className="text-xl font-bold tracking-tight group-hover:italic transition-all">
                {service.name}
              </p>
              <p className="text-sm font-medium text-(--text-muted) leading-relaxed line-clamp-2">
                {service.description}
              </p>
            </div>

            <div className="pt-6 flex justify-between items-end border-t border-(--border-color)/50">
              <div className="space-y-0.5">
                <p className="text-[9px] uppercase font-black text-(--text-subtle) tracking-widest">
                  Base Rate
                </p>
                <p className="text-lg font-bold">${service.startingPrice}</p>
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

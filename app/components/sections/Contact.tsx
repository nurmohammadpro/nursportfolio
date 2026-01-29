"use client";

import { useState } from "react";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import { Send, ArrowRight } from "lucide-react";

const serviceOptions = [
  { value: "web-development", label: "Full-Stack SaaS Development" },
  { value: "web-automation", label: "Strategic Web Automation" },
  { value: "wordpress-security", label: "Security & Malware Audit" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
  });

  return (
    <section
      id="contact"
      className="w-full bg-(--surface) py-24 md:py-40 border-t border-(--border-color)"
    >
      <div className="layout-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Left: Heading (Occupies more space for breathing room) */}
          <div className="lg:col-span-7">
            <h2 className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-8 tracking-tighter">
              Start a <br />
              <span className="italic text-(--text-muted)">Conversation.</span>
            </h2>
            <p className="text-xl text-(--text-muted) font-light leading-relaxed max-w-md">
              Reach out to discuss your project architecture, security needs, or
              custom automation goals.
            </p>
          </div>

          {/* Right: The Shrunken, Minimalist Form */}
          <div className="lg:col-span-5 space-y-10 pt-4">
            <div className="space-y-8">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                fullWidth
              />
              <Select
                label="Service Interest"
                options={serviceOptions}
                value={formData.service}
                onChange={(val: string) =>
                  setFormData({ ...formData, service: val })
                }
              />
            </div>

            <div className="pt-6">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight />}
                iconPosition="right"
                fullWidth
                className="h-16 tracking-[0.2em] text-xs"
              >
                Send Request
              </Button>
            </div>

            <p className="text-[10px] text-(--text-subtle) uppercase tracking-widest text-center">
              Response time: Usually within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

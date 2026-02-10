"use client";

import { useState } from "react";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import { Send, ArrowRight } from "lucide-react";

const serviceOptions = [
  { value: "web-development", label: "Web Application Development" },
  { value: "web-automation", label: "Web Automation" },
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
      className="w-full bg-(--surface) py-16 md:py-24 lg:py-40 border-t border-(--border-color)"
    >
      <div className="layout-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-24 items-start">
          {/* Left: Heading (Occupies more space for breathing room) */}
          <div className="lg:col-span-7">
            <h2 className="text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tight mb-6 md:mb-8">
              Let's Build <br />
              <span className="italic text-(--text-muted)">Something</span>{" "}
              Great
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-(--text-muted) font-light leading-relaxed max-w-md">
              Got a project in mind? Let's talk about how I can help bring your
              idea to life.
            </p>
          </div>

          {/* Right: The Shrunken, Minimalist Form */}
          <div className="lg:col-span-5 space-y-8 md:space-y-10 pt-0 lg:pt-4">
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

            <p className="text-xs text-(--text-subtle) uppercase tracking-widest text-center">
              Response time: Usually within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";
import { Send, Mail, Linkedin, CheckCircle2 } from "lucide-react";

const serviceOptions = [
  { value: "web-development", label: "Web Application Development" },
  {
    value: "web-automation-bot-dev",
    label: "Web Automation & Bots",
  },
  {
    value: "wordpress-design-security",
    label: "WordPress Design & Security",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceType: "web-development",
    projectDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate your API call logic
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <section className="w-full bg-(--surface) py-32 flex flex-col items-center text-center fade-in">
        <div className="w-16 h-16 bg-(--subtle) text-(--text-main) rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-5xl mb-4">
          Message <span className="italic text-(--text-muted)">Received</span>
        </h2>
        <p className="text-(--text-muted) max-w-sm mb-10">
          Thanks, {formData.name}! I've got your message and will get back to
          you within 24 hours.
        </p>
        <Button variant="outlined" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="w-full bg-(--surface) py-24 md:py-40 border-t border-(--border-color)"
    >
      <div className="layout-container grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Direct Contact Info */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-7xl leading-tight">
              Let's Build <br />
              <span className="italic text-(--text-muted)">Something</span>
            </h2>
            <p className="text-xl text-(--text-muted) font-light leading-relaxed">
              I'm currently available for new projects. Let's talk about what you
              have in mind.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle)">
              Get In Touch
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:contact@nurmohammad.dev"
                className="flex items-center gap-4 text-lg hover:text-(--brand) transition-colors"
              >
                <Mail size={18} className="text-(--text-subtle)" />
                <span>contact@nurmohammad.dev</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 text-lg hover:text-(--brand) transition-colors"
              >
                <Linkedin size={18} className="text-(--text-subtle)" />
                <span>linkedin.com/in/nurmohammad</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: The Updated Quote Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
              />
              <Input
                label="Your Email"
                type="email"
                value={formData.email}
                onChange={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                fullWidth
              />
            </div>

            <Select
              label="Interested In"
              options={serviceOptions}
              value={formData.serviceType}
              onChange={(e: any) =>
                setFormData({ ...formData, serviceType: e.target.value })
              }
              fullWidth
            />

            <Textarea
              label="Project Brief"
              placeholder="Tell me about your goals, timeline, and vision..."
              value={formData.projectDescription}
              onChange={(e: any) =>
                setFormData({ ...formData, projectDescription: e.target.value })
              }
              rows={5}
              fullWidth
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
                icon={<Send size={18} />}
                iconPosition="right"
              >
                Request Consultation
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

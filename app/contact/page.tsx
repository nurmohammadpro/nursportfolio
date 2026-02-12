"use client";

import { useState } from "react";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import { Send, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const serviceOptions = [
    { value: "web-development", label: "Web Application Development" },
    { value: "wordpress-design", label: "WordPress Design & Customization" },
    { value: "wordpress-security", label: "WordPress Security" },
    { value: "web-automation", label: "Web Automation & Bots" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully. I'll get back to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-(--surface) py-16 md:py-24 lg:py-40">
      <div className="layout-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-24 items-start">
          {/* Left: Header & Info */}
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle) mb-4">
              Get In Touch
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tight mb-6 md:mb-8">
              Let's Build <span className="text-(--text-muted)">Something</span>{" "}
              Great
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-(--text-muted) font-light leading-relaxed max-w-md mb-12">
              Got a project in mind? Let's talk about how I can help bring your
              idea to life.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-(--subtle) rounded-lg">
                  <Mail size={20} className="text-(--text-main)" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:info@nurmohammad.pro"
                    className="text-(--text-main) hover:text-(--brand) transition-colors"
                  >
                    info@nurmohammad.pro
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-(--subtle) rounded-lg">
                  <Phone size={20} className="text-(--text-main)" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+8801234567890"
                    className="text-(--text-main) hover:text-(--brand) transition-colors"
                  >
                    +880 123 456 7890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-(--subtle) rounded-lg">
                  <MapPin size={20} className="text-(--text-main)" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-1">
                    Location
                  </p>
                  <p className="text-(--text-main)">Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-5">
            <div className="p-6 md:p-8 bg-(--subtle) rounded-xl border border-(--border-color)">
              <h2 className="text-xl font-semibold mb-6">Send a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  fullWidth
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  fullWidth
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, phone: e.target.value })
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
                  required
                />

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-(--surface) border border-(--border-color) rounded-lg text-(--text-main) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand) transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Status Messages */}
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 mt-0.5"
                    />
                    <p className="text-sm font-medium">{submitStatus.message}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={<Send />}
                  iconPosition="right"
                  fullWidth
                  disabled={isSubmitting}
                  className="h-14 tracking-[0.2em] text-xs"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-xs text-(--text-subtle) uppercase tracking-widest text-center">
                  Response time: Usually within 24 hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

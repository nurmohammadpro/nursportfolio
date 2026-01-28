// @/app/components/QuoteForm.tsx
"use client";

import { useState } from "react";
import { ServiceType, InquiryData } from "@/app/lib/agency-types";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";

const serviceOptions: { value: ServiceType; label: string }[] = [
  { value: "web-development", label: "Web Application Development" },
  { value: "web-automation", label: "Web Automation & Bots" },
  { value: "wordpress-design", label: "WordPress Design & Development" },
  { value: "wordpress-security", label: "WordPress Security Audit" },
  { value: "seo", label: "Search Engine Optimization (SEO)" },
  { value: "digital-marketing", label: "Digital Marketing Services" },
];

export default function QuoteForm() {
  const [formData, setFormData] = useState<InquiryData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "web-development",
    projectDescription: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = "Project description is required";
    } else if (formData.projectDescription.length < 20) {
      newErrors.projectDescription =
        "Please provide more details (at least 20 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again.",
        );
      }

      setMessage({
        type: "success",
        text:
          data.message ||
          "Thank you! Your inquiry has been submitted successfully. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        serviceType: "web-development",
        projectDescription: "",
        budget: "",
      });
      setErrors({});
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err.message || "Failed to submit inquiry. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Get a Free Quote
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your project, and we'll get back to you within 24 hours.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Input
            label="Full Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <Input
            label="Email Address *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            variant="outlined"
            helperText="Optional - include country code"
          />
          <Input
            label="Company Name"
            name="company"
            value={formData.company}
            onChange={handleChange}
            variant="outlined"
            helperText="Optional"
          />
        </div>

        <Select
          label="Service Type *"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          options={serviceOptions}
          variant="filled"
          fullWidth
          required
        />

        <Textarea
          label="Project Description *"
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleChange}
          rows={5}
          variant="outlined"
          error={!!errors.projectDescription}
          helperText={
            errors.projectDescription ||
            "Please describe your project goals, requirements, and timeline..."
          }
          required
          resize="vertical"
        />

        <Input
          label="Estimated Budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          variant="filled"
          helperText="e.g., $5,000 - $10,000 (Optional)"
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="lg"
            disabled={loading}
            loading={loading}
            className="h-14 text-lg"
          >
            {loading ? "Submitting..." : "Submit Inquiry"}
          </Button>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            By submitting this form, you agree to our{" "}
            <a
              href="/privacy"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Privacy Policy
            </a>
            . We respect your privacy and will never share your information.
          </p>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-blue-600 dark:text-blue-400 font-semibold">
              24-Hour Response
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Quick turnaround
            </div>
          </div>
          <div>
            <div className="text-blue-600 dark:text-blue-400 font-semibold">
              Free Consultation
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              No obligation
            </div>
          </div>
          <div>
            <div className="text-blue-600 dark:text-blue-400 font-semibold">
              Expert Advice
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tailored solutions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

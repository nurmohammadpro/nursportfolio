"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Cpu,
  ShieldCheck,
  Layers,
  Terminal,
  Globe,
  Zap,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: string;
  icon?: string;
  description?: string;
  technologies?: string[];
  order: number;
  isActive: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu size={24} />,
  shield: <ShieldCheck size={24} />,
  layers: <Layers size={24} />,
  terminal: <Terminal size={24} />,
  globe: <Globe size={24} />,
  zap: <Zap size={24} />,
};

const categoryLabels: Record<string, string> = {
  development: "Web Development",
  wordpress: "WordPress",
  security: "Security",
  automation: "Automation",
  other: "Other",
};

const levelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  expert: "bg-purple-100 text-purple-800",
};

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "development",
    level: "intermediate",
    icon: "cpu",
    description: "",
    technologies: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchSkills();
  }, [categoryFilter]);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const response = await fetch(
        `/api/admin/skills?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const technologies = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, technologies }),
      });

      if (response.ok) {
        const newSkill = await response.json();
        setSkills([...skills, newSkill]);
        setIsCreating(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create skill");
      }
    } catch (error) {
      console.error("Failed to create skill:", error);
    }
  };

  const handleUpdate = async () => {
    if (!editingSkill) return;

    try {
      const technologies = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await fetch(`/api/admin/skills/${editingSkill._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, technologies }),
      });

      if (response.ok) {
        const updatedSkill = await response.json();
        setSkills(
          skills.map((s) => (s._id === editingSkill._id ? updatedSkill : s))
        );
        setEditingSkill(null);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update skill");
      }
    } catch (error) {
      console.error("Failed to update skill:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSkills(skills.filter((s) => s._id !== id));
        if (editingSkill?._id === id) {
          setEditingSkill(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const handleToggleActive = async (skill: Skill) => {
    try {
      const response = await fetch(`/api/admin/skills/${skill._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !skill.isActive }),
      });

      if (response.ok) {
        setSkills(
          skills.map((s) =>
            s._id === skill._id ? { ...s, isActive: !s.isActive } : s
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle skill:", error);
    }
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || "cpu",
      description: skill.description || "",
      technologies: skill.technologies?.join(", ") || "",
      order: skill.order,
      isActive: skill.isActive,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "development",
      level: "intermediate",
      icon: "cpu",
      description: "",
      technologies: "",
      order: 0,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6 md:space-y-10 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xl md:text-2xl font-semibold">
            Skills <span className="font-medium">Manager</span>
          </p>
          <p className="text-sm text-(--text-subtle)">
            Manage your skills and expertise areas
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            resetForm();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-(--brand) text-white rounded-lg hover:bg-(--brand-hover) transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Skill
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand)"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
        >
          <option value="all">All Categories</option>
          <option value="development">Web Development</option>
          <option value="wordpress">WordPress</option>
          <option value="security">Security</option>
          <option value="automation">Automation</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Create/Edit Form Modal */}
      {(isCreating || editingSkill) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-(--text-main)/20 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-(--surface) rounded-xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {isCreating ? "Create New Skill" : "Edit Skill"}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingSkill(null);
                  resetForm();
                }}
                className="text-(--text-subtle) hover:text-(--text-main) transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                    placeholder="e.g., React, Node.js, WordPress Security"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                  >
                    <option value="development">Web Development</option>
                    <option value="wordpress">WordPress</option>
                    <option value="security">Security</option>
                    <option value="automation">Automation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                    Proficiency Level *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                  >
                    <option value="cpu">Cpu (Development)</option>
                    <option value="globe">Globe (WordPress/Design)</option>
                    <option value="shield">Shield (Security)</option>
                    <option value="zap">Zap (Automation)</option>
                    <option value="layers">Layers (General)</option>
                    <option value="terminal">Terminal (Technical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-(--border-color)"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm text-(--text-main)"
                  >
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand) resize-none"
                  placeholder="Brief description of this skill..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technologies: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={isCreating ? handleCreate : handleUpdate}
                  className="flex items-center gap-2 px-6 py-2 bg-(--brand) text-white rounded-lg hover:bg-(--brand-hover) transition-colors"
                >
                  <Save size={18} />
                  {isCreating ? "Create Skill" : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingSkill(null);
                    resetForm();
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills List */}
      {isLoading ? (
        <div className="text-center py-12 text-(--text-subtle)">
          Loading skills...
        </div>
      ) : skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills
            .filter((skill) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                skill.name.toLowerCase().includes(q) ||
                skill.category.toLowerCase().includes(q) ||
                skill.technologies?.some((t) => t.toLowerCase().includes(q))
              );
            })
            .sort((a, b) => a.order - b.order)
            .map((skill) => (
              <div
                key={skill._id}
                className={cn(
                  "p-4 border rounded-lg transition-all",
                  skill.isActive
                    ? "bg-(--surface) border-(--border-color)"
                    : "bg-(--subtle) border-(--border-color) opacity-60"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-(--brand)">
                      {iconMap[skill.icon || "cpu"]}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-(--text-subtle)">
                        {categoryLabels[skill.category] || skill.category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(skill)}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      skill.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                    title={skill.isActive ? "Active" : "Inactive"}
                  >
                    {skill.isActive ? "✓" : "✗"}
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded",
                      levelColors[skill.level]
                    )}
                  >
                    {levelLabels[skill.level] || skill.level}
                  </span>
                  <span className="text-xs text-(--text-subtle)">
                    Order: {skill.order}
                  </span>
                </div>

                {skill.description && (
                  <p className="text-xs text-(--text-muted) mb-3 line-clamp-2">
                    {skill.description}
                  </p>
                )}

                {skill.technologies && skill.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {skill.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-(--subtle) text-(--text-main) text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {skill.technologies.length > 3 && (
                      <span className="text-xs text-(--text-subtle)">
                        +{skill.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-(--border-color)">
                  <button
                    onClick={() => startEdit(skill)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-(--brand) hover:bg-(--brand)/10 rounded transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-(--secondary) border border-(--border-color) rounded-lg">
          <Cpu className="w-12 h-12 mx-auto text-(--text-subtle) mb-4" />
          <p className="text-(--text-subtle) mb-4">No skills found</p>
          <button
            onClick={() => {
              setIsCreating(true);
              resetForm();
            }}
            className="inline-flex items-center gap-2 text-(--brand) hover:underline"
          >
            <Plus className="w-4 h-4" />
            Create your first skill
          </button>
        </div>
      )}
    </div>
  );
}

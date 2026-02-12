import { Metadata } from "next";
import { ShieldCheck, Zap, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Me | Nur Mohammad",
  description: "Learn more about Nur Mohammad, a web application developer specializing in MERN/Next.js, WordPress Design & Security, and Automation.",
};

export default function AboutPage() {
  const services = [
    {
      title: "Web Development",
      description: "Building custom web applications using Next.js or MERN stack with modern best practices.",
      icon: <Code2 size={28} />,
    },
    {
      title: "WordPress Design",
      description: "Custom WordPress themes and designs tailored to your brand identity and business requirements.",
      icon: <Code2 size={28} />,
    },
    {
      title: "WordPress Security",
      description: "Security audits, malware removal, SSL setup, firewall configuration, and hardening WordPress sites.",
      icon: <ShieldCheck size={28} />,
    },
    {
      title: "Web Automation",
      description: "Custom automation scripts and bots for repetitive tasks, web scraping, and workflow optimization.",
      icon: <Zap size={28} />,
    },
  ];

  return (
    <main className="w-full bg-(--surface) py-16 md:py-24 lg:py-32">
      <div className="layout-container">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16 lg:mb-24">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle) mb-4">
            About Me
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tight mb-6 md:mb-8">
            Building <span className="text-(--text-muted)">Reliable</span> Web
            <br /> Applications.
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-24">
          {/* Left: Personal Story */}
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            <div className="space-y-6 md:space-y-8">
              <p className="text-lg md:text-xl lg:text-2xl text-(--text-main) font-light leading-relaxed">
                I'm{" "}
                <span className="font-medium underline underline-offset-8 decoration-(--border-color)">
                  Nur Mohammad
                </span>
                . I build web applications that work well, look great, and help
                businesses run smoother.
              </p>
              <p className="text-(--text-muted) leading-relaxed font-light text-base md:text-lg">
                I've worked with companies like AREI Group and Duncun
                Immigration to create applications that handle real business
                needs. I focus on writing clean code and making sure everything
                works fast and reliably.
              </p>
              <p className="text-(--text-muted) leading-relaxed font-light text-base md:text-lg">
                My approach combines technical expertise with practical business
                understanding. I don't just write code—I solve problems. Whether
                it's building a custom web application, securing a WordPress site,
                or automating repetitive workflows, I deliver solutions that make
                a real difference.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-8 border-t border-(--border-color)">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-(--text-main)">
                  <ShieldCheck size={20} />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">
                    Security First
                  </span>
                </div>
                <p className="text-sm text-(--text-muted) font-light leading-relaxed">
                  Keeping your applications safe from threats, with secure data
                  handling and protection.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-(--text-main)">
                  <Zap size={20} />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">
                    Smart Automation
                  </span>
                </div>
                <p className="text-sm text-(--text-muted) font-light leading-relaxed">
                  Saving time by automating repetitive tasks and workflows so
                  you can focus on what matters.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Services */}
          <div className="lg:col-span-5 space-y-8">
            <div className="pt-0 lg:pt-4">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle) mb-6">
                Services I Offer
              </p>
              <div className="space-y-4">
                {services.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-(--subtle) rounded-xl border border-(--border-color)"
                  >
                    <div className="flex items-center gap-3 mb-3 text-(--text-main)">
                      {service.icon}
                      <h3 className="text-base font-semibold">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-sm text-(--text-muted) font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

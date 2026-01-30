export default function ClientDashboard() {
  const progressValue = 75;

  return (
    <div className="fade-in">
      <div className="mb-16">
        <h2 className="text-5xl font-heading mb-4">
          Project <span className="italic text-(--text-muted)">Status</span>
        </h2>
        <p className="text-sm uppercase tracking-widest font-bold text-(--text-subtle)">
          Real-time delivery tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 border border-(--border-color) rounded-3xl bg-(--surface)">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle) mb-4">
            Current Phase
          </h4>
          <p className="text-2xl font-heading">
            Backend Architecture & <br /> Security Handshake
          </p>
        </div>

        <div className="p-8 border border-(--border-color) rounded-3xl bg-(--surface)">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle) mb-4">
            Project Type
          </h4>
          <p className="text-2xl font-heading">
            SaaS Real-time <br /> Cloud Ecosystem
          </p>
        </div>
      </div>

      {/* Custom Minimalist Progress */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-(--text-main)">
            Progress to Launch
          </span>
          <span className="text-6xl font-heading leading-none">
            {progressValue}%
          </span>
        </div>
        <div className="w-full bg-(--subtle) h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-(--text-main) h-full transition-all duration-1000 ease-out"
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

"use client";

const Logo = () => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      {/* The Monogram Icon */}
      <div className="w-10 h-10 bg-(--text-main) flex items-center justify-center rounded-sm transition-transform group-hover:rotate-6">
        <span className="text-(--surface) font-heading text-xl font-bold italic">
          N
        </span>
      </div>

      {/* The Text Identity */}
      <div className="flex flex-col">
        <span className="text-lg font-heading leading-tight tracking-tighter text-(--text-main)">
          Nur <span className="italic text-(--text-muted)">Mohammad</span>
        </span>
        <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-(--text-subtle) -mt-0.5">
          Engineering Bureau
        </span>
      </div>
    </div>
  );
};

export default Logo;

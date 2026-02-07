import { toast } from "sonner";

export const showNotify = (title: string, description?: string) => {
  toast.custom((t) => (
    <div className="bg-(--surface) border border-(--border-color) p-4 rounded-md shadow-xl w-87.5 fade-in">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading italic text-lg tracking-tighter leading-none">
          {title}
          <span className="text-(--text-subtle) not-italic">.</span>
        </h3>
        {description && (
          <p className="text-2.5 font-bold uppercase tracking-[0.2em] text-(--text-subtle)">
            {description}
          </p>
        )}
      </div>
    </div>
  ));
};

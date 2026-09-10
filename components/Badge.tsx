const ACCESS_LABEL: Record<string, string> = {
  shore: 'Shore / walk-in',
  boat: 'Boat access',
  tour_required: 'Tour required',
  permit_required: 'Permit required',
  mixed: 'Mixed access',
};

const ACCESS_COLOR: Record<string, string> = {
  shore: 'bg-turquoise/15 text-lagoon-deep',
  boat: 'bg-coral/20 text-coral-deep',
  tour_required: 'bg-sand-deep/25 text-[#6B5228]',
  permit_required: 'bg-lagoon-deep/15 text-lagoon-deep',
  mixed: 'bg-ink/10 text-ink',
};

export function AccessBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
        ACCESS_COLOR[type] ?? 'bg-ink/10 text-ink'
      }`}
    >
      {ACCESS_LABEL[type] ?? type}
    </span>
  );
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'Beginner-friendly',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function DifficultyBadge({ level }: { level: string | null }) {
  if (!level) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-ink/15 px-2.5 py-1 text-xs font-bold text-ink/70">
      {DIFFICULTY_LABEL[level] ?? level}
    </span>
  );
}

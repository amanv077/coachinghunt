export function ProfileCompletenessBar({ completeness }) {
  const { score, missing } = completeness;

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">Profile completeness</p>
        <p className="text-sm font-bold text-secondary">{score}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary-light">
        <div
          className="h-full rounded-full bg-secondary transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      {missing?.length > 0 && (
        <p className="mt-3 text-xs text-muted">
          Next: {missing.slice(0, 3).join(" · ")}
        </p>
      )}
    </div>
  );
}

interface CategoryHeaderProps {
  label: string;
  count: number;
}

export default function CategoryHeader({ label, count }: CategoryHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="font-semibold text-lg">{label}</h2>
      <span className="text-sm text-muted-foreground">({count})</span>
    </div>
  );
}

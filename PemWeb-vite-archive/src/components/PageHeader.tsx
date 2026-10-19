type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </header>
  );
}
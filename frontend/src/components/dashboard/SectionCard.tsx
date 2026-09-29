import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({ title, action, children, className = '' }: SectionCardProps) {
  return (
    <section className={`rounded-xl border border-border-subtle bg-background-card ${className}`}>
      <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
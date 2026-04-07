import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 py-4 text-[13px] text-gray-400">
      <Link href="/" className="transition-colors hover:text-[#E8692A]">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-[#E8692A]">{item.label}</Link>
          ) : (
            <span className="font-medium text-gray-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

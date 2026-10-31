import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcon";

export function Footer() {
  const { footer } = siteConfig;

  return (
    <footer className="border-t border-border bg-background py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <BrandIcon className="w-6 h-6" />
          <span className="font-semibold text-sm text-foreground">{siteConfig.name}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted">
          {footer.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted">{footer.copyright}</p>
      </div>
    </footer>
  );
}

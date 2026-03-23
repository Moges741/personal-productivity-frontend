import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";
const links = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Documentation", "Help Center", "Privacy", "Terms"],
};

export function Footer() {
  return (
    <footer
      className="relative border-t px-6 py-16"
      style={{ borderColor: "rgba(99,102,241,0.1)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center group">
  <div className="relative h-10 w-36 shrink-0 overflow-hidden">
    <Image
      src="/images/logo1.png"
      alt="Evolve"
      fill
      className="object-contain scale-[2.0] object-center"
      priority
    />
  </div>
</Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Become the strongest version of yourself. One day at a time.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {category}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(99,102,241,0.08)" }}
        >
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} All in One. Built with ❤️ by<Link href="https://dev-moges.me" className="hover:underline hover:text-foreground"> Moges</Link>.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Discipline · Growth · Mastery
          </p>
        </div>
      </div>
    </footer>
  );
}
import Link from "next/link";
import { Sparkles } from "lucide-react";

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
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 16px rgba(99,102,241,0.3)",
                }}
              >
                <Sparkles size={16} className="text-white" />
              </div>
              <span
                className="text-xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Evolve
              </span>
            </div>
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
            © {new Date().getFullYear()} Evolve. Built for people who refuse to settle.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Discipline · Growth · Mastery
          </p>
        </div>
      </div>
    </footer>
  );
}
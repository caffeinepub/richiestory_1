import { Link } from "@tanstack/react-router";
import { SiInstagram, SiTelegram, SiVk } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="beige-bg border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/assets/generated/bunny-logo-transparent.dim_80x80.png"
                alt="RichieStory"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-extrabold text-lg">
                <span className="text-primary">Richie</span>
                <span className="text-foreground">Story</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Collectible pets with a digital soul. Every one is unique.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Catalog", to: "/catalog" },
                { label: "Auction", to: "/auction" },
                { label: "Collectors", to: "/collectors" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Legal</h4>
            <ul className="space-y-2">
              {["Terms of Use", "Privacy Policy", "Marketplace Rules"].map(
                (l) => (
                  <li key={l}>
                    <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                      {l}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">
              Follow us
            </h4>
            <div className="flex gap-3">
              <a
                href="https://t.me/richiestory"
                className="p-2 rounded-full bg-card border border-border hover:bg-primary/20 transition-colors"
                aria-label="Telegram"
              >
                <SiTelegram className="w-4 h-4 text-muted-foreground" />
              </a>
              <a
                href="https://instagram.com/richiestory"
                className="p-2 rounded-full bg-card border border-border hover:bg-primary/20 transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="w-4 h-4 text-muted-foreground" />
              </a>
              <a
                href="https://vk.com/richiestory"
                className="p-2 rounded-full bg-card border border-border hover:bg-primary/20 transition-colors"
                aria-label="VK"
              >
                <SiVk className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {year} RichieStory. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

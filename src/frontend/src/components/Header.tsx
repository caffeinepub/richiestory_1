import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Menu, Settings, User, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { AuthModal } from "./AuthModal";

const navLinks = [
  { label: "Catalog", to: "/catalog" },
  { label: "Auction", to: "/auction" },
  { label: "Collectors", to: "/collectors" },
];

export function Header() {
  const { login, clear, identity } = useInternetIdentity();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const isLoggedIn = !!identity;

  const openAuth = () => setAuthModalOpen(true);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm shadow-xs">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <img
            src="/assets/generated/bunny-logo-transparent.dim_80x80.png"
            alt="RichieStory"
            className="w-9 h-9 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="font-extrabold text-xl">
            <span className="text-primary">Richie</span>
            <span className="text-foreground">Story</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              to="/admin"
              className={`text-sm font-semibold transition-colors hover:text-primary flex items-center gap-1 ${
                location.pathname === "/admin"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              data-ocid="nav.link"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 font-semibold"
                  data-ocid="nav.link"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clear()}
                className="rounded-full gap-2 font-semibold text-muted-foreground"
                data-ocid="nav.link"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={openAuth}
                className="rounded-full font-semibold border-border"
                data-ocid="auth.open_modal_button"
              >
                Sign in
              </Button>
              <Button
                size="sm"
                onClick={openAuth}
                className="rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="auth.open_modal_button"
              >
                Join
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className="text-sm font-semibold text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              to="/admin"
              className="text-sm font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              <Settings className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          )}
          <div className="flex gap-3 pt-2">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full font-semibold"
                    data-ocid="nav.link"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clear();
                    setMobileOpen(false);
                  }}
                  className="rounded-full font-semibold"
                  data-ocid="nav.link"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth();
                  }}
                  className="rounded-full font-semibold"
                  data-ocid="auth.open_modal_button"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth();
                  }}
                  className="rounded-full font-semibold"
                  data-ocid="auth.open_modal_button"
                >
                  Join
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={login}
      />
    </header>
  );
}

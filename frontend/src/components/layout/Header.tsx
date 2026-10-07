import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, UserCircle, LogOut, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { logout } from "../../services/auth";

function Header() {
  const { data: user } = useCurrentUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.full_name || "Compliance Analyst";
  const displayRole = user?.roles?.[0] ? user.roles[0].toUpperCase() : "ANALYST";
  const displayEmail = user?.email || "analyst@bitsentry.local";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-background-card px-6">
      <div>
        <p className="text-sm font-medium text-text-secondary">
          Bitcoin AML Monitoring & Investigation
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          type="button"
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-hover hover:text-brand-teal"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-background-hover focus:outline-none"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal/20 text-xs font-semibold text-brand-teal">
              {initials || <UserCircle size={20} />}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-text-primary">{displayName}</p>
              <p className="text-xs text-text-muted">{displayEmail}</p>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border-subtle bg-background-card p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="border-b border-border-subtle px-3 py-2.5">
                <p className="text-sm font-semibold text-text-primary">{displayName}</p>
                <p className="text-xs text-text-secondary truncate">{displayEmail}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand-teal/10 px-2 py-0.5 text-[11px] font-medium text-brand-teal">
                    <ShieldCheck size={12} />
                    {displayRole}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-primary transition-colors hover:bg-background-hover"
                >
                  <SettingsIcon size={16} className="text-text-secondary" />
                  <span>Settings & Profile</span>
                </Link>
              </div>

              <div className="border-t border-border-subtle pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-risk-critical transition-colors hover:bg-risk-critical/10"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

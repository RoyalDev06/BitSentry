import { Bell, UserCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-background-card px-6">
      <div>
        <p className="text-sm text-text-secondary">
          Bitcoin Transaction Monitoring
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

        <div className="flex items-center gap-2">
          <UserCircle size={30} className="text-text-secondary" />

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary">AML Analyst</p>

            <p className="text-xs text-text-secondary">Compliance Team</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

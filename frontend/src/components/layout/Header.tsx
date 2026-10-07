import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  UserCircle,
  LogOut,
  Settings as SettingsIcon,
  ShieldCheck,
  CheckCheck,
  TriangleAlert,
  FolderSearch,
  Activity,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { logout } from "../../services/auth";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "alert" | "case" | "system";
  unread: boolean;
  link: string;
}

export default function Header() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Critical Risk Alert",
      message: "High-value whale transaction (1.49 BTC) detected",
      time: "10m ago",
      type: "alert",
      unread: true,
      link: "/alerts",
    },
    {
      id: "2",
      title: "Case Assignment",
      message: "Assigned to Case #1: Mixer deposit investigation",
      time: "35m ago",
      type: "case",
      unread: true,
      link: "/cases",
    },
    {
      id: "3",
      title: "Block Ingested",
      message: "Block #840,103 processed into transaction ledger",
      time: "2h ago",
      type: "system",
      unread: false,
      link: "/transactions",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    setIsNotifOpen(false);
    navigate(item.link);
  };

  const displayName = user?.full_name || "Lead Compliance Analyst";
  const displayRole = user?.roles?.[0] ? user.roles[0].toUpperCase() : "ANALYST";
  const displayEmail = user?.email || "admin@bitsentry.local";

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

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotifOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-hover hover:text-brand-teal focus:outline-none"
            aria-label="Notifications"
            aria-expanded={isNotifOpen}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border-subtle bg-background-card shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-brand-teal/15 px-2 py-0.5 text-[10px] font-semibold text-brand-teal">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-brand-teal transition-colors"
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-muted">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors hover:bg-background-hover ${
                        n.unread ? "bg-brand-teal/5" : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === "alert" && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-risk-critical/15 text-risk-critical">
                            <TriangleAlert size={14} />
                          </div>
                        )}
                        {n.type === "case" && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                            <FolderSearch size={14} />
                          </div>
                        )}
                        {n.type === "system" && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                            <Activity size={14} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={`text-xs font-medium truncate ${
                              n.unread
                                ? "text-text-primary font-semibold"
                                : "text-text-secondary"
                            }`}
                          >
                            {n.title}
                          </p>
                          <span className="text-[10px] text-text-muted shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-text-secondary line-clamp-2">
                          {n.message}
                        </p>
                      </div>

                      {n.unread && (
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-teal shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="border-t border-border-subtle p-2 text-center bg-background">
                <Link
                  to="/alerts"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-medium text-brand-teal hover:underline"
                >
                  View all alerts & monitoring activity →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-background-hover focus:outline-none"
            aria-expanded={isProfileOpen}
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

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border-subtle bg-background-card p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
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
                  onClick={() => setIsProfileOpen(false)}
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
                    setIsProfileOpen(false);
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

import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Bell,
  LogOut,
  CheckCircle2,
  X,
  Lock,
  Loader2,
} from "lucide-react";
import { logout } from "../../services/auth";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useTheme } from "../../hooks/useTheme";

type NotificationSettings = {
  criticalAlerts: boolean;
  highRiskAlerts: boolean;
  caseUpdates: boolean;
};

const PREFS_KEY = "bitsentry-user-preferences";

function getInitialPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    language: "English",
    timezone: "EAT",
    notifications: {
      criticalAlerts: true,
      highRiskAlerts: true,
      caseUpdates: true,
    },
  };
}

export default function Settings() {
  const { data: user } = useCurrentUser();
  const { theme, setTheme } = useTheme();

  const savedPrefs = getInitialPreferences();

  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState(savedPrefs.language || "English");
  const [timezone, setTimezone] = useState(savedPrefs.timezone || "EAT");
  const [notifications, setNotifications] = useState<NotificationSettings>(
    savedPrefs.notifications || {
      criticalAlerts: true,
      highRiskAlerts: true,
      caseUpdates: true,
    }
  );

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync with real authenticated user when loaded
  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    } else if (!fullName) {
      setFullName("Lead Compliance Analyst");
    }
  }, [user?.full_name]);

  const handleSave = () => {
    setIsSaving(true);
    setSaved(false);

    // Save preferences locally
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({
        fullName,
        language,
        timezone,
        notifications,
      })
    );

    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 400);
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const displayEmail = user?.email || "admin@bitsentry.local";
  const displayRole = user?.roles?.[0] ? user.roles[0].toUpperCase() : "ANALYST";
  const isActive = user?.is_active !== false;

  return (
    <>
      <div className="space-y-6">
        {/* Page Header - Unified across all pages */}
        <header>
          <h1 className="text-2xl font-semibold text-text-primary">
            Settings
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your account, security, and application preferences.
          </p>
        </header>

        {/* My Profile */}
        <section className="rounded-xl border border-border-subtle bg-background-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border-subtle p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
              <User size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-text-primary">
                My Profile
              </h2>

              <p className="text-xs text-text-secondary">
                Manage your personal information and preferences.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {/* Personal Information */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Personal Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="full-name"
                    className="mb-1.5 block text-xs font-medium text-text-secondary"
                  >
                    Full Name
                  </label>

                  <input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-medium text-text-secondary"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={displayEmail}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-border-subtle bg-background-hover px-3 py-2 text-sm text-text-secondary"
                  />

                  <p className="mt-1 text-[11px] text-text-muted">
                    Email is managed by your account authentication.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Role
                  </label>

                  <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary">
                    <Shield size={15} className="text-brand-teal" />
                    <span>{displayRole}</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Account Status
                  </label>

                  <div className={`flex items-center gap-2 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm ${isActive ? "text-emerald-400" : "text-amber-400"
                    }`}>
                    <CheckCircle2 size={15} />
                    <span>{isActive ? "Active & Verified" : "Pending"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="border-t border-border-subtle pt-6">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Preferences
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="language"
                    className="mb-1.5 block text-xs font-medium text-text-secondary"
                  >
                    Language
                  </label>

                  <select
                    id="language"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
                  >
                    <option value="English">English</option>
                    <option value="Swahili">Swahili</option>
                    <option value="French">French</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="timezone"
                    className="mb-1.5 block text-xs font-medium text-text-secondary"
                  >
                    Time Zone
                  </label>

                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
                  >
                    <option value="EAT">East Africa Time (EAT, UTC+3)</option>
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                    <option value="EST">Eastern Standard Time (EST, UTC-5)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="border-t border-border-subtle pt-6">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Appearance
              </h3>

              <div>
                <label className="mb-2 block text-xs font-medium text-text-secondary">
                  Theme
                </label>

                <div className="flex w-fit rounded-lg border border-border-subtle bg-background p-1">
                  {(["light", "dark", "system"] as const).map((option) => {
                    const isActiveTheme = theme === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTheme(option)}
                        className={`rounded-md px-4 py-2 text-xs font-medium capitalize transition ${isActiveTheme
                            ? "bg-brand-teal/15 text-brand-teal font-semibold shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                          }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end border-t border-border-subtle pt-6">
              {saved && (
                <span className="mr-4 flex items-center gap-1.5 text-xs font-medium text-emerald-400 animate-in fade-in">
                  <CheckCircle2 size={14} />
                  Changes saved successfully
                </span>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-border-subtle bg-background-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border-subtle p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
              <Bell size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Notifications
              </h2>

              <p className="text-xs text-text-secondary">
                Choose which events you want to be notified about.
              </p>
            </div>
          </div>

          <div className="divide-y divide-border-subtle">
            <NotificationToggle
              title="Critical Alerts"
              description="Get notified when a critical-risk alert is created."
              enabled={notifications.criticalAlerts}
              onToggle={() => toggleNotification("criticalAlerts")}
            />

            <NotificationToggle
              title="High-Risk Alerts"
              description="Get notified when a high-risk alert requires attention."
              enabled={notifications.highRiskAlerts}
              onToggle={() => toggleNotification("highRiskAlerts")}
            />

            <NotificationToggle
              title="Case Updates"
              description="Get notified when a case is created or updated."
              enabled={notifications.caseUpdates}
              onToggle={() => toggleNotification("caseUpdates")}
            />
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl border border-border-subtle bg-background-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border-subtle p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
              <Shield size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Security & Sessions
              </h2>

              <p className="text-xs text-text-secondary">
                Manage your password and current session.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            {/* Change Password */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Password
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Change your account password.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-primary transition hover:bg-background-hover"
              >
                <Lock size={14} />
                Change Password
              </button>
            </div>

            {/* Sign Out */}
            <div className="border-t border-border-subtle pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Current Session
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    Sign out of your current BitSentry session.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-lg bg-risk-critical/10 px-3 py-2 text-xs font-medium text-risk-critical transition hover:bg-risk-critical/20"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}

type NotificationToggleProps = {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

function NotificationToggle({
  title,
  description,
  enabled,
  onToggle,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between gap-6 p-6">
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="mt-1 text-xs text-text-secondary">{description}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-brand-teal" : "bg-background-hover"
          }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"
            }`}
        />
      </button>
    </div>
  );
}

type ChangePasswordModalProps = {
  onClose: () => void;
};

function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    // Connect to the backend password-change endpoint when available.
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border-subtle bg-background-card shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border-subtle p-5">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Change Password
            </h2>

            <p className="mt-1 text-xs text-text-secondary">
              Update your BitSentry account password.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close change password dialog"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background-hover hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="current-password"
              className="mb-1.5 block text-xs font-medium text-text-secondary"
            >
              Current Password
            </label>

            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-xs font-medium text-text-secondary"
            >
              New Password
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-xs font-medium text-text-secondary"
            >
              Confirm New Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-risk-critical/10 px-3 py-2 text-xs text-risk-critical">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-border-subtle pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-medium text-text-primary transition hover:bg-background-hover"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-brand-teal px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

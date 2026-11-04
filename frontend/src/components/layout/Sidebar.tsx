import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  TriangleAlert,
  ArrowLeftRight,
  Hash,
  Wallet,
  FolderSearch,
  History,
  Users,
  X,
} from "lucide-react";
import BitSentryLogo from "../ui/BitSentryLogo";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Alerts",
    path: "/alerts",
    icon: TriangleAlert,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Addresses",
    path: "/addresses",
    icon: Hash,
  },
  {
    name: "Monitored Wallets",
    path: "/wallets",
    icon: Wallet,
  },
  {
    name: "Cases",
    path: "/cases",
    icon: FolderSearch,
  },
  {
    name: "Audit Trail",
    path: "/audit",
    icon: History,
  },
  {
    name: "User Management",
    path: "/users",
    icon: Users,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-overlay-background lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-subtle bg-background-card transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-start justify-between border-b border-border-subtle p-5">
          <div className="flex items-center gap-3">
            <BitSentryLogo className="h-8 w-8 shrink-0" />
            <div>
              <h1 className="text-lg font-bold text-brand-orange leading-tight">
                BitSentry
              </h1>
              <p className="text-[11px] text-text-secondary">
                AML Investigation Platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-text-secondary hover:bg-background-hover hover:text-text-primary lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                    ? "bg-brand-teal/10 text-brand-teal"
                    : "text-text-secondary hover:bg-background-hover hover:text-text-primary"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border-subtle p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-teal" />
            <p className="text-xs text-text-secondary">BitSentry AML v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

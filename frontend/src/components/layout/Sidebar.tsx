import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  TriangleAlert,
  ArrowLeftRight,
  Wallet,
  FolderSearch,
  Settings,
  X,
} from "lucide-react";

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
    icon: Wallet,
  },
  {
    name: "Cases",
    path: "/cases",
    icon: FolderSearch,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-subtle bg-background-card transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-border-subtle p-6">
          <div>
            <h1 className="text-xl font-bold text-brand-orange">BitSentry</h1>

            <p className="mt-1 text-xs text-text-secondary">
              AML Investigation Platform
            </p>
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
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
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
          <p className="text-xs text-text-secondary">BitSentry AML</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

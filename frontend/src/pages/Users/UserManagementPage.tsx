import { useEffect, useState, useMemo } from 'react';
import { Users, Plus, Search, X, Loader2, CheckCircle2, UserCheck } from 'lucide-react';
import { getUsers, createUser } from '../../services/users';
import type { PlatformUser } from '../../types/users';
import StateView from '../../components/dashboard/StateView';

export default function UserManagementPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'analyst'>('analyst');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.full_name.toLowerCase().includes(q) ||
        u.roles.some((r) => r.toLowerCase().includes(q))
    );
  }, [users, search]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const created = await createUser({
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        password,
        role,
      });
      setUsers((prev) => [...prev, created]);
      setFormSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setEmail('');
        setFullName('');
        setPassword('');
        setRole('analyst');
        setFormSuccess(false);
      }, 1000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <header>
          <h1 className="text-2xl font-semibold text-text-primary">
            User Administration
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage compliance investigators, administrators, and system access privileges.
          </p>
        </header>

        <button
          type="button"
          onClick={() => {
            setFormError('');
            setFormSuccess(false);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="w-full rounded-lg border border-border-subtle bg-background-card py-2.5 pl-9 pr-4 text-sm text-text-primary outline-none focus:border-brand-teal"
          />
        </div>
      </div>

      {isLoading || isError ? (
        <div className="rounded-xl border border-border-subtle bg-background-card p-6">
          <StateView isLoading={isLoading} isError={isError} onRetry={fetchUsers} />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-background-card px-6 py-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-text-muted" />
          <p className="text-base font-medium text-text-primary">No users found</p>
          <p className="mt-1 text-sm text-text-secondary">
            Try adjusting your search query or add a new team member.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle bg-background-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-subtle bg-background/50 text-xs uppercase text-text-muted">
              <tr>
                <th className="py-3 px-4 font-medium">Full Name</th>
                <th className="py-3 px-4 font-medium">Email Address</th>
                <th className="py-3 px-4 font-medium">Assigned Role</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-background-hover">
                  <td className="py-3.5 px-4 font-medium text-text-primary flex items-center gap-2">
                    <UserCheck size={16} className="text-brand-teal shrink-0" />
                    <span>{u.full_name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-text-secondary">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                            r === 'admin'
                              ? 'bg-brand-orange/10 text-brand-orange'
                              : 'bg-brand-teal/10 text-brand-teal'
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.is_active
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          u.is_active ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      />
                      {u.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border-subtle bg-background-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <h2 className="text-base font-semibold text-text-primary">Add Platform User</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-text-secondary hover:bg-background-hover hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 p-5">
              {formSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs font-medium text-emerald-400">
                  <CheckCircle2 size={16} />
                  User created successfully!
                </div>
              )}

              {formError && (
                <div className="rounded-lg bg-risk-critical/10 p-3 text-xs text-risk-critical">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane.doe@bitsentry.local"
                  className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Initial Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Role Authorization *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'analyst')}
                  className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
                >
                  <option value="analyst">Analyst (Investigations & Monitoring)</option>
                  <option value="admin">Admin (Full System & User Control)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-border-subtle pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-medium text-text-primary hover:bg-background-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || formSuccess}
                  className="flex items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-black hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Signup form submitted:", {
      fullName,
      email,
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-orange">
            BitSentry
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Anti-Money Laundering Monitoring Platform
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-xl border border-border-subtle bg-background-card p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Create an account
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Create your BitSentry analyst account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-border-subtle bg-input-background px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border-subtle bg-input-background px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-border-subtle bg-input-background px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-border-subtle bg-input-background px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Create account
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-orange hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;


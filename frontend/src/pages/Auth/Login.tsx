import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      const result = await login({
        email,
        password,
      });

      localStorage.setItem("access_token", result.access_token);
      navigate("/dashboard");
      
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-orange">
            BitSentry
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Anti-Money Laundering Monitoring Platform
          </p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-background-card p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Sign in
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Sign in to your BitSentry account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </div>
            )}

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
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border-subtle bg-input-background px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-brand-orange hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
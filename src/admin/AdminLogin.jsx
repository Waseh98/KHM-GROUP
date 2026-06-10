import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isFirebaseConfigured,
  signInWithGoogle as firebaseGoogleSignIn,
} from "../lib/firebase";
import { apiRequest } from "../utils/api";
import { setAdminAuth } from "./adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const canSubmit = email.trim() !== "" && password.trim() !== "" && !loading;

  const initialError =
    new URLSearchParams(window.location.search).get("reason") ===
    "token_expired"
      ? "Your session has expired. Please login again."
      : "";
  const [error, setError] = useState(initialError);

  async function handleOauthAdminCheck(firebaseUser) {
    if (!firebaseUser) return;
    setOauthLoading(true);
    setError("");
    try {
      const idToken = await firebaseUser.getIdToken();
      const data = await apiRequest("/api/auth/admin-oauth", {
        method: "POST",
        auth: false,
        body: { token: idToken },
      });
      if (!data?.token || !data?.user) throw new Error("Admin check failed");
      setAdminAuth({ token: data.token, user: data.user });
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "This email is not registered as admin");
    } finally {
      setOauthLoading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        auth: false,
        body: { email: email.trim(), password },
      });
      if (!data?.token || !data?.user)
        throw new Error("Login response missing token");
      if (data.user.role !== "admin")
        throw new Error("This account is not admin");
      setAdminAuth({
        token: data.token,
        user: { ...data.user, role: "admin" },
      });
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (!isFirebaseConfigured) {
      setError("Firebase is not configured");
      return;
    }
    setOauthLoading(true);
    setError("");
    const { user: firebaseUser, error: googleError } =
      await firebaseGoogleSignIn();
    if (googleError) {
      setError(googleError.message);
      setOauthLoading(false);
      return;
    }
    await handleOauthAdminCheck(firebaseUser);
  }

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)",
  };

  const cardStyle = {
    maxWidth: 460,
    width: "100%",
    background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
    padding: "clamp(28px, 5vw, 48px)",
    borderRadius: 24,
    border: "1px solid rgba(212,175,42,0.2)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(212,175,42,0.05)",
    position: "relative",
    overflow: "hidden",
  };

  const oauthBtn = {
    width: "100%",
    padding: "14px 20px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "var(--font-body)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    transition: "all 0.3s ease",
    color: "#fff",
    letterSpacing: "0.02em",
  };

  const dividerStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
    color: "#555",
    fontSize: 12,
  };

  const dividerLine = {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.08)",
  };

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,175,42,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,175,42,0.1) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            textAlign: "center",
            marginBottom: 28,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d4af5a 0%, #a08040 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              marginBottom: 16,
              boxShadow: "0 8px 30px rgba(212,175,42,0.3)",
            }}
          >
            🔐
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(24px, 5vw, 32px)",
              margin: 0,
              fontWeight: 900,
              background: "linear-gradient(135deg, #fff 0%, #d4af5a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin Login
          </h1>
          <p style={{ color: "#666", marginTop: 8, fontSize: 14 }}>
            Sign in to manage your store
          </p>
        </div>

        {error && (
          <div
            style={{
              border: "1px solid rgba(255,100,100,0.4)",
              background: "rgba(255,100,100,0.1)",
              color: "#ff6b6b",
              padding: "12px 16px",
              borderRadius: 12,
              marginBottom: 20,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {isFirebaseConfigured && (
          <>
            <button
              style={oauthBtn}
              onClick={handleGoogleLogin}
              disabled={oauthLoading}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,175,42,0.4)";
                e.currentTarget.style.background = "rgba(212,175,42,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              {oauthLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <div style={dividerStyle}>
              <span style={dividerLine} />
              <span>or sign in with email</span>
              <span style={dividerLine} />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 20 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 10,
                color: "#888",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="username"
              placeholder="admin@khm.ae"
              style={{
                width: "100%",
                padding: 16,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)",
                color: "#fff",
                fontSize: 15,
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 10,
                color: "#888",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: 16,
                  paddingRight: 50,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)",
                  color: "#fff",
                  fontSize: 15,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                {showPass ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            style={{
              width: "100%",
              padding: "16px 24px",
              background:
                canSubmit && !loading
                  ? "linear-gradient(135deg, #d4af5a 0%, #a08040 100%)"
                  : "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderRadius: 14,
              border: "none",
              cursor: canSubmit && !loading ? "pointer" : "not-allowed",
              boxShadow:
                canSubmit && !loading
                  ? "0 8px 25px rgba(212,175,90,0.3)"
                  : "none",
              transition: "all 0.3s ease",
              marginTop: 8,
            }}
          >
            {loading ? "⏳ Signing in..." : "🔓 Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}

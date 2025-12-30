import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Checkbox, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      message.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending login request:", { email });
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response);

      if (response.token) {
        // Store token in localStorage
        localStorage.setItem("zeno_token", response.token);
        console.log("Token stored");

        // Store user info
        if (response.user) {
          console.log("User info:", response.user);
          localStorage.setItem("zeno_user", JSON.stringify(response.user));
        }

        // Create and store mock organization (TODO: Get from backend)
        const mockOrg = {
          id: response.user.organization_id,
          name: `Organization ${response.user.organization_id}`,
          branches: [
            { id: 1, name: "Main Branch" },
            { id: 2, name: "Downtown" },
            { id: 3, name: "Airport" },
          ],
        };
        localStorage.setItem("zeno_organization", JSON.stringify(mockOrg));
        localStorage.setItem(
          "zeno_currentBranch",
          JSON.stringify(mockOrg.branches[0])
        );
        console.log("Organization stored, navigating to dashboard");

        message.success("Login successful!");
        navigate("/dashboard");
      } else {
        console.error("No token in response:", response);
        message.error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Form */}
      <div style={styles.leftSide}>
        <div style={styles.formWrapper}>
          {/* Logo */}
          <div style={styles.logoArea}>
            <div style={styles.logoPlaceholder}>
              <p style={styles.logoPlaceholderText}>Your Logo Here</p>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 style={styles.welcomeTitle}>WELCOME</h1>
          <p style={styles.subtitle}>Sign in to your account</p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <UserOutlined style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <LockOutlined style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeInvisibleOutlined
                      style={{ color: "#FFC42A", fontSize: "16px" }}
                    />
                  ) : (
                    <EyeOutlined
                      style={{ color: "#FFC42A", fontSize: "16px" }}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={styles.optionsRow}>
              <label style={styles.rememberLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                <span style={styles.rememberText}>Remember me</span>
              </label>
              <a href="#" style={styles.forgotLink}>
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" style={styles.loginButton} disabled={loading}>
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>

          {/* Footer */}
          <p style={styles.footer}>© 2025 ZenoOptSpot. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div style={styles.rightSide}>
        <div style={styles.illustrationArea}></div>
      </div>

      {/* Decorative Curve */}
      <div style={styles.curve}></div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    overflow: "auto",
    background: "#00523f",
  },
  leftSide: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    background: "#00523f",
    padding: "60px 40px",
    overflow: "visible",
    minHeight: "100vh",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "420px",
    margin: "20px auto",
  },
  logoArea: {
    marginBottom: "20px",
    textAlign: "center",
  },
  logoCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#00523f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    boxShadow: "0 4px 15px rgba(0, 82, 63, 0.3)",
  },
  logoText: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#ffffff",
  },
  logoPlaceholder: {
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    background: "rgba(255, 196, 42, 0.15)",
    border: "2px dashed #FFC42A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  logoPlaceholderText: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#FFC42A",
    margin: "0",
    textAlign: "center",
    letterSpacing: "0.5px",
  },
  welcomeTitle: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#ffffff",
    letterSpacing: "2px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#ccebe5",
    margin: "0 0 20px 0",
    fontWeight: "500",
  },
  form: {
    marginBottom: "16px",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "0",
    color: "#FFC42A",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "12px 0 12px 24px",
    border: "none",
    borderBottom: "2px solid #FFC42A",
    borderRadius: "0",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    outline: "none",
    background: "transparent",
    color: "#ffffff",
  },
  eyeButton: {
    position: "absolute",
    right: "0",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    fontSize: "12px",
    color: "#ffffff",
  },
  rememberLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "6px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#FFC42A",
  },
  rememberText: {
    color: "#ccebe5",
    fontWeight: "500",
  },
  forgotLink: {
    color: "#FFC42A",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s",
  },
  loginButton: {
    width: "100%",
    padding: "12px",
    background: "#FFC42A",
    color: "#00523f",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(255, 196, 42, 0.3)",
    marginBottom: "12px",
  },
  demoBox: {
    background: "rgba(255, 196, 42, 0.15)",
    border: "1px solid #FFC42A",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "12px",
  },
  demoTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#FFC42A",
    margin: "0 0 6px 0",
  },
  demoCredential: {
    fontSize: "11px",
    color: "#ccebe5",
    margin: "2px 0",
    fontFamily: "monospace",
  },
  footer: {
    fontSize: "11px",
    color: "#99d4c8",
    textAlign: "center",
    margin: "0",
    paddingBottom: "10px",
  },
  rightSide: {
    flex: 1,
    background: "#00523f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  illustrationArea: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContent: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "20px",
  },
  userIcon: {
    fontSize: "80px",
    opacity: 0.3,
  },
  lampIcon: {
    fontSize: "60px",
    position: "absolute",
    top: "20%",
    right: "15%",
    opacity: 0.4,
  },
  personIllustration: {
    position: "relative",
    width: "120px",
    height: "140px",
  },
  personBody: {
    position: "absolute",
    bottom: "0",
    width: "80px",
    height: "80px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    left: "20px",
  },
  personHead: {
    position: "absolute",
    top: "-20px",
    left: "45px",
    width: "60px",
    height: "60px",
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
  },
  decorCircle1: {
    position: "absolute",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    top: "-50px",
    left: "-50px",
  },
  decorCircle2: {
    position: "absolute",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.08)",
    bottom: "20%",
    right: "10%",
  },
  curve: {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "200px",
    height: "200px",
    background: "#fbbf24",
    borderRadius: "200px 0 0 0",
    zIndex: 5,
  },
};

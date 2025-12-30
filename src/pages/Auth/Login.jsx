import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || "Invalid email or password");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>ZenoOptSpot Login</h2>

        {error && <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>}

        <input
          style={styles.input}
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          style={styles.input}
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;

const styles = {
  page: {
    height: "100vh",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#0f172a",
    padding: 36,
    borderRadius: 12,
    width: 340,
    color: "white",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #1e293b",
    background: "#020617",
    color: "white",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#059669",
    border: "none",
    borderRadius: 6,
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
};

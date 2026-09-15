import { useState } from "react";

const API_URL = "http://localhost:5000";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("Username and password are required.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "Login failed."
                );
            }

            localStorage.setItem(
                "fraudshield_token",
                result.token
            );

            localStorage.setItem(
                "fraudshield_user",
                JSON.stringify(result.user)
            );

            if (onLogin) {
                onLogin(result);
            }

        } catch (err) {
            setError(
                err.message ||
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <h1>FraudShield-X</h1>
                    <p>
                        AI-Powered Fraud Detection
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        placeholder="Enter username"
                        autoComplete="username"
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter password"
                        autoComplete="current-password"
                    />

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;
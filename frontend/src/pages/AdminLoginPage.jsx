import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { FiCoffee, FiEye, FiEyeOff, FiLock } from "react-icons/fi";

import { authApi } from "./api";
import "./admin.css";

export function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const navigate = useNavigate();
    const lcoation = useLocation();

    async function submit(e) {
        e.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            return setError("Enter both Username and Password.");
        }

        setBusy(true);
        try {
            await authApi.login(username.trim(), password);
            const next = location.state?.from?.pathname;
            navigate(next && next !== "/admin/login" ? next : "/admin", { replace: true });
        } catch (err) {
            setError(err.status === 401 ? "Username or Password Incorrect." : err.message || "Unable to Login. Try Again.")
        } finally {
            setBusy(false);
        }
    }

    return (
    <main className="login-page">
        <section className="login-story">
            <a className="brand" href="/">
                <span className="brand-icon"><FiCoffee />
                </span><span>Code-n-Coffee</span>
            </a>
            <div className="story-copy">
                <span className="eyebrow">THE ADMIN WORKSPACE</span>
                <h1>Good coffee starts with good people.</h1>
                <p>
                    Manage your products, keep inventory in check, 
                    and bring Nepalese coffee closer to every cup.
                </p>
            </div>
            <small className="story-footer">From farm to cup, with care.</small>
        </section>

        <section className="login-panel">
            <div className="login-form">
                <div className="mobile-brand brand">
                    <span className="brand-icon"><FiCoffee /></span>
                    Code-n-Coffee
                </div>

                <span className="eyebrow">WELCOME BACK</span>
                <h2>Admin sign in</h2>
                <p className="muted mb-4">
                    Use your administrator credentials to continue.
                </p>

                {error && <Alert variant="danger" role="alert">{error}</Alert>}

                <Form onSubmit={submit}>
                    <Form.Group className="mb-3" controlId="adminUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            autoFocus 
                            autoComplete="username" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            maxLength={99} 
                            placeholder="Enter your username" 
                            disabled={busy} 
                            required />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="adminPassword">
                        <Form.Label>Password</Form.Label>
                        <div className="password-wrap">
                            <Form.Control 
                                type={show ? "text" : "password"} 
                                autoComplete="current-password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                placeholder="Enter your password" 
                                disabled={busy} required />
                            
                            <button 
                                type="button" 
                                className="password-toggle" 
                                onClick={() => setShow(v => !v)} 
                                aria-label={show ? "Hide password" : "Show password"}>
                                    {show ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </Form.Group>

                    <Button 
                        className="coffee-button w-100" 
                        type="submit" 
                        disabled={busy}>
                            {busy 
                                ? <><Spinner size="sm" className="me-2" />Signing in…</> 
                                : <><FiLock className="me-2" />Sign in securely</>}
                    </Button>
                </Form>

                <p className="security-note">
                        Restricted to authorized administrators. 
                        Contact the site owner if you need access.
                </p>
            </div>
        </section>
    </main>
    )
}


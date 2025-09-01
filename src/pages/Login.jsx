import "./Login.css";
import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

export default function LoginPage() {
    const nav = useNavigate();
    const [form, setForm] = useState({email: "", password: ""});
    const [error, setError] = useState("");

    const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            localStorage.setItem("token", data.token);
            nav("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (<div className="auth-wrapper">
        <div className="auth-card">
            <h2>Login</h2>
            {error && <p className="auth-error">{error}</p>}

            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "18px"}}>
                <input
                    name="email"
                    type="email"
                    placeholder="E-Mail"
                    value={form.email}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Passwort"
                    value={form.password}
                    onChange={handleChange}
                />
                <button type="submit">Einloggen</button>
            </form>

            <p className="switch-link">
                Noch kein Konto? <Link to="/register">Registrieren</Link>
            </p>
        </div>
    </div>);
}
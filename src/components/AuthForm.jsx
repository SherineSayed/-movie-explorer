import { useState } from "react";
import { useApp } from "../context/AppContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Pure function: given form mode + values, return an { field: message } map.
// Kept outside the component since it doesn't need any component state.
function validate(mode, values) {
  const errors = {};

  if (mode === "register" && values.name.trim().length < 2) {
    errors.name = "Enter your full name (at least 2 characters).";
  }
  if (!values.email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (mode === "register" && values.confirm !== values.password) {
    errors.confirm = "Passwords do not match.";
  }
  return errors;
}

export default function AuthForm({ onSuccess }) {
  const { login, register } = useApp();

  // useState: form mode + controlled field values + validation/UI state
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  // Arrow function event handler — controlled form pattern
  const handleChange = (field) => (e) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (touched[field]) {
      setErrors(validate(mode, next));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(mode, values));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setTouched({});
    setFormError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // React event: prevent full page reload on submit
    const validationErrors = validate(mode, values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, password: true, confirm: true });
    setFormError("");

    if (Object.keys(validationErrors).length > 0) return;

    try {
      if (mode === "register") {
        register({ name: values.name.trim(), email: values.email.trim(), password: values.password });
        setSuccess("Account created! Redirecting…");
      } else {
        login({ email: values.email.trim(), password: values.password });
        setSuccess("Welcome back! Redirecting…");
      }
      setTimeout(() => onSuccess && onSuccess(), 600);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const fieldClass = (field) => `${errors[field] && touched[field] ? "invalid" : ""}`;

  return (
    <section className="section auth-wrap">
      <div className="container" style={{ padding: 0 }}>
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>
              Log in
            </button>
            <button className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>
              Register
            </button>
          </div>

          {success && <div className="auth-success">{success}</div>}
          {formError && (
            <div className="auth-success" style={{ background: "rgba(228,87,76,0.12)", borderColor: "var(--red)", color: "var(--red)" }}>
              {formError}
            </div>
          )}

          {/* Controlled form: every input's value + onChange is wired to state */}
          <form onSubmit={handleSubmit} noValidate>
            {mode === "register" && (
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  className={fieldClass("name")}
                  value={values.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  placeholder="Jane Doe"
                />
                {errors.name && touched.name && <div className="field-error">{errors.name}</div>}
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={fieldClass("email")}
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="jane@example.com"
              />
              {errors.email && touched.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={fieldClass("password")}
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="At least 6 characters"
              />
              {errors.password && touched.password && <div className="field-error">{errors.password}</div>}
            </div>

            {mode === "register" && (
              <div className="field">
                <label htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  type="password"
                  className={fieldClass("confirm")}
                  value={values.confirm}
                  onChange={handleChange("confirm")}
                  onBlur={handleBlur("confirm")}
                  placeholder="Repeat your password"
                />
                {errors.confirm && touched.confirm && <div className="field-error">{errors.confirm}</div>}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block">
              {mode === "register" ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button onClick={() => switchMode("register")}>Create an account</button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => switchMode("login")}>Log in</button>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { isAuthenticated } from "../../services/auth";
import { getRoles } from "../../services/roles";
import { register } from "../../services/auth";

export default function AdminNewEmployee() {
  const [roles, setRoles] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [role_id, setRoleId] = useState(6); // Default is trainee
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [hourly_pay, setHourlyPay] = useState("");
  const [started_at, setStartedAt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tokenConfig = isAuthenticated();
    const body = {
      role_id,
      first_name,
      last_name,
      email,
      phone,
      password,
      hourly_pay,
      started_at,
    };

    const res = await register(body, tokenConfig);
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      setError("");
      setRoleId(6);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setHourlyPay("");
      setStartedAt("");
      setSuccess(true);
      setIsSubmitting(false);
    }
  };

  const renderEmployeeForm = () => (
    <form
      onSubmit={handleSubmit}
      className="xs10-offset-1 s10-offset-1 l6-offset-3"
    >
      <div className="my-2">
        <p>First Name</p>
        <input
          type="text"
          value={first_name}
          className="form-input"
          onChange={({ target }) => setFirstName(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Last Name</p>
        <input
          type="text"
          value={last_name}
          className="form-input"
          onChange={({ target }) => setLastName(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Email</p>
        <input
          type="email"
          value={email}
          className="form-input"
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Phone</p>
        <input
          type="text"
          value={phone}
          className="form-input"
          onChange={({ target }) => setPhone(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Password</p>
        <input
          type="password"
          value={password}
          className="form-input"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Hourly Pay</p>
        <input
          type="text"
          value={hourly_pay}
          className="form-input"
          onChange={({ target }) => setHourlyPay(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Starting Date</p>
        <input
          type="date"
          value={started_at}
          className="form-input"
          onChange={({ target }) => setStartedAt(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Role</p>
        <select
          value={role_id}
          onChange={({ target }) => setRoleId(parseInt(target.value))}
        >
          {roles &&
            roles.map((role, i) => (
              <option key={i} value={role.role_id}>
                {role.title}
              </option>
            ))}
        </select>
      </div>
      <div className="text-center mt-5">
        <button
          className={`btn-med ${!isSubmitting && "btn-hovered"}`}
          disabled={isSubmitting}
        >
          Submit
        </button>
      </div>
      {error && <p className="red mt-3">{error}</p>}
      {success && <p className="green mt-3">Profile successfully added!</p>}
    </form>
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const roles = await getRoles();
      if (roles && isMounted) setRoles(roles);
    }

    fetchData();

    return () => (isMounted = false);
  }, []);

  return (
    <div className="grid">
      <div className="xs10-offset-1 s10-offset-1 l6-offset-3">
        <Link to={ROUTES.ADMIN_EMPLOYEES} className="text-no-u black pointer">
          <i className="fas fa-arrow-left"></i> Back
        </Link>
      </div>
      {renderEmployeeForm()}
    </div>
  );
}

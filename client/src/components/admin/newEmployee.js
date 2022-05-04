import { useEffect, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { isAuthenticated } from "../../services/auth";
import { getRoles } from "../../services/roles";
import { register } from "../../services/auth";

const initialState = {
  role_id: 6,
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  hourly_pay: "",
  started_at: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setValue":
      return { ...state, [action.field]: action.value };
    case "reset":
      return initialState;
    default:
      return initialState;
  }
};

export default function AdminNewEmployee() {
  const [roles, setRoles] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tokenConfig = isAuthenticated();

    const res = await register(state, tokenConfig);
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      setError("");
      dispatch({ type: "reset" });
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
          value={state.first_name}
          className="form-input"
          onChange={({ target }) =>
            dispatch({
              type: "setValue",
              field: "first_name",
              value: target.value,
            })
          }
        />
      </div>
      <div className="my-2">
        <p>Last Name</p>
        <input
          type="text"
          value={state.last_name}
          className="form-input"
          onChange={({ target }) =>
            dispatch({
              type: "setValue",
              field: "last_name",
              value: target.value,
            })
          }
        />
      </div>
      <div className="my-2">
        <p>Email</p>
        <input
          type="email"
          value={state.email}
          className="form-input"
          onChange={({ target }) =>
            dispatch({ type: "setValue", field: "email", value: target.value })
          }
        />
      </div>
      <div className="my-2">
        <p>Phone</p>
        <input
          type="text"
          value={state.phone}
          className="form-input"
          onChange={({ target }) =>
            dispatch({ type: "setValue", field: "phone", value: target.value })
          }
        />
      </div>
      <div className="my-2">
        <p>Password</p>
        <input
          type="password"
          value={state.password}
          className="form-input"
          onChange={({ target }) =>
            dispatch({
              type: "setValue",
              field: "password",
              value: target.value,
            })
          }
        />
      </div>
      <div className="my-2">
        <p>Hourly Pay</p>
        <input
          type="text"
          value={state.hourly_pay}
          className="form-input"
          onChange={({ target }) =>
            dispatch({
              type: "setValue",
              field: "hourly_pay",
              value: target.value,
            })
          }
        />
      </div>
      <div className="my-2">
        <p>Starting Date</p>
        <input
          type="date"
          value={state.started_at}
          className="form-input"
          onChange={({ target }) =>
            dispatch({
              type: "setValue",
              field: "started_at",
              value: target.value,
            })
          }
        />
      </div>
      <div className="my-2">
        <p>Role</p>
        <select
          value={state.role_id}
          onChange={({ target }) =>
            dispatch({
              type: "setValue",
              field: "role_id",
              value: parseInt(target.value),
            })
          }
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
      if (isMounted) setRoles(roles);
    }

    fetchData();

    return () => (isMounted = false);
  }, []);

  return (
    <div className="grid mt-2">
      <div className="xs10-offset-1 s10-offset-1 l6-offset-3">
        <Link to={ROUTES.ADMIN_EMPLOYEES} className="text-no-u black pointer">
          <i className="fas fa-arrow-left"></i> Back
        </Link>
      </div>
      {renderEmployeeForm()}
    </div>
  );
}

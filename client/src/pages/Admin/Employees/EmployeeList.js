import React from "react";

export const EmployeeList = ({
  users,
  width,
  handleAddEmployee,
  handleClickUser,
}) => {
  return (
    <div>
      <div className="mt-6 mb-4 flex flex-center">
        <button className="btn-x-lg btn-hovered" onClick={handleAddEmployee}>
          <p>Add Employee</p>
        </button>
      </div>
      <div>
        <table className="users-list border-collapse w-100 text-center">
          <thead>
            <tr>
              <th className="p-3 border-solid-1">Role</th>
              <th className="p-3 border-solid-1">Name</th>
              <th className="p-3 border-solid-1">Email</th>
              <th className="p-3 border-solid-1">Phone</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, i) => (
                <tr
                  key={i}
                  className="pointer"
                  onClick={() => handleClickUser(user.u_id)}
                  style={
                    i % 2 === 0
                      ? { backgroundColor: "rgb(240, 240, 240)" }
                      : { backgroundColor: "rbg(255, 255, 255)" }
                  }
                >
                  <td className="p-3">{width < 380 ? user.acn : user.title}</td>
                  <td className="p-3">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

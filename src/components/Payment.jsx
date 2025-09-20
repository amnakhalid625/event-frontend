import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Component mount hone par user ko localStorage se nikaalo
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Agar user na ho to login pe bhejo
    }
  }, [navigate]);

  // ✅ Logout handler
  const handleLogOut = () => {
    localStorage.removeItem("token"); // JWT token hatao
    localStorage.removeItem("user");  // User data hatao
    navigate("/login");
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Hello {user.name}</h1>
          <p>{user.email}</p>
          <button onClick={handleLogOut}>Logout</button>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
};

export default Payment;

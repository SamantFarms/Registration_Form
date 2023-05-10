import React, { useState } from "react";
import Home from "./Home";
import Registration from "./Registration";

export default function Login() {
  const [home, sethome] = useState(true);
  const [registration, setRegistration] = useState(true);

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticated , setAuthenticated] = useState("")

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "mobileNumber") {
      setMobileNumber(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  function handleRegi(event) {
    event.preventDefault();
    setRegistration(!registration);
  }

  function handleLogin(event) {
    event.preventDefault();
  
    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobileNumber: mobileNumber,
        password: password
      })
    })
    .then(response => {
      if (response.ok) {
        // Store the access token in local storage
        localStorage.setItem("access_token", response.access_token);
        setAuthenticated(true);
        sethome(!home)
        // Redirect to the dashboard or protected route
      } 
      else if (response.status === 401){
alert("Invalid Mobile Number or Password")
      }
      
      else {
        throw new Error("Authentication failed");
      }
    })
    .catch(error => {
      console.error("Error while logging in:", error);
      setError("An error occurred while logging in");
  });
  }

  return (
    <div>
      {registration ? (
        <div>
          {home ? (
            <form action="">
              <h1>Login</h1>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="mobileNumber"
                  value={mobileNumber}
                  placeholder="Enter Mobile Number"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter Password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-dark btn-lg my-3"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                type="submit"
                className="btn btn-dark btn-lg mx-3"
                onClick={handleRegi}
              >
                Register
              </button>
            </form>
          ) : (
            <Home mobileNumber={mobileNumber} />
          )}
        </div>
      ) : (
        <Registration />
      )}
    </div>
  );
}

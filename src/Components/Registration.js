import React, { useRef, useState } from "react";
import Login from "./Login";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: "XX",
  secretAccessKey: "XX",
  region: "ap-south-1",
});

const initialState = {
  created_by: "",
  created_date: "",
  updated_by: "",
  updated_date: "",
  firstName: "",
  lastName: "",
  mobileNumber: "",
  password: "",
};

export default function Registration() {
  const [state, setState] = useState(initialState);
  const {
    created_by,
    created_date,
    updated_by,
    updated_date,
    firstName,
    lastName,
    mobileNumber,
    password,
  } = state;
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [login, setLogin] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  function handleFileChange(event) {
    setProfilePicture(event.target.files[0]);
  }

  function handleInputChange(e) {
    const date = new Date();
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
      created_by: firstName,
      created_date: date.toUTCString(),
      updated_by: firstName,
      updated_date: date.toUTCString(),
    });
  }

  const passwordRef = useRef(null);
  function handleClick1() {
    const password = passwordRef.current;
  }

  const confirmPasswordRef = useRef(null);
  function handleClick2() {
    const confirmPassword = confirmPasswordRef.current;
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleClick1();
    handleClick2();

    if (profilePicture) {
      const params = {
        Bucket: "equip9-testing",
        Key: profilePicture.name,
        Body: profilePicture,
        ACL: "public-read",
      };

      s3.upload(params, function (err, data) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("File uploaded successfully:", data.Location);
      });
    }

    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !password ||
      !confirmPassword
    ) {
      alert("Some fields are empty, Please fill all the fields");
    } 
    else if (mobileNumber.length !== 10) {
      alert ("Invalid Mobile Number, Please Enter 10 digit Mobile Number")
    }
    else if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    } else {
      axios
        .post("http://localhost:5000/api/post", {
          created_by,
          created_date,
          updated_by,
          updated_date,
          firstName,
          lastName,
          mobileNumber,
          password,
        })
        .then(() => {
          
          setState(initialState);
        })
        .catch((err) => console.error(err.response.data));
      alert("You are Successfully Registered");
      setLogin(!login);
    }
  }

  function handleSubmit2() {
    setLogin(!login);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div>
      {login ? (
        <form >
          <h1>Register Here</h1>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              className="form-control"
              placeholder="Enter First Name"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              className="form-control"
              placeholder="Enter Last Name"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={mobileNumber}
              className="form-control"
              placeholder="Enter Mobile Number"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              ref={passwordRef}
              id="password"
              name="password"
              value={password}
              required
              className="form-control"
              placeholder="Enter Password"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              ref={confirmPasswordRef}
              id="confirm-password"
              name="confirm-password"
              required
              className="form-control"
              placeholder="Enter Password Again"
              onChange={handleConfirmPasswordChange}
            />
            <label>
              <input
                type="checkbox"
                id="checkbox-id"
                checked={showPassword}
                onChange={handleShowPassword}
              />{" "}
              Show password
            </label>
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" className="form-control" onChange={handleFileChange} />
          </div>
          <button
            type="submit"
            className="btn btn-dark btn-lg my-3"
            onClick={handleSubmit}
          >
            Submit
          </button>
          {imageUrl && <img src={imageUrl} alt="Uploaded" />}
          <button className="btn btn-dark btn-lg mx-3" onClick={handleSubmit2}>
            Already Registered ? Log In
          </button>
        </form>
      ) : (
        <Login />
      )}
    </div>
  );
}

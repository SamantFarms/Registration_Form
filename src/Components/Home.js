import React from "react";
import { useState, useEffect } from "react";

export default function Home(props) {
  const [timeOfDay, setTimeOfDay] = useState("");
  const [userData, setUserData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const mb = props.mobileNumber;

  useEffect(() => {
    fetch("http://localhost:5000/api/get")
      .then((reqData) => reqData.json())
      .then((resData) => {
        setUserData(resData);
        console.log(resData);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const findUser = () => {
      console.log(userData.length);
      console.log(mb);

      for (let i = 0; i < userData.length; i++) {
        if (userData[i].mobileNumber === mb) {
          setFirstName(userData[i].firstName);
          setLastName(userData[i].lastName);
          break;
        }
      }
    };

    if (userData) {
      findUser();
    }
  }, [userData, mb]); 

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setTimeOfDay("morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse logout" id="navbarSupportedContent" >
          <a href="http://localhost:3000/ ">
            <button
              className="btn btn-outline-success my-2 my-sm-0 "
              type="submit"
            >
              Log Out
            </button>
          </a>
        </div>
      </nav>
      <div className="jumbotron">
        <h4 className="display-4">
          Good {timeOfDay} {firstName} {lastName} !
        </h4>
        <h1 className="display-6">Your Contact Number is : {mb} </h1>
      </div>
    </div>
  );
}

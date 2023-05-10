const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kaivalya$99",
  database: "crud_contact",
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kaivalya$99",
  database: "crud_contact",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REST Get API to retrieve the record from the table
app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM contact_db ";
  db.query(sqlGet, (error, result) => {
    res.send(result);
  });
});

// app.get("/api/get", (req, res) => {
//     const sqlGet = "SELECT firstName FROM contact_db ";
//     db.query(sqlGet, (error, result) => {
//       res.send(result);
//     });
//   });

app.get("/", (req, res) => {
  // const sqlInsert = "INSERT INTO contact_db (created_by, created_date, updated_by, updated_date, firstName , lastName  , mobileNumber, password) VALUES ('Makarand', '2021-12-25 01:59:11' , 'Makarand' , '2021-12-25 01:59:11'  , 'Makarand', 'Samant', 9404598171 , 'Kaivalya$99')";
  // db.query(sqlInsert , (error,result) => {
  // console.log("error" , error);
  // console.log("result", result);
  res.send("Hello Express");
  // });
});

// REST Post API to Create record in the table
app.post("/api/post", (req, res) => {
  const {
    created_by,
    created_date,
    updated_by,
    updated_date,
    firstName,
    lastName,
    mobileNumber,
    password,
  } = req.body;

  

  // Generate a salt for bcrypt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error("Error generating salt:", err);
      return res.status(500).send("An error occurred during registration");
    }

    // Hash the password using bcrypt
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("An error occurred during registration");
      }

      const sqlInsert =
        "INSERT INTO contact_db (created_by, created_date, updated_by, updated_date, firstName , lastName  , mobileNumber, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        sqlInsert,
        [
          created_by,
          created_date,
          updated_by,
          updated_date,
          firstName,
          lastName,
          mobileNumber,
          hashedPassword,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
          }
        }
      );
    });
  });
});

// REST Put API to Update if needed

app.put("/api/contact/:id", (req, res) => {
  const id = req.params.id;
  const {
    updated_by,
    updated_date,
    firstName,
    lastName,
    mobileNumber,
    password,
  } = req.body;
  const sqlUpdate =
    "UPDATE contact_db SET updated_by=?, updated_date=?, firstName=?, lastName=?, mobileNumber=?, password=? WHERE id=?";
  db.query(
    sqlUpdate,
    [updated_by, updated_date, firstName, lastName, mobileNumber, password, id],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send("An error occurred while updating the contact");
      } else {
        res.status(200).send("Contact updated successfully");
      }
    }
  );
});

// REST Delete API for to delete the record

app.delete("/api/contact/:id", (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM contact_db WHERE id=?";
  db.query(sqlDelete, [id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send("An error occurred while deleting the contact");
    } else {
      res.status(200).send("Contact deleted successfully");
    }
  });
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.post("/api/login", (req, res) => {
  const { mobileNumber, password } = req.body;

  // Query the database to find the user based on the mobile number
  connection.query(
    "SELECT * FROM contact_db WHERE mobileNumber = ?",
    [mobileNumber],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        // User not found
        res.status(401).json({ error: "Invalid mobile number or password" });
        return;
      } else {
        console.log("hey man");
        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error("Error while comparing passwords:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }

          if (!result) {
            // Passwords don't match
            
            res
              .status(401)
              .json({ error: "Invalid mobile number or password" });
            return;
          }

          // Passwords match, generate an access token
          else {
            const accessToken = jwt.sign({ userId: user.id }, "secret_key", {
              expiresIn: "1h",
            });

            // Return the access token to the client
            res.json({ accessToken });
          }
        });
      }
    }
  );
});

// connection.query(query, (error, results) => {
//   if (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred while logging in" });
//   } else if (results.length === 0) {
//     // user not found in database
//     res.status(401).json({ error: "Invalid mobile number or password" });
//   } else {
//     // user found in database, check if password matches
//     const user = results[0];
//     if (password !== user.password) {
//       res.status(401).json({ error: "Invalid mobile number or password" });
//     } else {
//       // password matches, generate access token and send back to client
//       const payload = { mobileNumber: user.mobile_number };
//       const secret = "mysecretkey";
//       const options = { expiresIn: "1h" };
//       const token = jwt.sign(payload, secret, options);
//       res.json({ token });
//     }
//   }
// });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

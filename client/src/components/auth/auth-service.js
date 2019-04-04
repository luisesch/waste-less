import axios from "axios";

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  signup = (username, password, email) => {
    return this.service
      .post("/signup", { username, password, email })
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  verify = (userId, code) => {
    return this.service
      .put("/auth/" + userId + "/confirm/" + code)
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  login = (username, password) => {
    return this.service
      .post("/login", { username, password })
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  logout = () => {
    return this.service
      .post("/logout", {})
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  loggedin = () => {
    return this.service
      .get("/loggedin")
      .then(response => response.data)
      .catch(err => console.log(err));
  };
}

export default AuthService;

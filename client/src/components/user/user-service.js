import axios from "axios";

class UserService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  showAll = () => {
    return this.service
      .get("/users")
      .then(response => {
        return response.data;
      })
      .catch(err => console.log(err));
  };
}

export default UserService;

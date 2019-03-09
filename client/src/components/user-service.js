import axios from "axios";

class UserService {
  constructor() {
    let service = axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  showAll = () => {
    return this.service.get("/users").then(response => response.data);
  };
}

export default UserService;

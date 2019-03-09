import axios from "axios";

class LeagueService {
  constructor() {
    let service = axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  create = (name, administrator, members) => {
    return this.service
      .post("/leagues", { name, administrator, members })
      .then(response => response.data);
  };
}

export default LeagueService;

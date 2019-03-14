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

  getLeague = leagueId => {
    return this.service
      .get("/leagues/" + leagueId)
      .then(response => response.data);
  };

  getMembers = leagueId => {
    return this.service
      .post("/members", { leagueId })
      .then(response => response.data);
  };

  deleteMember = (leagueId, memberId) => {
    return this.service
      .post("/deleteMember", { leagueId, memberId })
      .then(response => response.data);
  };

  addMember = (leagueId, userId) => {
    return this.service
      .post("/addMember", { leagueId, userId })
      .then(response => response.data);
  };
}

export default LeagueService;

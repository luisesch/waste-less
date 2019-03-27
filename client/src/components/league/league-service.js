import axios from "axios";

class LeagueService {
  constructor() {
    let service = axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  create = (name, administrator, members, file) => {
    const formData = new FormData();

    formData.append("picture", file);
    formData.append("name", name);
    formData.append("administrator", administrator);
    formData.append("members", members);
    return this.service
      .post("/leagues", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  getLeague = leagueId => {
    return this.service
      .get("/leagues/" + leagueId)
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  enterLeague = (userId, leagueId) => {
    return this.service
      .put("leagues/" + leagueId + "/enterLeague/" + userId)
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  deleteMember = (leagueId, memberId) => {
    return this.service
      .post("/deleteMember", { leagueId, memberId })
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  addMember = (leagueId, userId) => {
    return this.service
      .post("/addMember", { leagueId, userId })
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  getMembers = leagueId => {
    return this.service
      .get("/leagues/" + leagueId + "/members")
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  getExMembers = leagueId => {
    return this.service
      .get("/leagues/" + leagueId + "/exmembers")
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  startLeague = leagueId => {
    return this.service
      .put("/leagues/" + leagueId + "/start")
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  endLeague = leagueId => {
    return this.service
      .put("/leagues/" + leagueId + "/end")
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  getArchive = userId => {
    return this.service
      .get("/archive/" + userId)
      .then(response => response.data)
      .catch(err => console.log(err));
  };
}

export default LeagueService;

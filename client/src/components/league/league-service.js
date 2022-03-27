import axios from "axios";

class LeagueService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://192.168.1.35:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  create = (name, administrator, members, file, duration) => {
    const formData = new FormData();

    formData.append("picture", file);
    formData.append("name", name);
    formData.append("administrator", administrator);
    formData.append("members", JSON.stringify(members));
    formData.append("duration", duration);

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
      .then(response => {
        return response.data;
      })
      .catch(err => console.log(err));
  };

  getExMembers = leagueId => {
    return this.service
      .get("/leagues/" + leagueId + "/exmembers")
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  startLeague = (leagueId, duration) => {
    return this.service
      .put("/leagues/" + leagueId + "/start/" + duration)
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  endLeague = leagueId => {
    return this.service
      .put("/leagues/" + leagueId + "/end")
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  deleteLeague = leagueId => {
    return this.service
      .delete("/leagues/" + leagueId + "/delete")
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  getArchive = userId => {
    return this.service
      .get("/archive/" + userId)
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  addLeaguePicture(file, leagueId) {
    const formData = new FormData();
    formData.append("picture", file);
    return this.service
      .post("/leagues/" + leagueId + "/pictures", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }
}

export default LeagueService;

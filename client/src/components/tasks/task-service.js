import axios from "axios";

class TaskService {
  constructor() {
    let service = axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  taskCompleted = (newScore, user, task) => {
    return this.service
      .post("/user/completeTask", { newScore, user, task })
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  getCompletedTasksLeague = leagueId => {
    return this.service
      .get("/tasks/league/" + leagueId)
      .then(response => {
        return response.data;
      })
      .catch(err => console.log(err));
  };

  getCompletedTasksUser = userId => {
    return this.service
      .get("/tasks/user/" + userId)
      .then(response => {
        return response.data;
      })
      .catch(err => console.log(err));
  };
}

export default TaskService;

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
    // console.log(newScore);
    return this.service
      .post("/user/completeTask", { newScore, user, task })
      .then(response => response.data)
      .catch(err => console.log(err));
  };

  getCompletedTasks = leagueId => {
    return this.service
      .get("/tasks/" + leagueId)
      .then(response => {
        console.log(response);
        return response.data;
      })
      .catch(err => console.log(err));
  };
}

export default TaskService;

import axios from "axios";

class TaskService {
  constructor() {
    let service = axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  updateScore = (newScore, user) => {
    // console.log(newScore);
    return this.service
      .post("/user/score", { newScore, user })
      .then(response => response.data)
      .catch(err => console.log(err));
  };
}

export default TaskService;

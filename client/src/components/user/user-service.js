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
    return this.service
      .get("/users")
      .then(response => {
        return response.data;
      })
      .catch(err => console.log(err));
  };

  addPicture(file, userId) {
    //   console.log(file);
    const formData = new FormData();
    formData.append("picture", file);
    return this.service
      .post("/users/" + userId + "/pictures", formData, {
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

export default UserService;

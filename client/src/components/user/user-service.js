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

  addPicture(file, userId) {
    // console.log(file);
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

  editProfile(userId, attribute, value) {
    return this.service
      .put("/users/" + userId + "/edit/" + attribute + "/" + value)
      .then(res => res.data)
      .catch(err => console.log(err));
  }
}

export default UserService;

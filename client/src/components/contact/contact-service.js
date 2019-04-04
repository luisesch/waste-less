import axios from "axios";

class ContactService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
      withCredentials: true
    });
    this.service = service;
  }

  sendMessage = (name, email, message) => {
    return this.service
      .post("/contact/sendMessage", { name, email, message })
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  };
}

export default ContactService;

import axios from "axios";
import { authHeader } from "./base.service";

const API_URL = "http://localhost:8084/create_order";


class PaymentService {
  initiatePayment(fare) {
    return axios.post(API_URL + "/" + fare);
  }
}

export default new PaymentService();

import axios from "axios";
import { BASE_API_URL } from "../common/Constants";
import { authHeader } from "./base.service";

const API_URL = BASE_API_URL + "/gateway/book";

const SAVE_URL = API_URL + "/createTicket";

class BookingService {
  saveTicket(train, bookingDetails) {
    return axios.post(SAVE_URL + "/" + train.trainNumber, bookingDetails, {
      headers: authHeader(),
    });
  }

  bookedTicket(username) {
    return axios.get(API_URL + "/booked/" + username, {
      headers: authHeader(),
    });
  }

  deleteTicket(pnr) {
    return axios.delete(API_URL + "/cancelTicket/" + pnr, {
      headers: authHeader(),
    });
  }

  viewTicketByPnr(pnr) {
    return axios.get(API_URL + "/" + pnr);
  }
}

export default new BookingService();

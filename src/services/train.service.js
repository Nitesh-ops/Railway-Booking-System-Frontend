import axios from "axios";
import { BASE_API_URL } from "../common/Constants";
import { authHeader } from "./base.service";

const API_URL = BASE_API_URL + "/gateway/rail";

const SAVE_URL = BASE_API_URL + "/gateway/rail/create";

const DELETE_URL = BASE_API_URL + "/gateway/rail/delete";

class TrainService {
  saveTrain(train) {
    return axios.post(SAVE_URL, train, { headers: authHeader() });
  }

  deleteTrain(train) {
    return axios.delete(DELETE_URL + "/" + train.trainNumber, {
      headers: authHeader(),
    });
  }

  getAllTrains() {
    return axios.get(API_URL);
  }

  getBetweenStations(train) {
    return axios.get(
      API_URL +
        "/" +
        train.fromStation +
        "/" +
        train.toStation +
        "/" +
        train.departureDate
    );
  }

  getTrainByTrainNumber(trainNo) {
    return axios.get(API_URL + "/" + trainNo);
  }
}

export default new TrainService();

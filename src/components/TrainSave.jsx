import { Modal } from "react-bootstrap";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import TrainService from "../services/train.service";
import swal from "sweetalert";
import { AiOutlineClose, AiOutlineSave } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";

const TrainSave = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    showTrainModal() {
      setShow(true);
    },
  }));

  useEffect(() => {
    setTrain(props.train);
  }, [props.train]);

  const [train, setTrain] = useState({
    trainNumber: 0,
    trainName: "",
    fromStation: "",
    toStation: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    travelDetails: {
      //travelDetails.coachesClass[0].availableTickets
      coachesClass: [
        {
          availableTickets: 10,
          travelClass: "1A",
          fare: 1400,
        },
        {
          availableTickets: 20,
          travelClass: "2A",
          fare: 1100,
        },
        {
          availableTickets: 50,
          travelClass: "3A",
          fare: 900,
        },
        {
          availableTickets: 20,
          travelClass: "SL",
          fare: 500,
        },
      ],
    },
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [show, setShow] = useState(false);

  const saveTrain = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (train.trainNumber.toString().length !== 5) {
      toast.error("Train Number should be 5 digit", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return "";
    } else if (
      !train.trainName ||
      !train.fromStation ||
      !train.toStation ||
      !train.departureDate ||
      !train.departureTime ||
      !train.arrivalDate ||
      !train.arrivalTime
    ) {
      return "";
    }

    TrainService.saveTrain(train)
      .then((response) => {
        // props.onSaved(response.data)
        setShow(false);
        setSubmitted(false);
        swal("Thank You", "Train Added Sucessfully", "success");
      })
      .catch((err) => {
        setErrorMessage("Unexpected Error Occured");
        console.log(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrain((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleChangeCoaches = (e) => {};

  return (
    <Modal show={show}>
      <form
        onSubmit={(e) => saveTrain(e)}
        noValidate
        className={submitted ? "was-validated" : ""}
      >
        <div className="modal-header">
          <h5 className="modal-title">Train Details</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShow(false)}
          ></button>
        </div>
        <div className="modal-body">
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="form-group">
            <label htmlFor="trainNumber">Train Number</label>
            <input
              type="number"
              name="trainNumber"
              placeholder="Enter Train Number"
              className="form-control"
              required
              value={train.trainNumber}
              onChange={(e) => handleChange(e)}
            />
            <div className="invalid-feedback">Train Number is required</div>
          </div>
          <div className="form-group">
            <label htmlFor="trainName">Train Name</label>
            <input
              type="text"
              name="trainName"
              placeholder="Enter Train Name"
              className="form-control"
              required
              value={train.trainName}
              onChange={(e) => handleChange(e)}
            />
            <div className="invalid-feedback">Train Name is required</div>
          </div>
          <div className="form-group">
            <label htmlFor="fromStation">Origin Station</label>
            <input
              type="text"
              name="fromStation"
              placeholder="Enter Origin Station"
              className="form-control"
              required
              value={train.fromStation}
              onChange={(e) => handleChange(e)}
            />
            <div className="invalid-feedback">Origin Station is required</div>
          </div>
          <div className="form-group">
            <label htmlFor="toStation">Destination Station</label>
            <input
              type="text"
              name="toStation"
              placeholder="Enter Destination Station"
              className="form-control"
              required
              value={train.toStation}
              onChange={(e) => handleChange(e)}
            />
            <div className="invalid-feedback">
              Destination Station is required
            </div>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <label htmlFor="departureDateTime">Departure Date</label>
              <input
                type="date"
                name="departureDate"
                placeholder="departureDate"
                className="form-control"
                required
                value={train.departureDate}
                onChange={(e) => handleChange(e)}
              />
              <div className="invalid-feedback">Departure Date is required</div>
            </div>

            <div className="form-group col-6">
              <label htmlFor="departureTime">Departure Time</label>
              <input
                type="time"
                name="departureTime"
                placeholder="departureTime"
                className="form-control"
                required
                value={train.departureTime}
                onChange={(e) => handleChange(e)}
              />
              <div className="invalid-feedback">Departure Time is required</div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-6">
              <label htmlFor="arrivalDate">Arrival Date</label>
              <input
                type="date"
                name="arrivalDate"
                placeholder="arrivalDate"
                className="form-control"
                required
                value={train.arrivalDate}
                onChange={(e) => handleChange(e)}
              />
              <div className="invalid-feedback">Arrival Date is required</div>
            </div>

            <div className="form-group col-6">
              <label htmlFor="arrivalTime">Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                placeholder="arrivalTime"
                className="form-control"
                required
                value={train.arrivalTime}
                onChange={(e) => handleChange(e)}
              />
              <div className="invalid-feedback">Arrival Time is required</div>
            </div>
          </div>

          <div className="form-group">
            <center>
              <label htmlFor="arrivalDateTime">Coaches Details</label>
            </center>
            <div className="row">
              <label htmlFor="arrivalDateTime">First AC</label>
              <div className="col-4">
                <input
                  type="number"
                  name="availableTickets"
                  className="form-control"
                  placeholder="Available Tickets"
                  required
                  value={train.travelDetails.coachesClass[0].availableTickets}
                  onChange={(e) => handleChangeCoaches(e)}
                />
              </div>
              <div className="col-4">
                <input
                  type="text"
                  name="travelClass"
                  className="form-control"
                  placeholder="Travel Class"
                  required
                  value={train.travelDetails.coachesClass[0].travelClass}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-4">
                <input
                  type="number"
                  name="fare"
                  className="form-control"
                  placeholder="Fare"
                  required
                  value={train.travelDetails.coachesClass[0].fare}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="row">
              <label htmlFor="arrivalDateTime">Second AC</label>
              <div className="col-4">
                <input
                  type="number"
                  name="availableTickets"
                  className="form-control"
                  placeholder="Available Tickets"
                  required
                  value={train.travelDetails.coachesClass[1].availableTickets}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-4">
                <input
                  type="text"
                  name="travelClass"
                  className="form-control"
                  placeholder="Travel Class"
                  required
                  value={train.travelDetails.coachesClass[1].travelClass}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-4">
                <input
                  type="number"
                  name="fare"
                  className="form-control"
                  placeholder="Fare"
                  required
                  value={train.travelDetails.coachesClass[1].fare}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="row">
              <label htmlFor="arrivalDateTime">Third AC</label>
              <div className="col-4">
                <input
                  type="number"
                  name="availableTickets"
                  className="form-control"
                  placeholder="Available Tickets"
                  required
                  value={train.travelDetails.coachesClass[2].availableTickets}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-4">
                <input
                  type="text"
                  name="travelClass"
                  className="form-control"
                  placeholder="Travel Class"
                  required
                  value={train.travelDetails.coachesClass[2].travelClass}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-4">
                <input
                  type="number"
                  name="fare"
                  className="form-control"
                  placeholder="Fare"
                  required
                  value={train.travelDetails.coachesClass[2].fare}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="row">
              <label htmlFor="arrivalDateTime">Sleeper</label>
              <div className="col-4">
                <input
                  type="number"
                  name="availableTickets"
                  className="form-control"
                  placeholder="Available Tickets"
                  required
                  value={train.travelDetails.coachesClass[3].availableTickets}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-4">
                <input
                  type="text"
                  name="travelClass"
                  className="form-control"
                  placeholder="Travel Class"
                  required
                  value={train.travelDetails.coachesClass[3].travelClass}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-4">
                <input
                  type="number"
                  name="fare"
                  className="form-control"
                  placeholder="Fare"
                  required
                  value={train.travelDetails.coachesClass[3].fare}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            <AiOutlineClose /> Close
          </button>
          <button type="submit" className="btn btn-primary">
            <AiOutlineSave /> Save Changes
          </button>
        </div>
      </form>
      <ToastContainer />
    </Modal>
  );
});

export { TrainSave };

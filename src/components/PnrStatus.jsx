import React, { useState } from "react";
import "./PnrStatus.css";
import { Modal, Button } from "react-bootstrap";
import BookingService from "../services/book.service";
import { ToastContainer, toast } from "react-toastify";
import Fade from 'react-reveal/Fade';

function PnrStatus({ show, onHide }) {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pnr, setPnr] = useState(0);
  const [ticket, setTicket] = useState("");

  const handlePnr = (e) => {
    setPnr(e.target.value);
  };

  const checkStatus = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (pnr.toString().length !== 9) {
      toast.error("PNR should be 9 digit", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return "";
    }

    BookingService.viewTicketByPnr(pnr)
      .then((response) => {
        setSubmitted(false);
        console.log(response.data);
        setTicket(response.data);
      })
      .catch((err) => {
        setErrorMessage("Unexpected Error Occured");
        console.log(err);
      });
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Check PNR Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <form
            onSubmit={(e) => checkStatus(e)}
            noValidate
            className={submitted ? "was-validated" : ""}
          >
            <div className="form-group">
              <label htmlFor="PNR No.">PNR Number</label>
              <input
                type="number"
                className="form-control"
                name="pnr"
                placeholder="PNR Number"
                value={pnr}
                onChange={(e) => handlePnr(e)}
                required
              />
              <div className="invalid-feedback">
                <Fade bottom collapse>
                  <div>PNR Number is required.</div>
                </Fade>
              </div>
            </div>
            <br />
            <center>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </center>
          </form>
        </div>
        <div>
          {ticket && (
            <div>
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Train Number</th>
                      <th scope="col">Train Name</th>
                      <th scope="col">Boarding Date</th>
                      <th scope="col">From</th>
                      <th scope="col">To</th>
                      <th scope="col">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">{ticket.requiredTrain.trainNumber}</th>
                      <td>{ticket.requiredTrain.trainName}</td>
                      <td>{ticket.requiredTrain.departureDate}</td>
                      <td>{ticket.requiredTrain.fromStation}</td>
                      <td>{ticket.requiredTrain.toStation}</td>
                      <td>{ticket.bookingDetail.travelClass}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                {/* {ticket.bookingDetail.travellerDetails.map((pass) => {
                  <div className="container" key={pass.name}>
                    <div>Passenger {pass.name}</div>
                    <div>CNF</div>
                  </div>;
                })} */}

                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Sr No.</th>
                      <th scope="col">Booking Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row">Passenger</td>
                      <td>CNF</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
}

export { PnrStatus };

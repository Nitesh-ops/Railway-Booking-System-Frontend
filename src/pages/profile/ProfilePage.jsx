import React, { useEffect, useState } from "react";
import BookingService from "../../services/book.service";
import { useSelector } from "react-redux";
import "./ProfilePage.css";

const ProfilePage = () => {
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentUser = useSelector((state) => state.user);

  const [errorMessage, setErrorMessage] = useState("");

  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    BookingService.bookedTicket(currentUser.username)
      .then((response) => {
        console.log(response.data);
        setTicket(response.data);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Something went wrong");
        setLoading(false);
      });
  }, []);

  const deleteTicket = (item) => {
    let pnr = item.pnr;
    BookingService.deleteTicket(pnr)
      .then((response) => {
        console.log(response.data);
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="card container profileCard" style={{ width: "18rem" }}>
        <img
          className="card-img-top img-fluid profileImg"
          src="https://www.seekpng.com/png/full/356-3562377_personal-user.png"
          alt="Profile Image"
        />
        <div className="card-body text-center">
          <h5 className="card-title ">Name: {currentUser.name}</h5>
          <p className="card-text">Welcome to Book My Train</p>
          <p className="card-text">
            <small className="text-muted">Role: {currentUser.role}</small>
          </p>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h5>
            <div>All Bookings</div>
          </h5>
        </div>
        {loading ? (
          <div className="container">
            {ticket.map((item, pnr) => (
              <div className="card-body" key={pnr}>
                <div className="card">
                  <div className="card-header bg-primary row">
                    <div className="col-6">
                      <h5 style={{ color: "white" }}>
                        {item.requiredTrain.trainNumber} (
                        {item.requiredTrain.trainName})
                      </h5>
                    </div>
                    <div className="col-6">
                      <h5 style={{ color: "white" }} className="text-end pnr">
                        PNR: {item.pnr}
                      </h5>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-title outer-div">
                      <div className="leftDiv">
                        <h5>
                          {item.requiredTrain.departureTime.slice(0, 2)}:
                          {item.requiredTrain.departureTime.slice(3, 5)} |{" "}
                          {item.requiredTrain.fromStation} |{" "}
                          {
                            weekday[
                              new Date(
                                item.requiredTrain.departureDate
                              ).getDay()
                            ]
                          }
                          ,{" "}
                          {new Date(item.requiredTrain.departureDate).getDate()}{" "}
                          {
                            month[
                              new Date(
                                item.requiredTrain.departureDate
                              ).getMonth()
                            ]
                          }
                        </h5>
                      </div>
                      <div className="rightDiv">
                        <h5>
                          {item.requiredTrain.arrivalTime.slice(0, 2)}:
                          {item.requiredTrain.arrivalTime.slice(3, 5)} |{" "}
                          {item.requiredTrain.toStation} |{" "}
                          {
                            weekday[
                              new Date(item.requiredTrain.arrivalDate).getDay()
                            ]
                          }
                          , {new Date(item.requiredTrain.arrivalDate).getDate()}{" "}
                          {
                            month[
                              new Date(
                                item.requiredTrain.arrivalDate
                              ).getMonth()
                            ]
                          }
                        </h5>
                      </div>
                    </div>
                    <div className="card-text">
                      <div className="row ">
                        <div className="col-6">
                          <h5>Passenger Information:</h5>
                          <div>
                            {item.bookingDetail.travellerDetails.map(
                              (passenger, index) => (
                                <div key={index}>
                                  <p>
                                    {index + 1}. {passenger.name}{" "}
                                    {passenger.age} yrs | {passenger.gender}
                                  </p>
                                </div>
                              )
                            )}
                            <h5>Booking Details: </h5>
                            <p>Email ID: {item.bookingDetail.emailId}</p>
                            <p>Address: {item.bookingDetail.address}</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <h6 className="text-end">
                            Boarding Station: {item.requiredTrain.fromStation}
                            <br />
                            <br />
                            <img
                              src="https://www.nicepng.com/png/full/395-3957299_booking-pack-circle.png"
                              alt="bookingConfirmed"
                              width={50}
                              height={50}
                              className="img-fluid"
                            />
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-end">
                    <button
                      className="btn btn-danger me-1"
                      onClick={() => deleteTicket(item)}
                    >
                      Cancel Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ProfilePage };

import { useState, useEffect } from "react";
import "./HomePage.css";
import TrainService from "../../services/train.service";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Statue from "../../images/statue.jpg";
import Typewriter from "typewriter-effect";
import Slider from "../../components/Ads/Slider";
import Bounce from "react-reveal/Bounce";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";

const HomePage = () => {
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

  const [trainList, setTrainList] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [train, setTrain] = useState([]);

  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const trainBetween = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!fromStation || !toStation || !departureDate) {
      return "";
    }

    TrainService.getBetweenStations({
      fromStation: fromStation,
      toStation: toStation,
      departureDate: departureDate,
    })
      .then((response) => {
        setSubmitted(false);
        console.log(response);
        setTrain(response.data);
      })
      .catch((err) => {
        setErrorMessage("Unexpected Error Occured");
        console.log(err);
      });
  };

  const handleFromStation = (e) => {
    setFromStation(e.target.value);
  };

  const handleToStation = (e) => {
    setToStation(e.target.value);
  };

  const handleDepartureDate = (e) => {
    setDepartureDate(e.target.value);
  };

  const handleBook = (book) => {
    if (!currentUser?.id) {
      setErrorMessage(`Redirecting to login page after 3 seconds..`);
      toast.error("Please login to book a ticket!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(function () {
        navigate("/login");
      }, 3000);

      return;
    }
    navigate(`/book/${book.trainNumber}`);
  };

  useEffect(() => {
    TrainService.getAllTrains().then((response) => {
      console.log(response.data);
      setTrainList(response.data);
    });
  }, []);

  const uniqueFromStation = Array.from(
    new Set(
      trainList.map((tr) => {
        return tr.fromStation;
      })
    )
  );

  const uniqueToStation = Array.from(
    new Set(
      trainList.map((tr) => {
        return tr.toStation;
      })
    )
  );

  return (
    <>
      <div className="form-contain">
        <h1>
          <Bounce left cascade>
            TRAIN TICKET BOOKING
          </Bounce>
        </h1>

        <div className="title">
          <Typewriter
            cursorClassName="none"
            onInit={(typewriter) => {
              typewriter
                .typeString("Welcome to Book My Train")
                .pauseFor(1000)
                .deleteAll()
                .typeString("Powered By Prediction & Alternates")
                .callFunction(function (state) {
                  state.elements.cursor.style.display = "none";
                })
                .start();
            }}
          />
        </div>
        <div className="container">
          <form
            onSubmit={(e) => trainBetween(e)}
            noValidate
            className={submitted ? "was-validated" : ""}
          >
            <div className="row">
              {errorMessage && (
                <center>
                  <div className="alert alert-danger">{errorMessage}</div>
                </center>
              )}
              <Zoom left>
                <div className="col-sm">
                  <div className="input-group has-validation">
                    <span
                      className="fa fa-location-arrow icon"
                      id="inputGroupPrepend"
                    ></span>
                    <select
                      name="fromStation"
                      className="form-control"
                      placeholder="Source Station"
                      required
                      defaultValue={""}
                      aria-describedby="inputGroupPrepend"
                      onChange={(e) => handleFromStation(e)}
                    >
                      <option value="" disabled>
                        --Select Source--
                      </option>
                      {uniqueFromStation.map((fromStation) => (
                        <option key={fromStation} value={fromStation}>
                          {" "}
                          {fromStation}
                        </option>
                      ))}
                    </select>

                    <div className="invalid-feedback">
                      <Fade bottom collapse>
                        <div className="errorColor">
                          {" "}
                          Source station is required
                        </div>
                      </Fade>
                    </div>
                  </div>
                </div>

                <div className="col-sm ">
                  <div className="input-group has-validation">
                    <span
                      className="fa fa-map-marker icon"
                      id="inputGroupPrepend"
                    ></span>
                    <select
                      name="toStation"
                      className="form-control"
                      placeholder="Destination Station"
                      required
                      defaultValue={""}
                      aria-describedby="inputGroupPrepend"
                      onChange={(e) => handleToStation(e)}
                    >
                      <option value="" disabled>
                        --Select Destination--
                      </option>
                      {uniqueToStation.map((toStation) => (
                        <option key={toStation} value={toStation}>
                          {" "}
                          {toStation}
                        </option>
                      ))}
                    </select>

                    <div className="invalid-feedback">
                      <Fade bottom collapse>
                        <div className="errorColor">
                          Destination station is required
                        </div>
                      </Fade>
                    </div>
                  </div>
                </div>

                <div className="col-sm ">
                  <div className="input-group has-validation">
                    <span
                      className="fa fa-calendar icon"
                      id="inputGroupPrepend"
                    ></span>
                    <input
                      type="date"
                      name="departureDate"
                      className="form-control"
                      placeholder="MM/DD/YYYY"
                      required
                      value={departureDate}
                      aria-describedby="inputGroupPrepend"
                      onChange={(e) => handleDepartureDate(e)}
                    />
                    <div className="invalid-feedback">
                      <Fade bottom collapse>
                        <div className="errorColor">
                          Travel Date is required
                        </div>
                      </Fade>
                    </div>
                  </div>
                </div>
              </Zoom>
            </div>

            <br />
            <center>
              <button type="submit" className="btn btn-primary butn">
                <AiOutlineSearch /> Search
              </button>
            </center>
            <br />
            <br />
            <br />
            <br />
          </form>
        </div>
      </div>

      <div className="container">
        <marquee
          width="100%"
          direction="left"
          height="20px"
          style={{ color: "red" }}
        >
          Call us toll free on 5678 1234 and 5678 2100 and get a wide range of
          services through SBI Contact Centre | For added security, new
          functionality to maintain per day and per transaction limit for
          general merchant payment transactions has been implemented. Please
          visit Define Limit under profile section. | For booking Forex trades
          with ease, use Fx-Retail. For more information, reach out to your
          Regional Treasury Marketing Unit. | Register yourself for Doorstep
          banking services on 123456789 / 123456789 or log on to bookMyTrain.in
          and avail the services. Stay Home, Stay Safe. | SBI never asks for
          your Card/PIN/OTP/CVV details on phone, message or email. Please do
          not click on links received on your email or mobile asking your
          Bank/Card details.
        </marquee>
        <div className="pt-3 ">
          {/* {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )} */}

          <div className="card">
            <div className="card-header bg-primary">
              <div className="row">
                <div className="col-6">
                  <h5 style={{ color: "white" }}>Available Trains</h5>
                </div>
              </div>
            </div>

            {train.map((item, trainNumber) => (
              <div className="card-body" key={item.trainNumber}>
                <Zoom right>
                  <div className="card">
                    <h5
                      className="card-header bg-primary"
                      style={{ color: "white" }}
                    >
                      {item.trainName} ({item.trainNumber})
                    </h5>
                    <div className="card-body">
                      <div className="card-title outer-div">
                        <div className="leftDiv">
                          <h5>
                            {item.departureTime.slice(0, 2)}:
                            {item.departureTime.slice(3, 5)} |{" "}
                            {item.fromStation} |{" "}
                            {weekday[new Date(item.departureDate).getDay()]},{" "}
                            {new Date(item.departureDate).getDate()}{" "}
                            {month[new Date(item.departureDate).getMonth()]}
                          </h5>
                        </div>
                        <div className="rightDiv">
                          <h5>
                            {item.arrivalTime.slice(0, 2)}:
                            {item.arrivalTime.slice(3, 5)} | {item.toStation} |{" "}
                            {weekday[new Date(item.arrivalDate).getDay()]},{" "}
                            {new Date(item.arrivalDate).getDate()}{" "}
                            {month[new Date(item.arrivalDate).getMonth()]}
                          </h5>
                        </div>
                      </div>
                      <div className="card-text">
                        <div className="row">
                          <div className="col-sm-2">
                            <div className="card ">
                              <div className="card-body coaches">
                                <h6 className="card-title">
                                  AC First Class (1A)
                                </h6>
                                <p className="card-text">
                                  Available:{" "}
                                  {
                                    item.travelDetails.coachesClass[0]
                                      .availableTickets
                                  }
                                </p>
                                {item.travelDetails.coachesClass[0].fare}
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="card">
                              <div className="card-body coaches">
                                <h6 className="card-title">AC 2 Tier (2A)</h6>
                                <p className="card-text">
                                  Available:{" "}
                                  {
                                    item.travelDetails.coachesClass[1]
                                      .availableTickets
                                  }
                                </p>
                                {item.travelDetails.coachesClass[1].fare}
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="card">
                              <div className="card-body coaches">
                                <h6 className="card-title">AC 3 Tier (3A)</h6>
                                <p className="card-text">
                                  Available:{" "}
                                  {
                                    item.travelDetails.coachesClass[2]
                                      .availableTickets
                                  }
                                </p>
                                {item.travelDetails.coachesClass[2].fare}
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="card">
                              <div className="card-body coaches">
                                <h6 className="card-title">Sleeper (SL)</h6>
                                <p className="card-text">
                                  Available:{" "}
                                  {
                                    item.travelDetails.coachesClass[3]
                                      .availableTickets
                                  }
                                </p>
                                {item.travelDetails.coachesClass[3].fare}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer text-end">
                      <button
                        className="btn btn-primary me-1"
                        onClick={() => handleBook(item)}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </Zoom>
              </div>
            ))}
          </div>
        </div>
        <br />
        <hr />
        <Zoom>
          <Slider />
        </Zoom>
        <div className="card-group">
          <Zoom>
            <div className="card click">
              <img
                className="card-img-top"
                src="https://cdn.pixabay.com/photo/2021/04/19/17/34/golden-chariot-6192005_960_720.jpg"
                alt="Card image cap"
              />
              <div className="card-body">
                <h5 className="card-title">Maharajas' Express</h5>
                <p className="card-text">
                  Redefining Royalty, Luxury and Comfort, Maharajas' express
                  takes you on a sojourn to the era of bygone stately splendour
                  of princely states. Sylvan furnishings, elegant ambience and
                  modern amenities are amalgamated for an “Experience
                  Unsurpassed”. It has been a winner of “World’s Leading Luxury
                  train” by World Travel Awards consecutively for last six
                  years.
                </p>
              </div>
              <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </Zoom>
          <Zoom>
            <div className="card click">
              <img
                className="card-img-top"
                src="https://cdn.pixabay.com/photo/2016/01/16/16/11/mountaineerz-1143556_960_720.jpg"
                alt="Card image cap"
              />
              <div className="card-body">
                <h5 className="card-title">Rail Tour Packages</h5>
                <p className="card-text">
                  Book My Train offers Exclusive Rail tour packages with
                  confirmed train tickets, sight-seeing and meals for enchanting
                  Nilgiri Mountains, Darjeeling, Kullu Manali, Kashmir, Gangtok
                  or divine tours of Mata Vaishno Devi, Rameswaram, Madurai,
                  Shirdi, Tirupati etc. Holiday packages/ Land packages to these
                  destinations are also available.
                </p>
              </div>
              <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </Zoom>
          <Zoom>
            <div className="card click">
              <img className="card-img-top" src={Statue} alt="Card image cap" />
              <div className="card-body">
                <h5 className="card-title">Domestic Air Packages</h5>
                <p className="card-text">
                  Be it the spiritual devotee seeking blessings of Tirupati,
                  Shirdi or Mata Vaishno Devi or the leisure traveller wanting
                  to relish the Blue mountains of North East, Sand-dunes of
                  Rajasthan, Hamlets of Ladakh, Wonders of Himalayas, Serene
                  lakes or Picturesque Islands, Book My Train has it all.
                  Discover India through Book My Train!
                </p>
              </div>
              <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </Zoom>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export { HomePage };

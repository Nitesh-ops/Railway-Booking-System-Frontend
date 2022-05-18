import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BookingService from "./../services/book.service";
import TrainService from "./../services/train.service";
import { IoIosPersonAdd } from "react-icons/io";
import { TiUserDelete } from "react-icons/ti";
import { useSelector } from "react-redux";
import PaymentService from "./../services/payment.service";
import swal from "sweetalert";
import Fade from 'react-reveal/Fade';

const BookingForm = () => {
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
  const params = useParams();
  const trainNo = params.id;

  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const currentUser = useSelector((state) => state.user);

  const navigate = useNavigate();

  // username
  const [username, setUsername] = useState("");

  //requiredTrain
  const [train, setTrain] = useState({
    trainNumber: 0,
    trainName: "",
    fromStation: "",
    toStation: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
  });

  //TravellerDetails
  const [travellerDetails, setTravellerDetails] = useState([
    {
      name: "",
      age: 0,
      gender: "",
    },
  ]);

  const addInputField = () => {
    setTravellerDetails([
      ...travellerDetails,
      {
        name: "",
        age: 0,
        gender: "",
      },
    ]);
  };

  const removeInputFields = (index) => {
    const rows = [...travellerDetails];
    console.log(index);
    rows.splice(index, 1);
    setTravellerDetails(rows);
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...travellerDetails];
    list[index][name] = value;
    setTravellerDetails(list);
  };

  //address
  const [address, setAddress] = useState("");

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };

  //travelClass
  const [travelClass, setTravelClass] = useState("");

  const onChangeTravel = (e) => {
    const travelCoach = e.target.value;
    setTravelClass(travelCoach);
  };

  //email
  const [emailId, setEmailId] = useState("");

  const handleEmailId = (e) => {
    setEmailId(e.target.value);
  };

  useEffect(() => {
    TrainService.getTrainByTrainNumber(trainNo).then((response) => {
      setTrain(response.data);
    });
  }, []);

  const bookTicket = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!emailId) {
      return "";
    }

    var fare;
    var passengerLength = travellerDetails.length;
    if (travelClass === "1A") {
      fare = 1200 * passengerLength;
    } else if (travelClass === "2A") {
      fare = 1100 * passengerLength;
    } else if (travelClass === "3A") {
      fare = 900 * passengerLength;
    } else if (travelClass === "SL") {
      fare = 500 * passengerLength;
    }

    PaymentService.initiatePayment(fare)
      .then((response) => {
        console.log(response.data);
        if (response.data.status == "created") {
          // console.log("ok to proceed");
          let options = {
            key: "rzp_test_Ms2rvCWwOeVJpr",
            amount: response.data.amount,
            currency: "INR",
            name: "Book My Train",
            description: "Online Payment",
            image:
              "https://toppng.com/public/uploads/thumbnail/indian-train-white-background-11549889698anaad4mqde.png",
            order_id: response.data.id,
            handler: function (response) {
              console.log(response);
              console.log("payment successful");
              swal("Payment Done", "Payment is Succesfull", "success");
              const bookingDetails = {
                username: currentUser.username,
                bookingDetail: {
                  travellerDetails,
                  emailId: emailId,
                  address: address,
                  travelClass: travelClass,
                },
              };

              console.log(bookingDetails);

              BookingService.saveTicket(train, bookingDetails)
                .then((response) => {
                  console.log(response);
                  setSubmitted(false);
                  swal({
                    title: "Booking Confirmed",
                    text: "Ticket Booked Sucessfully",
                    icon: "success",
                    button: "Ok",
                  });
                  setTimeout(function () {
                    navigate("/profile");
                  }, 3000);
                })
                .catch((err) => {
                  setErrorMessage("Unexpected Error Occured");
                  console.log(err);
                });
            },
            prefill: {
              name: currentUser.username,
              email: emailId,
              contact: "",
            },

            notes: {
              address: "Nitesh Book My Train",
            },

            theme: {
              color: "#3399cc",
            },
          };

          let rzp = new window.Razorpay(options);

          rzp.on("payment.failed", function (response) {
            console.log(response);
            alert("Oops payment failed");
          });

          rzp.open();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-6">
              <h5>Please fill in your details</h5>
            </div>
          </div>
        </div>
        <div className="container">
          {
            <div className="card-body" key={train.trainNumber}>
              <div className="card">
                <h5
                  className="card-header bg-primary"
                  style={{ color: "white" }}
                >
                  {train.trainName} ({train.trainNumber})
                </h5>
                <div className="card-body">
                  <div className="card-title outer-div">
                    <div className="leftDiv">
                      <h5>
                        {train.departureTime.slice(0, 2)}:
                        {train.departureTime.slice(3, 5)} | {train.fromStation}{" "}
                        | {weekday[new Date(train.departureDate).getDay()]},{" "}
                        {new Date(train.departureDate).getDate()}{" "}
                        {month[new Date(train.departureDate).getMonth()]}
                      </h5>
                    </div>
                    <div className="rightDiv">
                      <h5>
                        {train.arrivalTime.slice(0, 2)}:
                        {train.arrivalTime.slice(3, 5)} | {train.toStation} |{" "}
                        {weekday[new Date(train.arrivalDate).getDay()]},{" "}
                        {new Date(train.arrivalDate).getDate()}{" "}
                        {month[new Date(train.arrivalDate).getMonth()]}
                      </h5>
                    </div>
                  </div>
                  <hr />
                  <div className="card-text">
                    <h5>Passenger Details:</h5>
                    <br />
                    <div className="container">
                      <form
                        // onSubmit={(e) => bookTicket(e)}
                        noValidate
                        className={submitted ? "was-validated" : ""}
                      >
                        <div className="container">
                          {errorMessage && (
                            <center>
                              <div className="alert alert-danger">
                                {errorMessage}
                              </div>
                            </center>
                          )}
                          <div className="row">
                            {travellerDetails.map((data, index) => {
                              const { name, age, gender } = data;
                              return (
                                <div className="row my-3" key={index}>
                                  <div className="col-sm">
                                    <div class="input-group has-validation">
                                      <span
                                        class="fa fa-user icon"
                                        id="inputGroupPrepend"
                                      ></span>
                                      <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Passenger Name"
                                        required
                                        value={name}
                                        aria-describedby="inputGroupPrepend"
                                        onChange={(evnt) =>
                                          handleChange(index, evnt)
                                        }
                                      />
                                      <div className="invalid-feedback">
                                        <Fade bottom collapse>
                                          <div>Passenger Name is required</div>
                                        </Fade>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm">
                                    <div class="input-group has-validation">
                                      <input
                                        type="number"
                                        name="age"
                                        className="form-control"
                                        placeholder="Age"
                                        required
                                        value={age}
                                        onChange={(evnt) =>
                                          handleChange(index, evnt)
                                        }
                                      />
                                      <div className="invalid-feedback">
                                        <Fade bottom collapse>
                                          <div>Age is required</div>
                                        </Fade>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-sm">
                                    <div class="input-group has-validation">
                                      <span
                                        class="fa-regular fa-g icon"
                                        id="inputGroupPrepend"
                                      ></span>
                                      <select
                                        name="gender"
                                        className="form-control"
                                        placeholder="Gender"
                                        required
                                        defaultValue={""}
                                        aria-describedby="inputGroupPrepend"
                                        onChange={(evnt) =>
                                          handleChange(index, evnt)
                                        }
                                      >
                                        <option value="" disabled>
                                          --Select Gender--
                                        </option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="Others">Others</option>
                                      </select>
                                      <div className="invalid-feedback">
                                        <Fade bottom collapse>
                                          <div>Gender is required</div>
                                        </Fade>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm">
                                    {travellerDetails.length !== 1 ? (
                                      <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => removeInputFields(index)}
                                      >
                                        <TiUserDelete />
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="row">
                            <div className="col-sm-12">
                              {travellerDetails.length < 6 ? (
                                <button
                                  type="button"
                                  className="btn btn-primary "
                                  onClick={addInputField}
                                >
                                  <IoIosPersonAdd /> Add Passenger
                                </button>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm">
                              <label htmlFor="travelClass">Travel Class</label>
                              <select
                                name="traveClass"
                                className="form-control"
                                value={travelClass}
                                defaultValue={""}
                                required
                                onChange={(e) => onChangeTravel(e)}
                              >
                                <option value="" disabled>
                                  --Select Travel Class--
                                </option>
                                <option value="1A">1A</option>
                                <option value="2A">2A</option>
                                <option value="3A">3A</option>
                                <option value="SL">SL</option>
                              </select>
                              <div className="invalid-feedback">
                                <Fade bottom collapse>
                                  <div>Travel Class is required</div>
                                </Fade>
                              </div>
                            </div>

                            <div className="col-sm">
                              <label htmlFor="email">Enter Email</label>
                              <input
                                type="email"
                                name="emailId"
                                className="form-control"
                                placeholder="E-mail"
                                required
                                value={emailId}
                                onChange={(e) => handleEmailId(e)}
                              />
                              <div className="invalid-feedback">
                                <Fade bottom collapse>
                                  <div>Email is required</div>
                                </Fade>
                              </div>
                            </div>

                            <div className="form-group">
                              <label htmlFor="Address">Address</label>
                              <textarea
                                name="address"
                                value={address}
                                placeholder="Enter your complete address"
                                className="form-control"
                                rows="3"
                                required
                                onChange={(e) => handleAddress(e)}
                              ></textarea>
                              <div className="invalid-feedback">
                                <Fade bottom collapse>
                                  <div>Address is required</div>
                                </Fade>
                              </div>
                            </div>
                          </div>
                          <br />
                        </div>
                        {/* <h4 className="text-center">Total Amount: {}</h4> */}
                        <center>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={(e) => bookTicket(e)}
                          >
                            Submit
                          </button>
                        </center>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export { BookingForm };

import { useEffect, useRef, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { TrainDelete } from "../../components/TrainDelete";
import { TrainSave } from "../../components/TrainSave";
import TrainService from "../../services/train.service";
import "./AdminPage.css";
import ReactPaginate from "react-paginate";
import Spinner from "react-bootstrap/Spinner";

const AdminPage = () => {
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

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTrain, setSelectedTrain] = useState({
    trainNumber: "",
    trainName: "",
    fromStation: "",
    toStation: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    travelDetails: {
      coachesClass: [
        {
          availableTickets: "10",
          travelClass: "1A",
          fare: "1200",
        },
        {
          availableTickets: "20",
          travelClass: "2A",
          fare: "1100",
        },
        {
          availableTickets: "50",
          travelClass: "3A",
          fare: "900",
        },
        {
          availableTickets: "20",
          travelClass: "SL",
          fare: "500",
        },
      ],
    },
  });
  const saveComponent = useRef();
  const deleteComponent = useRef();

  useEffect(() => {
    setLoading(true);
    TrainService.getAllTrains()
      .then((response) => {
        console.log(response.data);
        setTrainList(response.data);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Something went wrong");
        setLoading(false);
      });
  }, []);

  const createTrainRequest = () => {
    setSelectedTrain({
      trainNumber: "",
      trainName: "",
      fromStation: "",
      toStation: "",
      departureDate: "",
      departureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      travelDetails: {
        coachesClass: [
          {
            availableTickets: "10",
            travelClass: "1A",
            fare: "1200",
          },
          {
            availableTickets: "20",
            travelClass: "2A",
            fare: "1100",
          },
          {
            availableTickets: "50",
            travelClass: "3A",
            fare: "900",
          },
          {
            availableTickets: "20",
            travelClass: "SL",
            fare: "500",
          },
        ],
      },
    });
    saveComponent.current?.showTrainModal();
  };

  const editTrainRequest = (item) => {
    setSelectedTrain(Object.assign({}, item));
    saveComponent.current?.showTrainModal();
  };

  const deleteTrainRequest = (train) => {
    setSelectedTrain(train);
    deleteComponent.current?.showDeleteModal();
  };

  // const saveTrainWatcher = (train) => {
  //   const newList = trainList.concat(train);
  //   setTrainList(newList);
  // };

  const deleteTrain = () => {
    TrainService.deleteTrain(selectedTrain)
      .then((_) => {
        setTrainList(
          trainList.filter((x) => x.trainNumber !== selectedTrain.trainNumber)
        );
      })
      .catch((err) => {
        setErrorMessage("Unexpected error Occured");
        console.log(err);
      });
  };

  const [pageNumber, setPageNumber] = useState(0);
  const trainPerPage = 2;
  const pageVisited = pageNumber * trainPerPage;

  const displayTrain = trainList
    .slice(pageVisited, pageVisited + trainPerPage)
    .map((item) => {
      return (
        <div className="card-body" key={item.trainNumber}>
          <div className="card">
            <h5 className="card-header">
              {item.trainName} ({item.trainNumber})
            </h5>
            <div className="card-body">
              <div className="card-title outer-div">
                <div className="leftDiv">
                  <h5>
                    {item.departureTime.slice(0, 2)}:
                    {item.departureTime.slice(3, 5)} | {item.fromStation} |{" "}
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
                        <h6 className="card-title">AC First Class (1A)</h6>
                        <p className="card-text">
                          Available:{" "}
                          {item.travelDetails.coachesClass[0].availableTickets}
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
                          {item.travelDetails.coachesClass[1].availableTickets}
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
                          {item.travelDetails.coachesClass[2].availableTickets}
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
                          {item.travelDetails.coachesClass[3].availableTickets}
                        </p>
                        {item.travelDetails.coachesClass[3].fare}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary me-1"
                onClick={() => editTrainRequest(item)}
              >
                <AiFillEdit /> Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteTrainRequest(item)}
              >
                <AiFillDelete /> Delete
              </button>
            </div>
          </div>
        </div>
      );
    });
  const pageCount = Math.ceil(trainList.length / trainPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div>
      <div className="container">
        <div className="pt-5">
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-6">
                  <h3>All Trains</h3>
                </div>
                <div className="col-6 text-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => createTrainRequest()}
                  >
                    <IoMdAdd /> Add Train
                  </button>
                </div>
              </div>
            </div>
            {loading ? (
              displayTrain
            ) : (
              <center>
                <Spinner animation="border" />
              </center>
            )}
            <div className="center">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </div>
          </div>
        </div>
      </div>
      <TrainSave ref={saveComponent} train={selectedTrain} />
      {/* onSaved={(p) => saveTrainWatcher(p)} */}
      <TrainDelete
        ref={deleteComponent}
        onConfirmed={() => deleteTrain()}
      ></TrainDelete>
    </div>
  );
};

export { AdminPage };

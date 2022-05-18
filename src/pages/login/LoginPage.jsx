import { useEffect, useState } from "react";
import User from "../../models/user";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationService from "../../services/authentication.service";
import { setCurrentUser } from "../../store/actions/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "../register/RegisterPage.css";
import { MdLogin } from "react-icons/md";
import { FaUserPlus, FaUserAlt } from "react-icons/fa";
import Slider from "../../components/Ads/Slider";
import Fade from "react-reveal/Fade";

const LoginPage = () => {
  const [user, setUser] = useState(new User("", "", ""));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  //mounted
  useEffect(() => {
    if (currentUser?.id) {
      navigate("/profile");
    }
  }, []);

  //<input onChange=(event => handleChange(event))>
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevState) => {
      //E.g: prevState ({user: abc, pass: abc}) + newKeyValue ({user: abcd}) => ({user: abcd, pass: abc})
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setSubmitted(true);

    if (!user.username || !user.password) {
      return "";
    }

    setLoading(true);

    AuthenticationService.login(user)
      .then((response) => {
        //set user in session.
        dispatch(setCurrentUser(response.data));
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("username or password is not valid.");
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <div className="card ms-auto me-auto p-3 shadow-lg custom-card">
        <FontAwesomeIcon
          icon={faUserCircle}
          className="ms-auto me-auto user-icon"
        />

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form
          onSubmit={(e) => handleLogin(e)}
          noValidate
          className={submitted ? "was-validated" : ""}
        >
          <br />
          <div className="form-group">
            <label for="validationCustomUsername" class="form-label">
              Username
            </label>
            <div class="input-group has-validation">
              <span class="fa fa-user icon" id="inputGroupPrepend"></span>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Username"
                value={user.username}
                onChange={(e) => handleChange(e)}
                aria-describedby="inputGroupPrepend"
                required
              />
              <div className="invalid-feedback">
                <Fade bottom collapse>
                  <div>Username is required.</div>
                </Fade>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label for="validationCustomUsername" class="form-label">
              Password
            </label>
            <div class="input-group has-validation">
              <span class="fa fa-key icon" id="inputGroupPrepend"></span>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => handleChange(e)}
                aria-describedby="inputGroupPrepend"
                required
              />
              <div className="invalid-feedback">
                <Fade bottom collapse>
                  <div>Password is required.</div>
                </Fade>
              </div>
            </div>
          </div>

          <button className="btn btn-info w-100 mt-3" disabled={loading}>
            Sign In <MdLogin />
          </button>
        </form>

        <Link
          to="/register"
          className="btn btn-link"
          style={{ color: "darkgray" }}
        >
          Create New Account! <FaUserPlus />
        </Link>
      </div>
      <br />
      <Slider />
    </div>
  );
};

export { LoginPage };

import { Link } from "react-router-dom";
import Unauthorized from "../../images/401 Error Unauthorized-amico.png";

const UnauthorizedPage = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <span className="display-1">
            <img
              src={Unauthorized}
              className="img-fluid"
              width={650}
              height={650}
              alt="404logo"
            />
          </span>
          <div className="mb-4 lead"></div>
          <Link to="/home" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export { UnauthorizedPage };

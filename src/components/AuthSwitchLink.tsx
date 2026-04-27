import { Link } from "react-router-dom";

const AuthSwitchLink = ({ question, linkText, to }) => {
  return (
    <h2 className="text-sm font-bold text-center mt-8">
      {question}{" "}
      <Link to={to} className="text-blue-600 hover:underline">
        {linkText}
      </Link>
    </h2>
  );
};

export default AuthSwitchLink;
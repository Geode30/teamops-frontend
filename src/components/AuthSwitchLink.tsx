import { Link } from "react-router-dom";

type AuthSwitchLinkProps = {
  question: string;
  linkText: string;
  to: string;
};

const AuthSwitchLink = ({
  question,
  linkText,
  to,
}: AuthSwitchLinkProps) => {
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
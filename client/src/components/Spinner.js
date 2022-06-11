import Loader from "react-loader-spinner";

export const Spinner = ({ type = "Oval", height = 80, marginTop = 70 }) => (
  <div className="text-center" style={{ marginTop: marginTop }}>
    <Loader type={type} color="rgb(50, 110, 150)" height={height} />
  </div>
);

import Loader from "react-loader-spinner";

export const Spinner = ({ height = 80, marginTop = 70 }) => (
  <div className="text-center" style={{ marginTop: marginTop }}>
    <Loader type="Oval" color="rgb(50, 110, 150)" height={height} />
  </div>
);

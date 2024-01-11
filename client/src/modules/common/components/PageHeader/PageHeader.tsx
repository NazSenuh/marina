import CloseSeason from "../CloseSeason/CloseSeason";
import "./PageHeader.css";

function PageHeader() {
  return (
    <div className="page-header-wrappers">
      <label>Home</label>
      <CloseSeason />
    </div>
  );
}

export default PageHeader;

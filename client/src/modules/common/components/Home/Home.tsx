import PageHeader from "../PageHeader/PageHeader";
import MarinaSvg from "../SvgComponents/MarinaSvg/MarinaSvg";

import "./Home.css";
function Home({refetch}:any) {
  return (
    <>
      <div className="home-wrapper">
        <PageHeader />
        <MarinaSvg refetch={refetch}/>
      </div>
    </>
  );
}

export default Home;

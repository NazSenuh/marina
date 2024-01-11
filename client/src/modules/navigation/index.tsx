import { BrowserRouter } from "react-router-dom";
import Header from "../common/components/Header/Header";
import { MainSwitch } from "./MainSwitch";
export const MainRouter = () => {

  return (
    <>
      <BrowserRouter>
     
        <Header />
        <MainSwitch />
      </BrowserRouter>
    </>
  );
};

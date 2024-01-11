import { QueryClientProvider } from "react-query";

import { queryClient } from '../config/query-client.config';
import { Toaster } from 'react-hot-toast';
import { MainRouter } from '../navigation';
import './App.css';
import { FilterProvider } from "../context/filterContext";
import { StatusProvider } from "../context/paymentContext";
import { SortingProvider } from "../context/sortContext";
import { ReportingProvider } from "../context/reportingContext";

function AppContainer() {
  return (
    <div className="App">
      <SortingProvider>
        <StatusProvider>
          <FilterProvider>
          <ReportingProvider>

            <QueryClientProvider client={queryClient}>
              <Toaster />
              <MainRouter />
            </QueryClientProvider>
            </ReportingProvider>

          </FilterProvider>
        </StatusProvider>
      </SortingProvider>



    </div>
  );
}

export default AppContainer;

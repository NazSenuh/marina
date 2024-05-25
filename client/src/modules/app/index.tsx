import { QueryClientProvider } from "react-query";

import { queryClient } from '../config/query-client.config';
import { Toaster } from 'react-hot-toast';
import { MainRouter } from '../navigation';
import './App.css';
import { ReportingProvider } from "../context/reportingContext";


function AppContainer() {
  return (
    <div className="App">
          <ReportingProvider>

            <QueryClientProvider client={queryClient}>
              <Toaster />
              <MainRouter />
            </QueryClientProvider>
            </ReportingProvider>


    </div>
  );
}

export default AppContainer;

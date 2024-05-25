import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { CategoryScale } from 'chart.js';
import { useQuery } from "react-query";
import reservationService from "../../../services/reservation.service";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale);

interface Statistic {
  count: number;
  hour: string;
}

interface ApiResponse {
  _id: string;
  hour: string;
  count: number;
  __v: number;
}

export const StatysticChart = () => {
  const { data: statisticData } = useQuery<ApiResponse[]>('statistic', () => reservationService.getReservStatistic());
  const [transformedData, setTransformedData] = useState<Statistic[]>([]);

  useEffect(() => {
    if (statisticData) {
      const transformed = statisticData.map(stat => ({
        hour: stat.hour,
        count: stat.count,
      }));
      setTransformedData(transformed);
    }
  }, [statisticData]);

  // Create an array with default counts set to 0 for each hour from 00:00 to 23:00
  const hours = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`);
  const counts = hours.map(hour => {
    const found = transformedData.find(stat => stat.hour === hour);
    return found ? found.count : 0;
  });

  return (
    <div style={{ position: 'absolute', 
    top: '50%', left: '50%', 
    transform: 'translate(-50%,-50%)', 
     height: '100%',
    width: '100%', 
     paddingTop: '20px'
    }}>
      <Line
        data={{
          labels: hours,
          datasets: [
            {
              label: 'Reservations Count',
              data: counts,
            //   borderColor: 'rgba(75, 192, 192, 1)',
            //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
            //   fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Reservations by Hour',
            },
          },
        }}
      />
    </div>
  );
}

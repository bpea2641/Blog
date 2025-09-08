import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = ({today, total}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetch("/weekly")  // 또는 proxy 설정을 통해 /weekly만 써도 됨
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 오류: " + res.status);
        return res.json();
      })
      .then((data) => {
        const labels = Object.keys(data);
        const weeklyValues = Object.values(data);

        // Create arrays for today and total with the same length as labels
        const todayValues = new Array(labels.length).fill(today);
        const totalValues = new Array(labels.length).fill(total);
  
        setChartData({
          labels,
          datasets: [
            {
              label: "일주일 간 조회수",
              data: weeklyValues,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              fill: false,
            },
            {
              label: "오늘 조회수",
              data: todayValues,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: false,
            },
            {
              label: "총 조회수",
              data: totalValues,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: false,
            }
          ],
        });
      })
      .catch((err) => {
        console.error("에러 발생:", err.message);
      });
  }, [today, total]);
  

  return <Line data={chartData} />;
};

export default ChartComponent;

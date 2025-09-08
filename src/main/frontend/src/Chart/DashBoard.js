import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";

const Dashboard = () => {

  const [today, setToday] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    fetch('/today')
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.text(); // long 값이니까 text로 받기
      })
      .then((result) => setToday(result))
      .catch((err) => console.error("주간 조회수 에러 발생: ", err));

    fetch('/total')
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.text();
      })
      .then((result) => setTotal(result))
      .catch((err) => console.error("총 조회수 에러 발생: ", err));
  }, []);
  

  return (
    <div className="content">
      <div className="row">
        <div className="col-12">
          <div className="card card-chart" style={{ width: "80%", margin: "0 auto", marginTop: '200px' }}>
            <div className="card-header">
              <h5 className="card-category">블로그</h5>
              <h2 className="card-title">조회수</h2>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* 차트 영역 */}
                  <div className="chart-area" style={{ height: "300px", flex: 3 }}>
                    <ChartComponent today={today} total={total}/>
                  </div>

                  <div style={{ flex: 1, marginLeft: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{
                      padding: "20px", border: "1px solid #ccc", borderRadius: "10px",
                      backgroundColor: "#f9f9f9", textAlign: "center", fontSize: "18px", fontWeight: "bold"
                    }}>
                      오늘 조회수 📶<br />
                      <span style={{ fontSize: "32px", color: "#2c3e50" }}>{today}</span>
                    </div>

                    <div style={{
                      padding: "20px", border: "1px solid #ccc", borderRadius: "10px",
                      backgroundColor: "#f1f1f1", textAlign: "center", fontSize: "18px", fontWeight: "bold"
                    }}>
                      총 조회수 📶<br />
                      <span style={{ fontSize: "32px", color: "#8e44ad" }}>{total}</span>
                    </div>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

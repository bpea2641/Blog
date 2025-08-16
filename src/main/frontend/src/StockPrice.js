import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';
import axios from "axios";

const API_KEY = "c7319f7859c048a08a951f6b021fef98";
const symbols = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "META", name: "Meta" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "BRK.B", name: "Berkshire Hathaway" }
];
const INITIAL_BALANCE = 100000;

const StockSimulator = () => {
  const [histories, setHistories] = useState({});
  const [holdings, setHoldings] = useState({});
  const [balance, setBalance] = useState(INITIAL_BALANCE);

  // 초기 보유량 설정
  useEffect(() => {
    const initHold = {};
    symbols.forEach(s => { initHold[s.symbol] = 0; });
    setHoldings(initHold);
  }, []);

  // 시세 및 차트 데이터 fetch (time_series) - 1분마다
  const fetchData = async () => {
    try {
      const responses = await Promise.all(
        symbols.map(s => 
          axios.get(`https://api.twelvedata.com/time_series?symbol=${s.symbol}&interval=1min&outputsize=30&apikey=${API_KEY}`)
        )
      );
      const newHist = {};
      responses.forEach((res, idx) => {
        const sym = symbols[idx].symbol;
        const values = res.data.values; // latest first
        // reverse for chronological
        newHist[sym] = [...values].reverse();
      });
      setHistories(newHist);
    } catch (error) {
      console.error("데이터 fetch 실패", error);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, []);

  const handleBuy = (symbol) => {
    const last = histories[symbol]?.slice(-1)[0];
    const price = last ? parseFloat(last.close) : 0;
    if (price && balance >= price) {
      setBalance(prev => prev - price);
      setHoldings(prev => ({ ...prev, [symbol]: prev[symbol] + 1 }));
    } else alert("잔액이 부족합니다");
  };

  const handleSell = (symbol) => {
    if (holdings[symbol] > 0) {
      const last = histories[symbol]?.slice(-1)[0];
      const price = last ? parseFloat(last.close) : 0;
      setBalance(prev => prev + price);
      setHoldings(prev => ({ ...prev, [symbol]: prev[symbol] - 1 }));
    } else alert("보유 수량이 없습니다");
  };

  return (
    <Container fluid className="p-3">
      <h4>💰 가상 잔고: ${balance.toFixed(2)}</h4>
      <Row xs={2} md={4} className="g-3 mt-2">
        {symbols.map(s => (
          <Col key={s.symbol}>
            <Card style={{ height: '260px' }}>
              <Card.Body className="d-flex p-2">
                {/* 왼쪽: 차트 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {histories[s.symbol] ? (
                    <Line
                      data={{
                        labels: histories[s.symbol].map(v => v.datetime),
                        datasets: [
                          {
                            data: histories[s.symbol].map(v => parseFloat(v.close)),
                            fill: false,
                            tension: 0.3,
                          }
                        ]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { x: { display: false }, y: { display: false } },
                        elements: { point: { radius: 0 } }
                      }}
                      height={80}
                    />
                  ) : (
                    <div style={{ height: '80px' }}>로딩 차트...</div>
                  )}
                </div>
                {/* 오른쪽: 정보 */}
                <div style={{ width: '100px', paddingLeft: '8px' }} className="d-flex flex-column justify-content-center">
                  <div><strong>{s.name}</strong></div>
                  <div className="text-muted">
                    ${histories[s.symbol] ? parseFloat(histories[s.symbol].slice(-1)[0].close).toFixed(2) : '---'}
                  </div>
                  <div>보유: {holdings[s.symbol]}주</div>
                  <div className="mt-2">
                    <Button variant="success" size="sm" onClick={() => handleBuy(s.symbol)}>매수</Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleSell(s.symbol)}>매도</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StockSimulator;
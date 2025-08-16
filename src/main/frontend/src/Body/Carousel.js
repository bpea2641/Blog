import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import Lottie from 'react-lottie';

function Carousel1() {
  const [animationData, setAnimationData] = useState(null); // 애니메이션 데이터 상태

  // 컴포넌트가 마운트 될 때 애니메이션 JSON 파일을 가져옵니다.
  useEffect(() => {
    fetch("/AnimeJson/slideAnime.json") // public 폴더 내 위치한 JSON 파일을 가져옵니다.
      .then((response) => response.json())
      .then((data) => setAnimationData(data)) // JSON 데이터가 로드되면 상태 업데이트
      .catch((error) => console.error('Error loading animation data:', error));
  }, []);

  const defaultOptions = {
    loop: true, // 애니메이션 반복
    autoplay: true, // 자동 시작
    animationData: animationData || {}, // animationData가 아직 없으면 빈 객체로 대체
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice', // 비율 유지
    },
  };

  return (
  <div style={{marginTop: '100px'}}>
    <Carousel interval={3000}> {/* 3초마다 자동으로 슬라이드 */}
      <Carousel.Item>
        {/* 애니메이션 데이터가 로드된 경우에만 Lottie 컴포넌트 렌더링 */}
        {animationData && (
          <Lottie options={defaultOptions} height={300} width={300} />
        )}
      </Carousel.Item>
      <Carousel.Item>
        {animationData && (
          <Lottie options={defaultOptions} height={300} width={300} />
        )}
      </Carousel.Item>
      <Carousel.Item>
        {animationData && (
          <Lottie options={defaultOptions} height={300} width={300} />
        )}
      </Carousel.Item>
    </Carousel>
  </div>
  );
}

export default Carousel1;

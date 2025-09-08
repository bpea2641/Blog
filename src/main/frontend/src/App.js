import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavToolBar from './NavToolBar';
import {Card1, Card2} from './Body/Card';
import OCV from './Body/OCV'
//import Carousel1 from './Body/Carousel';
//import Container1 from './Body/Container';
import Signup from './Sign/signup';
import Login from './Sign/login';
import { Route, Routes } from 'react-router-dom';
import Board from './Board/Board';
import BoardList from './Board/BoardList';
import BoardDetails from './Board/BoardDetail';
import BoardEdit from './Board/BoardEdit';
import Dashboard from './Chart/DashBoard';
import StockPrice from './StockPrice';
import UserPage from './User/UserPage';
import Chat from './Chat/Chat';
import JudgeComponent from './Judge/JudgeComponent';
import ProblemAdminComponent from './Judge/ProblemAdminComponent';
import KakaoCallback from './Auth/KakaoCallback'; // 카카오 콜백 컴포넌트 임포트
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './store';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 백엔드에 쿠키와 함께 사용자 정보 요청
        const response = await axios.get('/user', {
          withCredentials: true, // 중요: 쿠키를 포함하여 요청
        });
        if (response.data) {
          // 응답 데이터로 Redux 상태 업데이트
          dispatch(setUser(response.data));
        }
      } catch (error) {
        console.log("로그인 상태가 아닙니다.");
      }
    };
    checkUser();
  }, [dispatch]);

  return (
    <div className="App" style={{ position: 'relative' }}>
      <NavToolBar />
      <Routes>
        <Route path="/" element={<> 
          <Card1 />
          <Card2 />
          <Dashboard />
          <OCV />
        </>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/kakao" element={<KakaoCallback />} /> {/* 카카오 콜백 라우트 추가 */}
        <Route path="/board" element={<Board />} />
        <Route path='/board/list/page/1' element={<BoardList />} />
        <Route path='/board/detail/:id' element={<BoardDetails />} />
        <Route path='/board/edit/:id' element={<BoardEdit />} />
        <Route path='/stockPrice' element={<StockPrice />} />
        <Route path='/userPage' element={<UserPage />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/judge' element={<JudgeComponent />} />
        <Route path='/admin/add-problem' element={<ProblemAdminComponent />} />
      </Routes>
    </div>
  );
}

export default App;

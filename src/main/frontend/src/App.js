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

function App() {
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
        <Route path="/board" element={<Board />} />
        <Route path='/board/list/page/1' element={<BoardList />} />
        <Route path='/board/detail/:id' element={<BoardDetails />} />
        <Route path='/board/edit/:id' element={<BoardEdit />} />
        <Route path='/stockPrice' element={<StockPrice />} />
        <Route path='/userPage' element={<UserPage />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
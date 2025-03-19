import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavToolBar from './NavToolBar';
import {Card1, Card2} from './Body/Card';
import Carousel1 from './Body/Carousel';
import Container1 from './Body/Container';
import Signup from './Sign/signup';
import Login from './Sign/login';
import { Route, Routes } from 'react-router-dom';
import Board from './Board/Board';
import BoardList from './Board/BoardList';
import BoardDetails from './Board/BoardDetail';
import BoardEdit from './Board/BoardEdit';

function App() {
  return (
    <div className="App" style={{ position: 'relative' }}>
      <NavToolBar />
      <Routes>
        <Route path="/" element={<>
          <Card1 />
          <Carousel1 />
          <Container1 />
          <Card2 />
        </>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/board" element={<Board />} />
        <Route path='/board/list/page/1' element={<BoardList />} />
        <Route path='/board/detail/:id' element={<BoardDetails />} />
        <Route path='/board/edit/:id' element={<BoardEdit />} />
      </Routes>
    </div>
  );
}

export default App;
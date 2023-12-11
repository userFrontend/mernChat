import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useInfoContext } from './context/Context';
import Auth from './pages/Auth/Auth';
import Chat from './pages/Chat/Chat';

function App() {
  const {currentUser} = useInfoContext()
  return (
    <div className="App">
      {currentUser ? <Chat/> : <Auth/>}

      <div className='blur'></div>
      <div className='blur'></div>
      <ToastContainer />
    </div>
  );
}

export default App;

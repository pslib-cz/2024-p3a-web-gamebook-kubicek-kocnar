import './App.css';
//@ts-expect-error types are missing
import 'react-material-symbols/outlined';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GamesMenu from './app/games/+games';
import LevelMenu from './app/games/[gameid]/levels/+levels';
import MainMenu from './app/+index';
import Level from './app/games/[gameid]/levels/[levelid]/+level';
import LevelEditor from './app/games/[gameid]/levels/[levelid]/editor/+editor';
import './styles/UI.css';
import Editor from './app/+editor';
import Login from './app/+login';

import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/"> {/* na Layout.tsx*/}
          <Route index element={<MainMenu />} />
          <Route path="games" element={<GamesMenu />} />
          <Route path="login" element={<Login />} />
          <Route path="games/:gameid/levels" element={<LevelMenu />} />
          <Route path="games/:gameid/levels/:levelid" element={<Level/>} />
          <Route path="games/:gameid/levels/:levelid/editor" element={<LevelEditor/>} />
          <Route path="editor" element={<Editor/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster/>
    </>
  );
}

export default App;

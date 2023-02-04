import './App.css';
import { useState } from "react";
import DragDropFiles from './components/DragDropFiles';

function App() {
  const [fileList, setFileList] = useState([]); // state to store uploaded file
  return (
    <div className="App">
      <div className='main-block'>
          <h1 className='header'>Upload</h1>
          <DragDropFiles fileList={fileList} setFileList={setFileList}/>
      </div>
    </div>
  );
}

export default App;



  
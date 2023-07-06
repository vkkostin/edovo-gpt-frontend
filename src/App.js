import axios from "axios";
import { useState } from "react";
import logo from './logo.svg';
import './App.css';

// const URL = 'https://edovo-gpt-3d22912cfd6d.herokuapp.com/api';
const URL = 'http://localhost:8080/api';

const uploadToServer = (file, onUploadProgress) => {
    let formData = new FormData();
  
    formData.append("file", file);
  
    return axios.post(`${URL}/csv/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  };

function App() {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState([]);
    const [prompt, setPrompt] = useState('');

    const upload = () => {
        let currentFile = selectedFiles[0];
    
        setProgress(0);
        setCurrentFile(currentFile);
    
        uploadToServer(currentFile, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
          .then(async (response) => {
            setMessage(response.data.message);
          })
          .catch(() => {
            setProgress(0);
            setMessage("Could not upload the file!");
            setCurrentFile(undefined);
          });
    
        setSelectedFiles(undefined);
      };

    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };

    const submit = () => {
        return axios.post(`${URL}/submit`, {prompt});
    }

    const changePrompt = event => {
        setPrompt(event.target.value);
    }

  return (
    <div className="App">
      <div>
        <label className="btn btn-default">
            <input type="file" onChange={selectFile} />
        </label>

        <button
            className="btn btn-success"
            disabled={!selectedFiles}
            onClick={upload}
        >
            Upload
        </button>

        <div>
            {progress}%
        </div>

        <div>
            <input onChange={changePrompt}/>
            <button
                onClick={submit}
                disabled={!prompt}
            >Submit to AI</button>
        </div>

        <div>
            <a href={`${URL}/download`} target="_blank">Download</a>
        </div>
    </div>
    </div>
  );
}

export default App;

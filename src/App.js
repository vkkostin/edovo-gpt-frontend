/*eslint-disable no-unused-vars, react/jsx-no-target-blank*/
import axios from "axios";
import { useState } from "react";
import './App.css';

const URL = 'https://edovo-gpt-3d22912cfd6d.herokuapp.com/api';
// const URL = 'http://localhost:8080/api';

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
  const [prompt, setPrompt] = useState('');
  const [hasFollowUpPrompt, setHasFollowUpPrompt] = useState(false);
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [followUpPromptCondition, setFollowUpPromptCondition] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [temperature, setTemperature] = useState('');

  const upload = () => {
      let currentFile = selectedFiles[0];
  
      setProgress(0);
      setCurrentFile(currentFile);
  
      uploadToServer(currentFile, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      })
        .then(async (response) => {
          console.log(response.data.message)
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

  const submit = async () => {
    if (hasFollowUpPrompt) {
      if (!prompt || !followUpPrompt || !followUpPromptCondition) {
        window.alert('You must have an initial prompt, a follow-up prompt, and a condition for the follow-up prompt before you can submit.');
        return;
      }
    } else if (!prompt) {
      window.alert('You must have a prompt before you can submit.');
      return;
    }

    const {data: {currentItem, totalItems}} = await axios.get(`${URL}/progress`);

    const current = parseInt(currentItem, 10);
    const total = parseInt(totalItems, 10);

    if (current || total) {
      window.alert(`Processing ${currentItem} / ${totalItems} items. Please wait before trying another prompt.`);
    } else {
      if (window.confirm('Submitting your prompt will submit your data to OpenAI. You will not be able to submit another batch of data until the current batch of data has processed. Are you sure you want to continue?')) {
        const data = {
          prompt,
          ...(hasFollowUpPrompt ? {followUpPrompt, followUpPromptCondition} : {}),
          ...(systemMessage ? {systemMessage} : {}),
          ...(temperature ? {temperature} : {}),
        }

        return await axios.post(`${URL}/submit`, data);
      }
    }
  }

  const changePrompt = event => {
      setPrompt(event.target.value);
  }

  const changeFollowUpPrompt = event => {
    setFollowUpPrompt(event.target.value);
  }

  const changeFollowUpPromptCondition = event => {
    setFollowUpPromptCondition(event.target.value);
  }

  const changeSystemMessage = event => {
    setSystemMessage(event.target.value);
  }

  const changeTemperature = event => {
    setTemperature(event.target.value);
  }

  const checkProgress = async () => {
    const {data: {currentItem, totalItems}} = await axios.get(`${URL}/progress`);

    const current = parseInt(currentItem, 10);
    const total = parseInt(totalItems, 10);

    if (current || total) {
      window.alert(`Processing ${currentItem} / ${totalItems} items`);
    } else {
      window.alert(`Not Processing Any Data`);
    }
  }

  let followUpPromptSection = null;

  if (hasFollowUpPrompt) {
    followUpPromptSection = (
      <div className="section section--followup-prompt">
        <h3>FOLLOWUP PROMPT:</h3>

        <p>
          Please input the expected AI response from the first prompt that should trigger a second follow-up prompt:
        </p>

        <input type="text" placeholder="Condition" onChange={changeFollowUpPromptCondition}/>

        <textarea placeholder="Follow-Up Prompt" className="prompt-input" onChange={changeFollowUpPrompt}/> 
      </div>
    )
  }

  return (
    <div className="App">
      <div className="section section--upload">
        <h3>DATA UPLOAD:</h3>
        <p>
          Your CSV <strong>MUST</strong> have "answer" and "question" headers.
        </p>
        <div>
          <label className="btn btn-default">
              <input type="file" onChange={selectFile} accept=".csv"/>
          </label>

          <button
              className="btn btn-success"
              disabled={!selectedFiles}
              onClick={upload}
          >
              Upload CSV
          </button>

          <div>
              Progress: {progress}%
          </div>
        </div>
      </div>

      <hr/>

      <div className="section section--prompt">
        <h3>PROMPT:</h3>
        <p>
          The prompt supports two dynamic data tokens: <strong>&#123;&#123;answer&#125;&#125;</strong> and <strong>&#123;&#123;question&#125;&#125;</strong>. These tokens will be replaced by the question text and the learners actual answer before being submitted to OpenAI.
        </p>
        <textarea placeholder="Prompt" className="prompt-input" onChange={changePrompt}/>
        {followUpPromptSection}

        <button
              onClick={() => setHasFollowUpPrompt(previousState => !previousState)}
              className="prompt-button"
          >{hasFollowUpPrompt ? 'Remove Follow-up Prompt' : 'Add Follow-up Prompt'}</button>

        <p>
          Enter <a href="https://platform.openai.com/docs/guides/gpt/chat-completions-api" target="_blank">system message</a> (optional):
        </p>
        <input className="system-message" type="text" placeholder="System Message" onChange={changeSystemMessage}/>

        <p>
          Enter <a href="https://platform.openai.com/docs/guides/gpt/how-should-i-set-the-temperature-parameter" target="_blank">temperature</a> (optional):
        </p>
        <input className="system-message" type="number" placeholder="Temperature" min="0" max="2" step="0.1" onChange={changeTemperature}/>

        <button onClick={submit} className="submit-button">Submit to AI</button>
      </div>

      <hr/>

      <div className="section section--prompt">
        <button
            className="progress"
            onClick={checkProgress}
        >CHECK PROGRESS</button>
      </div>

      <a className="download-link" href={`${URL}/download`} target="_blank">DOWNLOAD</a>
    </div>
  );
}

export default App;

/*eslint-disable no-unused-vars, react/jsx-no-target-blank*/
import './App.css';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  return (
    <div className="App">
      iframe into <a href='https://www.vladickostin.com'>vladickostin.com</a>
      <br/>
      
      <p>Learner Token: {token}</p>
    </div>
  );
}

export default App;

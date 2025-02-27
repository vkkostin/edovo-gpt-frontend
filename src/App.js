/*eslint-disable no-unused-vars, react/jsx-no-target-blank*/
import './App.css';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  return (
    <div className="App">
      Learner Token: {token}
    </div>
  );
}

export default App;

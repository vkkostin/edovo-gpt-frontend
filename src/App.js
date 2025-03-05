/*eslint-disable no-unused-vars, react/jsx-no-target-blank*/
import './App.css';

function decodeJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
  }
  
  const decodedPayload = JSON.parse(atob(parts[1]));
  return decodedPayload;
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const decodedToken = decodeJWT(token);

  return (
    <div className="App">
      iframe into <a href='https://www.vladickostin.com'>vladickostin.com</a>
      <br/>
      
      <p>Issuer: {decodedToken.iss}</p>
      <p>Learner Token: {decodedToken.USER_ID}</p>
      <p>Issued At: {new Date(decodedToken.iat).toString()}</p>
      <p>Expires At: {new Date(decodedToken.exp).toString()}</p>
    </div>
  );
}

export default App;

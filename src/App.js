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
      
      <p>JWT: {token}</p>
      <p>Issuer: {decodedToken.iss}</p>
      <p>Inmate Facility ID: {decodedToken.USER_ID}</p>
      <p>Inmate Facility State: {decodedToken.STATE}</p>
      <p>Issued At: {new Date(decodedToken.iat * 1000).toString()}</p>
      <p>Expires At: {new Date(decodedToken.exp * 1000).toString()}</p>
    </div>
  );
}

export default App;

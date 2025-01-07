import './App.css';
import CoinbaseWebSocket from './components/coinbaseHome.jsx'

function App() {
  return (
    <div>
      <header>
        Bitcoin Market Prices
      </header>
        <CoinbaseWebSocket />
    </div>
  );
}

export default App;

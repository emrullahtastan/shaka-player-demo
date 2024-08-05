import './App.css';
import ShakaPlayer from "./components/ShakaPlayer";

function App() {
  const videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  return (
      <div className="App">
        <h1>Shaka Player Demo</h1>
        <ShakaPlayer src={videoSrc}/>
      </div>
  );
}
export default App;

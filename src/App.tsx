import SolarWheel from "./components/SolarWheel";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">季節の輪</p>
        <h1>二十四節気</h1>
        <p className="subhead">ドラッグで年を切り替えます</p>
      </header>

      <div className="wheel-frame">
        <SolarWheel />
      </div>

      <footer className="app-footer">
        <span className="chip">UTC data</span>
        <span className="chip">JST view</span>
      </footer>
    </div>
  );
}
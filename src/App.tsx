import SolarWheel from "./components/SolarWheel";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Solar Calendar</p>
        <h1>Twenty-Four Sekki</h1>
        <p className="subhead">Drag the wheel to explore seasonal points.</p>
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
import SolarWheel from "./components/SolarWheel";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>二十四節気</h1>
      </header>

      <div className="wheel-frame">
        <SolarWheel />
      </div>
    </div>
  );
}
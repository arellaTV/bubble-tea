import TestBed from "./components/TestBed";
import { Stage } from "@pixi/react";

function App() {
  return (
    <Stage
      options={{
        backgroundColor: 0x696969,
        resizeTo: window,
        autoDensity: true,
        resolution: window.devicePixelRatio,
        width: window.innerWidth,
        height: window.innerHeight,
      }}
    >
      <TestBed />
    </Stage>
  );
}

export default App;

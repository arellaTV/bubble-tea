import { useControls } from "leva";
import { Container, useApp, withPixiApp } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import HtmlText from "./HtmlText";

function TestBed() {
  const app = useApp();
  const sprite = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [textValues] = useControls("Text", () => ({
    text: { value: "Hello World", rows: true },
    fontSize: 20,
    fontColor: "#000",
  }));
  const [bubbleValues, setBubbleValues] = useControls("Bubble", () => ({
    position: { value: { x: 250, y: 250 }, step: 2 },
    borderWidth: 5,
    borderColor: "#000",
    padding: 20,
  }));

  // const [tailValues, setTailValues] = useControls("Tail", () => ({
  //   position: { value: { x: 0, y: 0 } },
  //   controlPointPosition: { value: { x: 0, y: 0 } },
  // }));

  const onDragMove = useCallback(
    (e) => {
      if (isDragging) {
        setBubbleValues({
          position: {
            x: e.data.global.x,
            y: e.data.global.y,
          },
        });
      }
    },
    [isDragging]
  );

  const onDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }, [app]);

  return (
    <Container eventMode="static" pointermove={onDragMove} hitArea={app.screen}>
      <HtmlText
        ref={sprite}
        text={textValues?.text}
        anchor={{ x: 0.5, y: 0.5 }}
        alpha={isDragging ? 0.5 : 1}
        position={bubbleValues?.position}
        cursor="pointer"
        pointerdown={onDragStart}
        pointerup={onDragEnd}
        interactive={true}
        style={
          new TextStyle({
            fill: textValues?.fontColor,
            fontSize: textValues?.fontSize || 20,
          })
        }
      />
    </Container>
  );
}

export default withPixiApp(TestBed);

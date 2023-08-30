import { useControls } from "leva";
import { Container, Graphics, useApp, withPixiApp } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import HtmlText from "./HtmlText";

function TestBed() {
  const app = useApp();
  const container = useRef();
  const textSprite = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [textValues] = useControls("Text", () => ({
    text: {
      value: "Hello World",
      rows: true,
    },
    fontSize: 20,
    fontColor: "#000",
  }));
  const [bubbleValues] = useControls("Bubble", () => ({
    position: { value: { x: 250, y: 250 }, step: 2 },
    borderWidth: 5,
    borderColor: "#000",
    padding: 20,
    curveTightness: { value: 1, step: 0.05, min: 0.5, max: 1.5 },
  }));
  const [textLoaded, setTextLoaded] = useState(false);

  // const [tailValues, setTailValues] = useControls("Tail", () => ({
  //   position: { value: { x: 0, y: 0 } },
  //   controlPointPosition: { value: { x: 0, y: 0 } },
  // }));

  const onDragMove = useCallback(
    (e) => {
      if (isDragging) {
        container.current.position.x = e.data.global.x;
        container.current.position.y = e.data.global.y;
        // setBubbleValues({
        //   position: {
        //     x: e.data.global.x,
        //     y: e.data.global.y,
        //   },
        // });
      }
    },
    [isDragging, container]
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

  useEffect(() => {
    if (textSprite.current) {
      setTextLoaded(true);
    }
  }, [textSprite.current]);

  const drawBareBubble = useCallback(
    (g) => {
      if (!textSprite.current) return;
      const padding = bubbleValues?.padding;
      const curveTightness = bubbleValues?.curveTightness;
      const color = "white";

      const height = textSprite.current.height;
      const width = textSprite.current.width;

      const point1 = {
        x: 0 - padding,
        y: height * 0.5,
      };

      const point2 = {
        x: width * 0.5,
        y: 0 - padding,
        controlPoints: {
          point1: {
            x: point1.x,
            y: height * (1 - curveTightness),
          },
          point2: {
            x: width * (1 - curveTightness),
            y: 0 - padding,
          },
        },
      };

      const point3 = {
        x: width + padding,
        y: height * 0.5,
        controlPoints: {
          point1: {
            x: width * curveTightness,
            y: 0 - padding,
          },
          point2: {
            x: width + padding,
            y: height * (1 - curveTightness),
          },
        },
      };

      const point4 = {
        x: width * 0.5,
        y: height + padding,
        controlPoints: {
          point1: {
            x: width + padding,
            y: height * curveTightness,
          },
          point2: {
            x: width * curveTightness,
            y: height + padding,
          },
        },
      };

      const point5 = {
        x: 0 - padding,
        y: height * 0.5,
        controlPoints: {
          point1: {
            x: width * (1 - curveTightness),
            y: height + padding,
          },
          point2: {
            x: 0 - padding,
            y: height * curveTightness,
          },
        },
      };
      // Create the bubble's fill
      g.clear();
      g.beginFill(color);
      // g.drawCircle(point1.x, point1.y, 8);
      // g.drawCircle(point2.x, point2.y, 8);
      // g.drawCircle(point3.x, point3.y, 8);
      // g.drawCircle(point4.x, point4.y, 8);
      // g.drawCircle(point5.x, point5.y, 8);

      g.moveTo(point1.x, point1.y);
      g.bezierCurveTo(
        point2.controlPoints.point1.x,
        point2.controlPoints.point1.y,
        point2.controlPoints.point2.x,
        point2.controlPoints.point2.y,
        point2.x,
        point2.y
      );
      g.bezierCurveTo(
        point3.controlPoints.point1.x,
        point3.controlPoints.point1.y,
        point3.controlPoints.point2.x,
        point3.controlPoints.point2.y,
        point3.x,
        point3.y
      );
      g.bezierCurveTo(
        point4.controlPoints.point1.x,
        point4.controlPoints.point1.y,
        point4.controlPoints.point2.x,
        point4.controlPoints.point2.y,
        point4.x,
        point4.y
      );
      g.bezierCurveTo(
        point5.controlPoints.point1.x,
        point5.controlPoints.point1.y,
        point5.controlPoints.point2.x,
        point5.controlPoints.point2.y,
        point5.x,
        point5.y
      );
      g.endFill();
    },
    [textLoaded, textSprite.current, bubbleValues, textValues?.text]
  );

  const drawBlackBubble = useCallback(
    (g) => {
      if (!textSprite.current) return;
      const padding = bubbleValues?.padding;
      const curveTightness = bubbleValues?.curveTightness;
      const color = "black";

      const height = textSprite.current.height;
      const width = textSprite.current.width;

      const point1 = {
        x: 0 - padding,
        y: height * 0.5,
      };

      const point2 = {
        x: width * 0.5,
        y: 0 - padding,
        controlPoints: {
          point1: {
            x: point1.x,
            y: height * (1 - curveTightness),
          },
          point2: {
            x: width * (1 - curveTightness),
            y: 0 - padding,
          },
        },
      };

      const point3 = {
        x: width + padding,
        y: height * 0.5,
        controlPoints: {
          point1: {
            x: width * curveTightness,
            y: 0 - padding,
          },
          point2: {
            x: width + padding,
            y: height * (1 - curveTightness),
          },
        },
      };

      const point4 = {
        x: width * 0.5,
        y: height + padding,
        controlPoints: {
          point1: {
            x: width + padding,
            y: height * curveTightness,
          },
          point2: {
            x: width * curveTightness,
            y: height + padding,
          },
        },
      };

      const point5 = {
        x: 0 - padding,
        y: height * 0.5,
        controlPoints: {
          point1: {
            x: width * (1 - curveTightness),
            y: height + padding,
          },
          point2: {
            x: 0 - padding,
            y: height * curveTightness,
          },
        },
      };
      // Create the bubble's fill
      g.clear();
      g.beginFill(color);
      g.lineStyle({
        width: bubbleValues?.borderWidth,
        color: bubbleValues?.borderColor,
        alignment: 1,
      });
      // g.drawCircle(point1.x, point1.y, 8);
      // g.drawCircle(point2.x, point2.y, 8);
      // g.drawCircle(point3.x, point3.y, 8);
      // g.drawCircle(point4.x, point4.y, 8);
      // g.drawCircle(point5.x, point5.y, 8);

      g.moveTo(point1.x, point1.y);
      g.bezierCurveTo(
        point2.controlPoints.point1.x,
        point2.controlPoints.point1.y,
        point2.controlPoints.point2.x,
        point2.controlPoints.point2.y,
        point2.x,
        point2.y
      );
      g.bezierCurveTo(
        point3.controlPoints.point1.x,
        point3.controlPoints.point1.y,
        point3.controlPoints.point2.x,
        point3.controlPoints.point2.y,
        point3.x,
        point3.y
      );
      g.bezierCurveTo(
        point4.controlPoints.point1.x,
        point4.controlPoints.point1.y,
        point4.controlPoints.point2.x,
        point4.controlPoints.point2.y,
        point4.x,
        point4.y
      );
      g.bezierCurveTo(
        point5.controlPoints.point1.x,
        point5.controlPoints.point1.y,
        point5.controlPoints.point2.x,
        point5.controlPoints.point2.y,
        point5.x,
        point5.y
      );
      g.endFill();
    },
    [textLoaded, textSprite.current, bubbleValues, textValues?.text]
  );

  useEffect(() => {
    if (bubbleValues?.position) {
      container.current.position.x = bubbleValues?.position?.x;
      container.current.position.y = bubbleValues?.position?.y;
    }
  }, [bubbleValues?.position]);

  return (
    <Container eventMode="static" pointermove={onDragMove} hitArea={app.screen}>
      <Container
        ref={container}
        // position={bubbleValues?.position}
        cursor="pointer"
        pointerdown={onDragStart}
        pointerup={onDragEnd}
        eventMode="static"
        alpha={isDragging ? 0.5 : 1}
        pivot={{
          x: textSprite?.current?.width / 2,
          y: textSprite?.current?.height / 2,
        }}
      >
        <Graphics draw={drawBlackBubble} />
        <Graphics draw={drawBareBubble} />
        <HtmlText
          ref={textSprite}
          text={textValues?.text}
          style={
            new TextStyle({
              fill: textValues?.fontColor,
              fontSize: textValues?.fontSize || 20,
              fontFamily: "Anime Ace",
              align: "center",
            })
          }
        />
      </Container>
    </Container>
  );
}

export default withPixiApp(TestBed);

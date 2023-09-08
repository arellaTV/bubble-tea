import { useControls } from "leva";
import { Container, Graphics, useApp, withPixiApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HtmlText from "./HtmlText";
import { listFonts } from "../utils/fonts";
import { Bezier } from "bezier-js";
import debounce from "lodash.debounce";

function Bubble() {
  const app = useApp();
  const container = useRef();
  const textSprite = useRef();
  const secondTextSprite = useRef();
  const [isDraggingBubble, setIsDraggingBubble] = useState(false);
  const [isDraggingTail, setIsDraggingTail] = useState(false);
  const [isDraggingTailMidPoint, setIsDraggingTailMidPoint] = useState(false);
  const [fontFamilies, setFontFamilies] = useState([]);
  const [areControlPointsVisible, setAreControlPointsVisible] = useState(false);
  const [textValues] = useControls("Text", () => ({
    text: {
      value: "Hello\nWorld",
      rows: true,
    },
    fontFamily: {
      value: "Anime Ace",
      options: ["Adam Warren Pro", "Arial", "Anime Ace", "Komika Hand"],
    },
    fontSize: 20,
    fontColor: "#000",
  }));
  const [bubbleValues, setBubbleValues] = useControls("Bubble", () => ({
    position: { value: { x: 550, y: 275 }, step: 2 },
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#000",
    padding: 20,
    curveTightness: {
      value: 1,
      step: 0.05,
      min: 0.5,
      max: 1.5,
    },
    heightOffset: { value: 0.8, step: 0.05, min: 0 },
  }));
  const [secondBubbleValues, setSecondBubbleValues] = useControls(
    "Second Bubble",
    () => ({
      position: { value: { x: 550, y: 275 }, step: 2 },
    })
  );
  const [textLoaded, setTextLoaded] = useState(false);
  const [instanceWidth, setInstanceWidth] = useState(0);

  const [tailValues, setTailValues] = useControls("Tail", () => ({
    position: { value: { x: 450, y: 250 }, step: 1 },
    controlPointPosition: { value: { x: 500, y: 225 } },
    baseWidth: 10,
    tipWidth: 0,
  }));

  const onDragMove = useMemo(
    () =>
      debounce((e) => {
        if (isDraggingBubble) {
          setBubbleValues({
            position: {
              x: e.data.global.x,
              y: e.data.global.y,
            },
          });
        }
        if (isDraggingTail) {
          setAreControlPointsVisible(true);
          setTailValues({
            position: {
              x: e.data.global.x,
              y: e.data.global.y,
            },
          });
        }
        if (isDraggingTailMidPoint) {
          setAreControlPointsVisible(true);
          setTailValues({
            controlPointPosition: {
              x: e.data.global.x,
              y: e.data.global.y,
            },
          });
        }
      }, 10),
    [isDraggingBubble, isDraggingTail, isDraggingTailMidPoint, container]
  );

  const onDragStart = useCallback(() => {
    setIsDraggingBubble(true);
  }, []);

  const onDragTailStart = useCallback(() => {
    setIsDraggingTail(true);
  }, []);

  const onDragTailMidPointStart = useCallback(() => {
    setIsDraggingTailMidPoint(true);
  }, []);

  const onDragEnd = useCallback((e) => {
    setIsDraggingBubble(false);
    setBubbleValues({
      position: {
        x: e.data.global.x,
        y: e.data.global.y,
      },
    });
  }, []);

  const onDragTailEnd = useCallback((e) => {
    setIsDraggingTail(false);
    setTailValues({
      position: {
        x: e.data.global.x,
        y: e.data.global.y,
      },
    });
  }, []);

  const onDragTailMidPointEnd = useCallback((e) => {
    setIsDraggingTailMidPoint(false);
    setTailValues({
      controlPointPosition: {
        x: e.data.global.x,
        y: e.data.global.y,
      },
    });
  }, []);

  useEffect(() => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }, [app]);

  useEffect(() => {
    if (textSprite.current) {
      textSprite.current.on("fontLoaded", async () => {
        setTextLoaded(true);
      });

      textSprite.current.on("appliedProps", (instance) => {
        setInstanceWidth(instance.width);
      });
    }
  }, [textSprite.current]);

  const drawBareBubble = useCallback(
    async (g, sprite) => {
      if (!textLoaded) return;
      if (!sprite.current) return;
      const padding = bubbleValues?.padding;
      const paddingLeft = bubbleValues?.paddingLeft || padding;
      const paddingTop = bubbleValues?.paddingTop || padding;
      const paddingRight = bubbleValues?.paddingRight || padding;
      const paddingBottom = bubbleValues?.paddingBottom || padding;
      const curveTightness = bubbleValues?.curveTightness;
      const color = bubbleValues?.backgroundColor;

      const height = sprite.current.height * bubbleValues?.heightOffset;
      const width = sprite.current.width;

      const point1 = {
        x: 0 - paddingLeft,
        y: height * 0.5,
      };

      const point2 = {
        x: width * 0.5,
        y: 0 - paddingTop,
        controlPoints: {
          point1: {
            x: point1.x,
            y: height * (1 - curveTightness),
          },
          point2: {
            x: width * (1 - curveTightness),
            y: 0 - paddingTop,
          },
        },
      };

      const point3 = {
        x: width + padding,
        y: height * 0.5,
        controlPoints: {
          point1: {
            x: width * curveTightness,
            y: 0 - paddingTop,
          },
          point2: {
            x: width + paddingRight,
            y: height * (1 - curveTightness),
          },
        },
      };

      const point4 = {
        x: width * 0.5,
        y: height + padding,
        controlPoints: {
          point1: {
            x: width + paddingRight,
            y: height * curveTightness,
          },
          point2: {
            x: width * curveTightness,
            y: height + paddingBottom,
          },
        },
      };

      const point5 = {
        x: 0 - padding,
        y: height * 0.5,
        controlPoints: {
          point1: {
            x: width * (1 - curveTightness),
            y: height + paddingBottom,
          },
          point2: {
            x: 0 - paddingLeft,
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
      g.closePath();
      g.endFill();
    },
    [textLoaded, textSprite.current, bubbleValues, textValues, instanceWidth]
  );

  const drawBlackBubble = useCallback(
    (g, sprite) => {
      if (!textLoaded) return;
      if (!sprite.current) return;
      const padding = bubbleValues?.padding;
      const paddingLeft = bubbleValues?.paddingLeft || padding;
      const paddingTop = bubbleValues?.paddingTop || padding;
      const paddingRight = bubbleValues?.paddingRight || padding;
      const paddingBottom = bubbleValues?.paddingBottom || padding;
      const curveTightness = bubbleValues?.curveTightness;
      const color = bubbleValues?.backgroundColor;

      const height = sprite.current.height * bubbleValues?.heightOffset;
      const width = sprite.current.width;

      const point1 = {
        x: 0 - paddingLeft,
        y: height * 0.5,
      };

      const point2 = {
        x: width * 0.5,
        y: 0 - paddingTop,
        controlPoints: {
          point1: {
            x: point1.x,
            y: height * (1 - curveTightness),
          },
          point2: {
            x: width * (1 - curveTightness),
            y: 0 - paddingTop,
          },
        },
      };

      const point3 = {
        x: width + padding,
        y: height * 0.5,
        controlPoints: {
          point1: {
            x: width * curveTightness,
            y: 0 - paddingTop,
          },
          point2: {
            x: width + paddingRight,
            y: height * (1 - curveTightness),
          },
        },
      };

      const point4 = {
        x: width * 0.5,
        y: height + padding,
        controlPoints: {
          point1: {
            x: width + paddingRight,
            y: height * curveTightness,
          },
          point2: {
            x: width * curveTightness,
            y: height + paddingBottom,
          },
        },
      };

      const point5 = {
        x: 0 - padding,
        y: height * 0.5,
        controlPoints: {
          point1: {
            x: width * (1 - curveTightness),
            y: height + paddingBottom,
          },
          point2: {
            x: 0 - paddingLeft,
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
      g.closePath();
      g.endFill();
    },
    [textLoaded, textSprite.current, bubbleValues, textValues, instanceWidth]
  );

  const drawTail = useCallback(
    (g) => {
      if (!textLoaded) return;
      if (!textSprite.current) return;
      const height = textSprite.current.height * bubbleValues?.heightOffset;
      const width = textSprite.current.width;

      const textContainerCenter = {
        x: width / 2,
        y: height / 2,
      };

      // Calculate quadratic bezier line shape
      const curve = new Bezier(
        tailValues.position.x - (bubbleValues?.position.x - width / 2),
        tailValues.position.y - (bubbleValues?.position.y - height / 2),
        tailValues.controlPointPosition.x -
          (bubbleValues?.position.x - width / 2),
        tailValues.controlPointPosition.y -
          (bubbleValues?.position.y - height / 2),
        textContainerCenter.x,
        textContainerCenter.y
      );
      const outline = curve.outline(
        tailValues.tipWidth,
        tailValues.tipWidth,
        tailValues.baseWidth,
        tailValues.baseWidth
      );

      const color = bubbleValues?.backgroundColor;
      g.clear();
      g.beginFill(color);
      g.lineStyle({
        width: bubbleValues?.borderWidth,
        color: bubbleValues?.borderColor,
        alignment: 0.5,
        // join: PIXI.LINE_JOIN.ROUND,
        cap: PIXI.LINE_CAP.SQUARE,
        // cap: "SQUARE",
      });
      for (let i = 0; i < outline.curves.length; i++) {
        const outlineCurve = outline.curves[i];
        const p = outlineCurve.points;
        if (i === 0) {
          g.moveTo(p[0].x, p[0].y);
        }
        if (p.length === 3) {
          g.quadraticCurveTo(p[1].x, p[1].y, p[2].x, p[2].y);
        }
        if (p.length === 4) {
          g.bezierCurveTo(p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
        }
      }
      // g.closePath();
      g.endFill();
    },
    [
      textLoaded,
      textSprite.current,
      bubbleValues,
      textValues,
      tailValues,
      instanceWidth,
    ]
  );

  const drawTailPoint = useCallback(
    (g) => {
      if (!textLoaded) return;
      if (!textSprite.current) return;
      g.clear();
      g.beginFill("rgba(0,0,0,0.1)");
      g.lineStyle({
        width: 2,
        color: "black",
      });
      g.drawCircle(
        tailValues.position.x - 2.5,
        tailValues.position.y - 7.5,
        10
      );
      g.endFill();
    },
    [
      textLoaded,
      textSprite.current,
      bubbleValues,
      textValues,
      tailValues,
      instanceWidth,
    ]
  );

  const drawTailMidPoint = useCallback(
    (g) => {
      if (!textLoaded) return;
      if (!textSprite.current) return;

      g.clear();
      g.beginFill("rgba(0,0,0,0.1)");
      g.lineStyle({
        width: 2,
        color: "black",
      });
      g.drawCircle(
        tailValues.controlPointPosition.x - 2.5,
        tailValues.controlPointPosition.y - 7.5,
        10
      );
      g.endFill();
    },
    [
      textLoaded,
      textSprite.current,
      bubbleValues,
      textValues,
      tailValues,
      instanceWidth,
    ]
  );

  useEffect(() => {
    if (bubbleValues?.position) {
      container.current.position.x = bubbleValues?.position?.x;
      container.current.position.y = bubbleValues?.position?.y;
    }
  }, [bubbleValues?.position]);

  const getFonts = async () => {
    const fonts = await listFonts();
    setFontFamilies(fonts);
  };

  useEffect(() => {
    getFonts();
  }, []);

  return (
    <Container eventMode="static" pointermove={onDragMove} hitArea={app.screen}>
      <Container
        pointerover={debounce(() => setAreControlPointsVisible(true), 10)}
        pointerout={debounce(() => setAreControlPointsVisible(false), 50)}
        eventMode="static"
      >
        <Container
          ref={container}
          cursor="pointer"
          pointerdown={onDragStart}
          pointerup={onDragEnd}
          eventMode="static"
          pivot={{
            x: textSprite?.current?.width / 2,
            y: textSprite?.current?.height / 2,
          }}
          // filters={[new OutlineFilter(2, 0x000000, 1, 1)]}
        >
          <Graphics draw={(g) => drawBlackBubble(g, textSprite)} />
          <Graphics
            draw={(g) => drawBlackBubble(g, secondTextSprite)}
            x={100}
            y={30}
          />
          <Graphics draw={drawTail} />
          <Graphics draw={(g) => drawBareBubble(g, textSprite)} />
          <Graphics
            draw={(g) => drawBareBubble(g, secondTextSprite)}
            x={100}
            y={30}
          />
          <HtmlText
            ref={textSprite}
            text={textValues?.text?.replaceAll("\n", "<br />")}
            style={
              new PIXI.HTMLTextStyle({
                fill: textValues?.fontColor,
                fontSize: textValues?.fontSize || 20,
                fontFamily: textValues?.fontFamily || "Anime Ace",
                align: "center",
              })
            }
          />
          <HtmlText
            ref={secondTextSprite}
            text={"This is<br />the second<br />bubble.<br />"}
            x={100}
            y={30}
            style={
              new PIXI.HTMLTextStyle({
                fill: textValues?.fontColor,
                fontSize: textValues?.fontSize || 20,
                fontFamily: textValues?.fontFamily || "Anime Ace",
                align: "center",
              })
            }
          />
        </Container>
        <Graphics
          draw={drawTailPoint}
          pointerdown={onDragTailStart}
          pointerup={onDragTailEnd}
          cursor="pointer"
          eventMode="static"
          alpha={areControlPointsVisible ? 1 : 0}
        />
        <Graphics
          draw={drawTailMidPoint}
          pointerdown={onDragTailMidPointStart}
          pointerup={onDragTailMidPointEnd}
          cursor="pointer"
          eventMode="static"
          alpha={areControlPointsVisible ? 1 : 0}
        />
      </Container>
    </Container>
  );
}

export default withPixiApp(Bubble);

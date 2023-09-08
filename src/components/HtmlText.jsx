import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { HTMLText } from "pixi.js";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const HTMLTextComponent = PixiComponent("HTMLText", {
  create: ({ text, style }) => {
    // instantiate something and return it.
    // for instance:
    return new HTMLText(text, style);
  },
  didMount: async (instance) => {
    // apply custom logic on mount
    // console.log("mounting");
    await instance.style.loadFont("./animeace2_reg.ttf", {
      family: "Anime Ace",
    });
    await instance.style.loadFont("./komika.hand.ttf", {
      family: "Komika Hand",
    });
    await instance.style.loadFont("./adam-warren-pro.regular.ttf", {
      family: "Adam Warren Pro",
    });
    instance.emit("fontLoaded", instance);
  },
  willUnmount: () => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    const { ...oldP } = oldProps;
    const { ...newP } = newProps;

    const fonts = instance.style._fonts;
    // apply rest props to PIXI.Text
    applyDefaultProps(instance, oldP, newP);
    instance.style._fonts = fonts;
    instance.emit("appliedProps", instance);
  },
  config: {
    // destroy instance on unmount?
    // default true
    destroy: true,

    /// destroy its children on unmount?
    // default true
    destroyChildren: true,
  },
});

export default HTMLTextComponent;

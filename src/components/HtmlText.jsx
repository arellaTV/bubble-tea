import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { HTMLText, HTMLTextStyle } from "pixi.js";

export default PixiComponent("HTMLText", {
  create: ({ text, style }) => {
    // instantiate something and return it.
    // for instance:
    return new HTMLText(text, style);
  },
  didMount: async (instance, parent) => {
    // apply custom logic on mount
    console.log("mounting");
    instance.visible = false;
    await instance.style.loadFont("./animeace2_reg.ttf", {
      family: "Anime Ace",
    });
    instance.visible = true;
  },
  willUnmount: (instance, parent) => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    const { ...oldP } = oldProps;
    const { ...newP } = newProps;

    const fonts = instance.style._fonts;
    // apply rest props to PIXI.Text
    applyDefaultProps(instance, oldP, newP);
    instance.style._fonts = fonts;
  },
  config: {
    // destroy instance on unmount?
    // default true
    destroy: false,

    /// destroy its children on unmount?
    // default true
    destroyChildren: false,
  },
});

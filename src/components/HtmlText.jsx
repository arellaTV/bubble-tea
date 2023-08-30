import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { HTMLText } from "pixi.js";

export default PixiComponent("HTMLText", {
  create: ({ text, style }) => {
    // instantiate something and return it.
    // for instance:
    return new HTMLText(text, style);
  },
  didMount: (instance, parent) => {
    // apply custom logic on mount
  },
  willUnmount: (instance, parent) => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    const { ...oldP } = oldProps;
    const { ...newP } = newProps;

    // apply rest props to PIXI.Text
    applyDefaultProps(instance, oldP, newP);
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

import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { Container, HTMLText } from "pixi.js";

const Bubble = PixiComponent("HTMLText", {
  create: (props) => {
    return new Container(props);
  },
  didMount: async (instance) => {
    // apply custom logic on mount
    console.log("mounting");
    console.log({ instance });
  },
  willUnmount: () => {
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

export default Bubble;

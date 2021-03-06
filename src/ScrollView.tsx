/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { useGestureResponder } from "react-gesture-responder";
import { getDirection } from "./Sheet";
import { useSpring, SpringConfig } from "react-spring";

export interface ScrollViewHandles {
  ref: React.RefObject<HTMLDivElement>;
  scrollTo(x?: number, y?: number): void;
}

export interface ScrollViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** enable overflow-y scrolling */
  overflowY?: boolean;
  /** enable overflow-x scrolling */
  overflowX?: boolean;
  /** spring animation configuration */
  scrollAnimationConfig?: SpringConfig;
}

/**
 * A scroll view with some helpers, including:
 *  - smooth scrolling
 *  - gesture claiming
 * @param param0
 * @param componentRef
 */

const ScrollViewForward: React.RefForwardingComponent<
  ScrollViewHandles,
  ScrollViewProps
> = (
  {
    overflowY,
    children,
    overflowX,
    scrollAnimationConfig = { tension: 190, friction: 15, mass: 0.2 },
    ...other
  },
  componentRef
) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const initialDirection = React.useRef<"vertical" | "horizontal" | null>(null);

  /**
   * A spring for animating scroll positions
   */

  const [, setScroll] = useSpring(() => {
    return {
      config: scrollAnimationConfig,
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 },
      onFrame: (animated: any) => {
        if (overflowX) {
          ref.current!.scrollLeft = animated.x;
        }

        if (overflowY) {
          ref.current!.scrollTop = animated.y;
        }
      }
    };
  });

  /**
   * Expose an imperate scrollTo method
   */

  React.useImperativeHandle(
    componentRef,
    () => ({
      ref,
      scrollTo: (x?: number, y?: number) => {
        const from = {
          x: ref.current!.scrollLeft,
          y: ref.current!.scrollTop
        };

        setScroll({
          from,
          to: { x, y },
          reset: true
        });
      }
    }),
    [ref]
  );

  /**
   * Use a pan responder to determine if our scrollview should
   * claim the responder (and cancel other gestures out). Only
   * enabled on touch devices.
   */

  const { bind } = useGestureResponder(
    {
      onStartShouldSet: () => {
        initialDirection.current = null;
        return false;
      },
      onTerminationRequest: () => false, // once we claim it, we keep it
      onMoveShouldSet: ({ initial, xy }) => {
        const gestureDirection =
          initialDirection.current || getDirection(initial, xy);

        if (!initialDirection.current) {
          initialDirection.current = gestureDirection;
        }

        if (gestureDirection === "horizontal" && overflowX) {
          return true;
        }

        if (gestureDirection === "vertical" && overflowY) {
          return true;
        }

        return false;
      }
    },
    {
      enableMouse: false
    }
  );

  return (
    <div {...bind}>
      <div
        ref={ref}
        css={{
          transform: "translateZ(0)",
          overflowX: overflowX ? "scroll" : undefined,
          overflowY: overflowY ? "scroll" : undefined,
          WebkitOverflowScrolling: "touch"
        }}
        {...other}
      >
        {children}
      </div>
    </div>
  );
};

export const ScrollView = React.forwardRef(ScrollViewForward);

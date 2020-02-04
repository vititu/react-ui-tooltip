import React, { CSSProperties } from "react";
import ReactDOM from "react-dom";

export type TooltipProps = {
  label: string;
};

export type TooltipBoxProps = {
  tooltipId: number;
  position: MousePosState;
} & TooltipProps;

export type MousePosState = {
  x: number;
  y: number;
};

export type PoolType = {
  pool: number[];
  addToPool: (id: number) => void;
  removeFromPool: (id: number) => void;
};

let id = 0;
const GAP = 20;
const BASE_STYLE: CSSProperties = {
  position: "absolute",
  zIndex: 1
};
const BODY = document.getElementsByTagName("body")[0];

const generateId = () => id++;

// The tooltips pool is only for trackig if a tooltip has
// recently been active. This probably a bad idea. :-)
const tooltipsPool: PoolType = {
  pool: [],
  addToPool(id) {
    const index = this.pool.indexOf(id);

    if (index === -1) {
      this.pool.push(id);
    }
  },
  removeFromPool(id: number) {
    const index = this.pool.indexOf(id);

    if (index !== -1) {
      this.pool.splice(this.pool.indexOf(id), 1);
    }
  }
};

const TooltipBox: React.FC<TooltipBoxProps &
  React.HTMLAttributes<HTMLDivElement>> = props => {
  const { position, label, tooltipId, style, ...rest } = props;
  const xPos = React.useRef(position.x);
  const yPos = React.useRef(position.y);

  return (
    <div
      data-react-ui-tooltip="true"
      id={`tooltip-${tooltipId}`}
      role="tooltip"
      style={{
        ...BASE_STYLE,
        ...style,
        left: xPos.current,
        top: yPos.current + GAP
      }}
      {...rest}
    >
      {label}
    </div>
  );
};

const Tooltip: React.FC<TooltipProps &
  React.HTMLAttributes<HTMLDivElement>> = props => {
  const [active, toggleActive] = React.useState(false);
  const mousePosition = React.useRef({ x: 0, y: 0 });
  const enterTimeout = React.useRef<number>();
  const leaveTimeout = React.useRef<number>();
  const restTimeout = React.useRef<number>();
  const id = React.useRef(generateId());

  const { children, label, ...rest } = props;
  const child = React.Children.only(children) as any;

  const startEnterTimer = (timer = 700) => {
    window.clearTimeout(enterTimeout.current);
    window.clearTimeout(leaveTimeout.current);
    window.clearTimeout(restTimeout.current);

    enterTimeout.current = window.setTimeout(() => {
      tooltipsPool.addToPool(id.current);
      toggleActive(true);
    }, timer);
  };

  const startLeaveTimer = (leaveTimer = 100, restTimer = 400) => {
    window.clearTimeout(enterTimeout.current);
    window.clearTimeout(leaveTimeout.current);
    window.clearTimeout(restTimeout.current);

    restTimeout.current = window.setTimeout(() => {
      tooltipsPool.removeFromPool(id.current);
    }, restTimer);

    leaveTimeout.current = window.setTimeout(() => {
      toggleActive(false);
    }, leaveTimer);
  };

  const triggerMouseMove = (e: MouseEvent) => {
    child.props.onMouseMove && child.props.onMouseMove(e);

    if (tooltipsPool.pool.length <= 0) {
      startEnterTimer();
    } else {
      startEnterTimer(100);
    }

    if (!active) {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const triggerMouseLeave = (e: MouseEvent) => {
    child.props.onMouseLeave && child.props.onMouseLeave(e);
    startLeaveTimer();
  };

  const triggerMouseDown = (e: MouseEvent) => {
    child.props.onMouseMove && child.props.onMouseDown(e);

    window.clearTimeout(enterTimeout.current);
    window.clearTimeout(leaveTimeout.current);
    window.clearTimeout(restTimeout.current);

    tooltipsPool.removeFromPool(id.current);
    toggleActive(false);
  };

  React.useEffect(() => {
    function escapeListener(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Esc") {
        startLeaveTimer(0, 0);
      }
    }
    document.addEventListener("keydown", escapeListener);

    return () => document.removeEventListener("keydown", escapeListener);
  }, []);

  return (
    <>
      {React.cloneElement(child, {
        onMouseMove: triggerMouseMove,
        onMouseLeave: triggerMouseLeave,
        onMouseDown: triggerMouseDown
      })}
      {active
        ? ReactDOM.createPortal(
            <TooltipBox
              tooltipId={id.current}
              label={label}
              position={mousePosition.current}
              {...rest}
            />,
            BODY
          )
        : null}
    </>
  );
};

export default Tooltip;

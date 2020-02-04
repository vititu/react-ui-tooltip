# react-ui-tooltip
A React component tooltip that shows below cursor, just like Chrome or Firefox.

## Getting Started:
```
yarn add react-ui-tooltip
```

## Usage:
You can optionally import a basic css.
```jsx
import Tooltip from "react-ui-tooltip";
import "react-ui-tooltip/dist/styles.css";

function Component() {
  return (
    <Tooltip label="Hi, I'm a Tooltip!">
      <div>Hi', I'm just a regular "div"</div>
    </Tooltip>
  )
}
```

## Styling:
You can also style with CSS using the data property like:
```jsx
[data-react-ui-tooltip] {
  background: #201f1f;
  color: #ffffff;
}
```

Or just use "style", "className" or even CSS-in-JS:
```jsx
import Tooltip from "react-ui-tooltip";
import style from "styled-components";
import "react-ui-tooltip/dist/styles.css";

const StyledTooltip = styled(Tooltip)`
  background: #201f1f;
  color: #ffffff;
`

function Component() {
  return (
    <StyledTooltip label="Hi, I'm a Tooltip!">
      <div>Hi', I'm just a regular "div"</div>
    </StyledTooltip>
  )
}
```
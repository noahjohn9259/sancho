/** @jsx jsx */
/** Do not edit this file directly. Edit the template in generate-icons.js **/
import { jsx } from "@emotion/core";
import * as React from "react";
import PropTypes from "prop-types";
import { IconProps } from "../IconTypes";
import { useTheme } from "../../Theme/Providers";

export const IconPrinter: React.FunctionComponent<IconProps> = ({
  size = "md",
  color,
  ...otherProps
}) => {
  const theme = useTheme();
  const width = typeof size == "string" ? theme.iconSizes[size] : size;
  const stroke = color || theme.colors.text.default;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
};

IconPrinter.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
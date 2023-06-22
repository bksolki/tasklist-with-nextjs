import { theme } from "@chakra-ui/react";

const customTheme = {
  ...theme,
  radii: {
    ...theme.radii,
    sm: "1px",
    md: "3px",
    lg: "6px",
  },
  colors: {
    ...theme.colors,
    primary: {
      500: "#004EFF",
    },
    green: {
      ...theme.colors.green,
      450: "#5fd309",
    },
  },
  sizes: {
    ...theme.sizes,
    semifull: "95%",
    icon: {
      xs: "16px",
      sm: "20px",
      md: "24px",
      lg: "28px",
    },
  },
  gap: {
    xs: "4px",
    sm: "8px",
    md: "16px",
  },
  backgroundColor: "#000",
};

export { customTheme };

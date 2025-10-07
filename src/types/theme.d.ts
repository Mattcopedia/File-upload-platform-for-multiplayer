// theme.d.ts or types/mui.d.ts
import '@mui/material/Paper';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    tableWrapper: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    soft: true;
  }

  interface ChipOwnProps {
    rounded?: boolean;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    delete: true;
  }
}

export interface SideBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

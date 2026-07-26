import type { ReactNode } from "react";
import "./StatTile.css";

interface StatTileProps {
  label: string;
  value: string;
  sublabel?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function StatTile({ label, value, sublabel, icon, action }: StatTileProps) {
  return (
    <div className="card stat-tile">
      <div className="stat-tile-header">
        <span className="stat-tile-label">
          {icon && <span className="stat-tile-icon">{icon}</span>}
          {label}
        </span>
        {action}
      </div>
      <span className="stat-tile-value">{value}</span>
      {sublabel && <span className="stat-tile-sublabel">{sublabel}</span>}
    </div>
  );
}

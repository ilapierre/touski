import "./SideDrawer.css";
import { createPortal } from "react-dom";

export default function SideDrawer({ children }) {
  return createPortal(
    <aside className="side-drawer">{children}</aside>,
    document.getElementById("drawer"),
  );
}

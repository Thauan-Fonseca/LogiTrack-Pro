import { useNavigate } from "react-router-dom";
import { authStorage } from "../api/authStorage";
import "./LogoutButton.css";

export default function LogoutButton() {
  const navigate = useNavigate();

  function sair() {
    authStorage.clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <button type="button" className="logout-button" onClick={sair} aria-label="Sair" title="Sair">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
      <span>Sair</span>
    </button>
  );
}

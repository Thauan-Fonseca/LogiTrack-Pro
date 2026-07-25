import { useEffect, useRef, useState } from "react";
import "./DateTimeField.css";

interface DateTimeFieldProps {
  value: string; // "" ou "YYYY-MM-DDTHH:mm"
  onChange: (value: string) => void;
  placeholder?: string;
}

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseValue(value: string) {
  if (!value) return { day: null as Date | null, hh: "08", mm: "00" };
  const [datePart, timePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = (timePart ?? "08:00").split(":");
  return { day: new Date(y, m - 1, d), hh, mm };
}

function formatValue(day: Date, hh: string, mm: string) {
  return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}T${hh}:${mm}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export default function DateTimeField({ value, onChange, placeholder = "Selecionar data" }: DateTimeFieldProps) {
  const parsed = parseValue(value);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => parsed.day ?? new Date());
  const [hh, setHh] = useState(parsed.hh);
  const [mm, setMm] = useState(parsed.mm);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function aoPressionarEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPressionarEsc);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPressionarEsc);
    };
  }, []);

  function abrir() {
    setCursor(parsed.day ?? new Date());
    setHh(parsed.hh);
    setMm(parsed.mm);
    setOpen(true);
  }

  function selecionarDia(dia: Date) {
    onChange(formatValue(dia, hh, mm));
  }

  function alterarHora(novoHh: string, novoMm: string) {
    setHh(novoHh);
    setMm(novoMm);
    if (parsed.day) onChange(formatValue(parsed.day, novoHh, novoMm));
  }

  const dias = buildMonthGrid(cursor.getFullYear(), cursor.getMonth());
  const hoje = new Date();
  const label = parsed.day
    ? `${pad(parsed.day.getDate())}/${pad(parsed.day.getMonth() + 1)}/${parsed.day.getFullYear()} ${parsed.hh}:${parsed.mm}`
    : "";

  return (
    <div className="datetime-field" ref={rootRef}>
      <button type="button" className="datetime-trigger" onClick={() => (open ? setOpen(false) : abrir())}>
        <span className={label ? "" : "datetime-placeholder"}>{label || placeholder}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      {open && (
        <div className="datetime-popover">
          <div className="datetime-nav">
            <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Mês anterior">
              ‹
            </button>
            <span>{MESES[cursor.getMonth()]} {cursor.getFullYear()}</span>
            <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Próximo mês">
              ›
            </button>
          </div>

          <div className="datetime-weekdays">
            {DIAS_SEMANA.map((d, i) => <span key={i}>{d}</span>)}
          </div>

          <div className="datetime-grid">
            {dias.map((dia) => {
              const foraDoMes = dia.getMonth() !== cursor.getMonth();
              const selecionado = parsed.day != null && isSameDay(dia, parsed.day);
              const ehHoje = isSameDay(dia, hoje);
              return (
                <button
                  type="button"
                  key={dia.toISOString()}
                  className={[
                    "datetime-day",
                    foraDoMes ? "outro-mes" : "",
                    selecionado ? "selecionado" : "",
                    ehHoje && !selecionado ? "hoje" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => selecionarDia(dia)}
                >
                  {dia.getDate()}
                </button>
              );
            })}
          </div>

          <div className="datetime-time-row">
            <label htmlFor="datetime-hora">Hora</label>
            <input
              id="datetime-hora"
              type="time"
              value={`${hh}:${mm}`}
              onChange={(e) => {
                const [novoHh, novoMm] = e.target.value.split(":");
                alterarHora(novoHh, novoMm);
              }}
            />
          </div>

          <div className="datetime-footer">
            {value && (
              <button type="button" className="datetime-clear" onClick={() => { onChange(""); setOpen(false); }}>
                Limpar
              </button>
            )}
            <button type="button" className="datetime-done" onClick={() => setOpen(false)}>
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

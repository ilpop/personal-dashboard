import { useEffect, useState, useRef } from "react";
import safeStorage from "../utils/safeStorage";

export default function NotesWidget({ userEmail }) {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const hasLoaded = useRef(false);

  // 🔹 Load notes once userEmail is known
  useEffect(() => {
    if (!userEmail || hasLoaded.current) return;
    try {
      const savedNotes = safeStorage.getItem(`notes_${userEmail}`);
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        if (Array.isArray(parsed)) setNotes(parsed);
      }
      hasLoaded.current = true;
    } catch (err) {
      console.error("Error loading notes:", err);
    }
  }, [userEmail]);

  // 🔹 Save notes whenever they change (but only after first load)
  useEffect(() => {
    if (!userEmail || !hasLoaded.current) return;
    try {
      safeStorage.setItem(`notes_${userEmail}`, JSON.stringify(notes));
    } catch (err) {
      console.error("Error saving notes:", err);
    }
  }, [notes, userEmail]);

  const addNote = () => {
    if (!input.trim()) return;
    setNotes((prev) => [...prev, input.trim()]);
    setInput("");
  };

  const removeNote = (index) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        width: "100%",
        maxWidth: "400px",
        background: "#1e293b",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>📝 Notes</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a note..."
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "8px",
            border: "none",
            background: "#334155",
            color: "white",
          }}
        />
        <button
          onClick={addNote}
          style={{
            background: "#3b82f6",
            border: "none",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {notes.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No notes yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note, index) => (
            <li
              key={index}
              style={{
                background: "#334155",
                padding: "0.5rem 0.8rem",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{note}</span>
              <button
                onClick={() => removeNote(index)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://rickandmortyapi.com/api/character";

export default function App() {
  type Character = {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: {
      name: string;
      url: string;
    };
    location: {
      name: string;
      url: string;
    };
    image: string;
    episode: string[];
    url: string;
    created: string;
  }
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCharacters() {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json(); // { info, results }
        if (!cancelled) setCharacters(data.results ?? []);
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err?.message || "Error desconocido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCharacters();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Rick & Morty Characters</h1>
        <p>{API_URL}</p>
      </header>

      {loading && <p className="state">Cargando personajes...</p>}
      {!loading && errorMsg && (
        <p className="state error">Error: {errorMsg}</p>
      )}

      {!loading && !errorMsg && (
        <div className="grid">
          {characters.map((c) => (
            <article className="card" key={c.id}>
              <img className="avatar" src={c.image} alt={c.name} />
              <div className="cardBody">
                <h2 className="name">{c.name}</h2>
                <p className="meta">
                  <span className="pill">{c.status}</span>
                  <span className="pill">{c.species}</span>
                </p>
                <p className="small">
                  <strong>Origen:</strong> {c.origin?.name}
                </p>
                <p className="small">
                  <strong>Ubicación:</strong> {c.location?.name}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

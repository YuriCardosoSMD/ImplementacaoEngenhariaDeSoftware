export default function Header({ titulo, periodo }) {
  return (
    <header className="header">
      <h1>{titulo}</h1>
      <span className="periodo">{periodo}</span>
    </header>
  );
}
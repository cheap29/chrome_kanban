import BunnyMascot from "./BunnyMascot";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-text">
        <p className="eyebrow">今に集中。小さく進めよう。</p>
        <h1>今ここボード</h1>
      </div>
      <BunnyMascot size={54} />
    </header>
  );
}

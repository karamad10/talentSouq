import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className="logo" data-inverted={inverted || undefined} href="/" aria-label="TalentSouq home">
      <span className="logo-mark" aria-hidden="true"><span>T</span></span>
      <span className="logo-type">Talent<span>Souq</span></span>
    </Link>
  );
}

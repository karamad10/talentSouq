import Link from "next/link";
import { Logo } from "@/components/logo";
export default function NotFound() { return <main className="not-found"><Logo /><p className="eyebrow">404 · Off the map</p><h1>This opportunity moved on.</h1><p>The page may have changed, but there are plenty of good places to go next.</p><Link className="button button-primary" href="/jobs">Browse open roles</Link></main>; }

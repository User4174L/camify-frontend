import { redirect } from 'next/navigation';

/** Versie 1 is vervallen; /trade-in houdt de bestaande links werkend. */
export default function Page() {
  redirect('/trade-in/v2');
}

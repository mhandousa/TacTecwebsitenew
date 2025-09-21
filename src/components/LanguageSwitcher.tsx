import Link from 'next/link';
import {useRouter} from 'next/router';
const locales=[{code:'en',label:'EN'},{code:'ar',label:'AR'},{code:'pt',label:'PT'},{code:'pt-BR',label:'PT-BR'},{code:'es',label:'ES'},{code:'fr',label:'FR'},{code:'it',label:'IT'},{code:'de',label:'DE'}];
export default function LanguageSwitcher(){
  const {locale,pathname,asPath,query}=useRouter();
  return (<div className="inline-flex border rounded-md overflow-hidden text-xs">
    {locales.map(l=> <Link key={l.code} href={{pathname,query}} as={asPath} locale={l.code}
      className={`px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-900 ${l.code===locale?'bg-gray-200 dark:bg-gray-800 font-semibold':''}`}>
      {l.label}</Link>)}
  </div>);
}
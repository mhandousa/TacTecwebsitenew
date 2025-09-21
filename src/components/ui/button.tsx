import * as React from 'react';
import clsx from 'clsx';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'outline' };
export default function Button({variant='default', className, ...props}: Props){
  const base='inline-flex items-center justify-center px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 ring-offset-gray-900 text-sm font-medium rounded-md transition-colors border';
  const styles=variant==='outline'?'bg-transparent border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900':'bg-blue-600 text-white border-blue-600 hover:bg-blue-700';
  return <button className={clsx(base,styles,className)} {...props} />;
}
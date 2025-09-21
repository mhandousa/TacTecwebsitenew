import * as React from 'react';
import clsx from 'clsx';
export function Badge(p: React.HTMLAttributes<HTMLSpanElement>){return <span {...p} className={clsx('inline-flex items-center px-2 py-1 text-xs border rounded-full',p.className)} />}

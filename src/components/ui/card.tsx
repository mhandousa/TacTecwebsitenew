import * as React from 'react';
import clsx from 'clsx';
export function Card(p: React.HTMLAttributes<HTMLDivElement>){return <div {...p} className={clsx('rounded-xl border shadow-sm bg-white/70 dark:bg-gray-900/50',p.className)} />}
export function CardHeader(p: React.HTMLAttributes<HTMLDivElement>){return <div {...p} className={clsx('p-4 border-b',p.className)} />}
export function CardTitle(p: React.HTMLAttributes<HTMLHeadingElement>){return <h3 {...p} className={clsx('font-semibold',p.className)} />}
export function CardContent(p: React.HTMLAttributes<HTMLDivElement>){return <div {...p} className={clsx('p-4',p.className)} />}

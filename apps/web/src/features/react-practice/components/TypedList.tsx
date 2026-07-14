import type { Key, ReactNode } from 'react';

type TypedListProps<Item> = Readonly<{
  items: readonly Item[];
  getKey: (item: Item) => Key;
  renderItem: (item: Item, index: number) => ReactNode;
  className?: string;
}>;

export function TypedList<Item>({
  items,
  getKey,
  renderItem,
  className,
}: TypedListProps<Item>) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={getKey(item)}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}

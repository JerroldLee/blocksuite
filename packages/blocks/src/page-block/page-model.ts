import { BaseBlockModel, Store } from '@blocksuite/store';

export class PageBlockModel extends BaseBlockModel {
  flavour = 'page' as const;
  title = '';
  constructor(store: Store, props: Partial<PageBlockModel>) {
    super(store, props);
    this.title = props.title ?? '';
  }

  override block2html(
    childText: string,
    _previousSiblingId: string,
    _nextSiblingId: string,
    begin?: number,
    end?: number
  ) {
    return `<div>${this.title}${childText}</div>`;
  }

  override block2Text(childText: string, begin?: number, end?: number) {
    const text = (this.title || '').slice(begin || 0, end);
    return `${text}${childText}`;
  }
}

// Contact tabs: the location switch on Contact, one clinic's form at a time.
// Markup: data-contact-tabs on the wrapper; inside it a data-contact-tabs-list
// holding buttons data-contact-tab="<key>" (data-contact-tab-active on the
// one open at load, else the first), and one data-contact-tab-panel="<key>"
// per button. The module adds role tablist/tab/tabpanel, aria-selected,
// aria-controls / aria-labelledby, a roving tabindex, arrow/Home/End keys,
// .is-active on the current button and `hidden` on the other panels. A URL
// hash matching a panel's id (/contact-us#parliament) opens that panel.
// Without JavaScript, in the Designer and for search engines both forms show:
// nothing is hidden by CSS until the module runs.
export function initContactTabs() {
  document.querySelectorAll<HTMLElement>('[data-contact-tabs]').forEach((root, r) => {
    const list = root.querySelector<HTMLElement>('[data-contact-tabs-list]');
    const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-contact-tab]'));
    const panels = tabs.map((tab) => root.querySelector<HTMLElement>(`[data-contact-tab-panel="${tab.dataset.contactTab}"]`));
    if (!list || !tabs.length || panels.some((panel) => !panel)) return;

    list.setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
      const panel = panels[i]!;
      tab.id ||= `contact-tab-${r}-${i}`;
      panel.id ||= `contact-panel-${r}-${i}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
    });

    const select = (index: number, focus: boolean) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i]!.hidden = !on;
      });
      if (focus) tabs[index].focus();
    };

    const fromHash = panels.findIndex((panel) => location.hash && `#${panel!.id}` === location.hash);
    const marked = tabs.findIndex((tab) => tab.hasAttribute('data-contact-tab-active'));
    select(fromHash >= 0 ? fromHash : Math.max(marked, 0), false);

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i, false));
      tab.addEventListener('keydown', (event) => {
        const last = tabs.length - 1;
        const next: Record<string, number> = {
          ArrowRight: i === last ? 0 : i + 1,
          ArrowDown: i === last ? 0 : i + 1,
          ArrowLeft: i === 0 ? last : i - 1,
          ArrowUp: i === 0 ? last : i - 1,
          Home: 0,
          End: last,
        };
        if (!(event.key in next)) return;
        event.preventDefault();
        select(next[event.key], true);
      });
    });
  });
}

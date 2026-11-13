// Contact location switch: as on live, no form shows until a clinic is
// chosen. Markup: data-contact-tabs on the wrapper; inside it a
// data-contact-tabs-list holding buttons data-contact-tab="<key>", one
// data-contact-tab-panel="<key>" per button, and an optional
// data-contact-tabs-empty block ("Please select your TVS location…") shown
// while nothing is chosen. A button may carry data-contact-tab-active to be
// chosen at load; a URL hash matching a panel's id (/contact-us#parliament)
// chooses that clinic.
// The buttons behave as a radio group (role radiogroup/radio, aria-checked,
// arrow keys move and choose, a roving tabindex). The chosen button gets
// .is-active; the other panels get `hidden`.
// Without JavaScript, in the Designer and for search engines both forms show
// and the empty block hides: nothing is hidden by CSS until the module runs.
export function initContactTabs() {
  document.querySelectorAll<HTMLElement>('[data-contact-tabs]').forEach((root) => {
    const list = root.querySelector<HTMLElement>('[data-contact-tabs-list]');
    const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-contact-tab]'));
    const panels = tabs.map((tab) => root.querySelector<HTMLElement>(`[data-contact-tab-panel="${tab.dataset.contactTab}"]`));
    const empty = root.querySelector<HTMLElement>('[data-contact-tabs-empty]');
    if (!list || !tabs.length || panels.some((panel) => !panel)) return;

    list.setAttribute('role', 'radiogroup');
    tabs.forEach((tab) => tab.setAttribute('role', 'radio'));

    const select = (index: number, focus: boolean) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-checked', String(on));
        tab.tabIndex = on || (index < 0 && i === 0) ? 0 : -1;
        panels[i]!.hidden = !on;
      });
      if (empty) empty.hidden = index >= 0;
      if (focus && index >= 0) tabs[index].focus();
    };

    const fromHash = panels.findIndex((panel) => location.hash && `#${panel!.id}` === location.hash);
    const marked = tabs.findIndex((tab) => tab.hasAttribute('data-contact-tab-active'));
    select(fromHash >= 0 ? fromHash : marked, false);

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
        if (event.key === ' ' || event.key === 'Enter') return; // native button click
        if (!(event.key in next)) return;
        event.preventDefault();
        select(next[event.key], true);
      });
    });
  });
}

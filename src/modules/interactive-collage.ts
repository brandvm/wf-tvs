// Collage Focus Card on Hover, from Osmo Supply. The function body is Osmo's
// code unchanged except one marked TVS change in animateItem (cards stay
// inside the collage); the script tags became imports (GSAP and CustomEase
// are packages here, as the repo bundles libraries) and the DOMContentLoaded
// listener became the exported init the manifest runs.
// Markup and data attributes: see the resource's documentation —
// [data-interactive-collage-init] › [data-interactive-collage-list] ›
// [data-interactive-collage-item] › [data-interactive-collage-item-inner].
// The focused item gets [data-interactive-collage-focus].
/* eslint-disable */
// @ts-nocheck
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
CustomEase.create("move", "0.3, 0.075, 0, 1");

function initCollageFocusCardOnHover() {
  const activeScale = 1.075;
  const inactiveScale = 0.9;
  const gapPercent = 3;
  const secondCardBoost = 1.35;
  const centerPullPercent = 25;
  const duration = 0.8;
  const ease = "move";

  document.querySelectorAll('[data-interactive-collage-init]').forEach(root => {
    root._interactiveCollageAbort?.abort();

    const list = root.querySelector('[data-interactive-collage-list]');
    const items = [...root.querySelectorAll('[data-interactive-collage-item]')];
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!list || !items.length) return;

    const controller = new AbortController();
    const { signal } = controller;
    let activeItem = null;
    const getInner = item => item.querySelector('[data-interactive-collage-item-inner]');

    const getMoveStrength = distance => {
      const strength = 1 / (1 + Math.pow(distance - 1, 1.2) * 0.45);
      return distance === 2 ? strength * secondCardBoost : strength;
    };

    const animateItem = (item, xPercent, yPercent, scale) => {
      // TVS change (asked for): keep every card inside the collage's own area.
      // The move is clamped so the card's scaled box never crosses the list's
      // edges; Osmo's original lets neighbours slide past them.
      const listBox = list.getBoundingClientRect();
      const box = item.getBoundingClientRect();
      const halfW = box.width * scale / 2;
      const halfH = box.height * scale / 2;
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const dx = Math.min(Math.max(xPercent / 100 * box.width, listBox.left + halfW - cx), listBox.right - halfW - cx);
      const dy = Math.min(Math.max(yPercent / 100 * box.height, listBox.top + halfH - cy), listBox.bottom - halfH - cy);
      xPercent = dx / box.width * 100;
      yPercent = dy / box.height * 100;
      gsap.to(getInner(item), {
        xPercent,
        yPercent,
        scale,
        duration,
        ease,
        overwrite: true
      });
    };

    const resetCollage = () => {
      activeItem = null;

      items.forEach(item => {
        item.removeAttribute('data-interactive-collage-focus');
        animateItem(item, 0, 0, 1);
      });
    };

    const focusItem = active => {
      if (activeItem === active) return;

      activeItem = active;

      items.forEach(item => {
        if (item === active) {
          item.setAttribute('data-interactive-collage-focus', '');
        } else {
          item.removeAttribute('data-interactive-collage-focus');
        }
      });

      const listRect = list.getBoundingClientRect();
      const listCenterY = listRect.top + listRect.height / 2;
      const gap = listRect.width * gapPercent / 100;

      const orderedItems = [...items].sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();

        return aRect.left + aRect.width / 2 - (bRect.left + bRect.width / 2);
      });

      const activeIndex = orderedItems.indexOf(active);
      const activeRect = active.getBoundingClientRect();
      const activeCenterX = activeRect.left + activeRect.width / 2;
      const activeLeft = activeCenterX - activeRect.width * activeScale / 2;
      const activeRight = activeCenterX + activeRect.width * activeScale / 2;

      const leftItem = orderedItems[activeIndex - 1];
      const rightItem = orderedItems[activeIndex + 1];

      let leftMove = 0;
      let rightMove = 0;

      if (leftItem) {
        const rect = leftItem.getBoundingClientRect();
        const itemRight = rect.left + rect.width / 2 + rect.width * inactiveScale / 2;

        leftMove = Math.min(0, activeLeft - gap - itemRight);
      }

      if (rightItem) {
        const rect = rightItem.getBoundingClientRect();
        const itemLeft = rect.left + rect.width / 2 - rect.width * inactiveScale / 2;

        rightMove = Math.max(0, activeRight + gap - itemLeft);
      }

      orderedItems.forEach((item, index) => {
        if (item === active) {
          animateItem(item, 0, 0, activeScale);
          return;
        }

        const rect = item.getBoundingClientRect();
        const difference = index - activeIndex;
        const distance = Math.abs(difference);
        const strength = getMoveStrength(distance);
        const itemCenterY = rect.top + rect.height / 2;
        const centerProgress = (listCenterY - itemCenterY) / (listRect.height / 2);
        const moveX = difference < 0 ? leftMove * strength : rightMove * strength;
        const scale = inactiveScale - (1 - strength) * 0.12;

        animateItem(item, moveX / rect.width * 100, centerPullPercent * centerProgress * strength, scale);
      });
    };

    const getHoveredItem = event => {
      if (activeItem) {
        const rect = getInner(activeItem).getBoundingClientRect();

        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          return activeItem;
        }
      }

      return document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-interactive-collage-item]') || null;
    };

    if (isTouch) {
      items.forEach(item => {
        item.addEventListener('click', event => {
          event.stopPropagation();
          activeItem === item ? resetCollage() : focusItem(item);
        }, { signal });
      });

      document.addEventListener('click', event => {
        if (!root.contains(event.target)) resetCollage();
      }, { signal });
    } else {
      root.addEventListener('pointermove', event => {
        const item = getHoveredItem(event);
        item ? focusItem(item) : resetCollage();
      }, { signal });

      root.addEventListener('pointerleave', resetCollage, { signal });
    }

    root._interactiveCollageAbort = controller;
  });
}

export function initInteractiveCollage() {
  initCollageFocusCardOnHover();
}

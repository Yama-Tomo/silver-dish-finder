import { ContentScriptMessages, PopupMessages } from '~/message';

chrome.runtime.onMessage.addListener(
  (request: ContentScriptMessages, sender, sendResponse: (response: PopupMessages) => void) => {
    const message: PopupMessages['payload'] = { setMenus: [], materials: {} };

    document
      .querySelectorAll<HTMLDivElement>('#CO000 + section .p-menu__info:first-child')
      .forEach((ele) => {
        const setName = ele
          .querySelector<HTMLAnchorElement>('.p-menu__name')
          ?.innerText?.split(' ', 2)
          .pop()
          ?.replace(/.人前/, '');
        if (!setName) {
          return;
        }

        const materials = ele
          .querySelector<HTMLParagraphElement>('.p-menu__description')
          ?.innerText.split(/[ \n]/)
          .filter((s) => s.match(/^・|人前|期間限定/) === null)
          .join('')
          .split(/・(?![^（]*）)/);
        if (!materials) {
          return;
        }

        message.setMenus.push({ setName, materials });

        materials.forEach((material) => {
          message.materials[material] = (message.materials[material] ?? 0) + 1;
        });
      });

    sendResponse({ action: 'loaded-data', payload: message });
  }
);

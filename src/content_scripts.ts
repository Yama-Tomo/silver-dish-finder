import { ContentScriptMessages, PopupMessages } from '~/message';

chrome.runtime.onMessage.addListener(
  (request: ContentScriptMessages, sender, sendResponse: (response: PopupMessages) => void) => {
    console.log(request);

    sendResponse({ action: 'loaded-data', payload: 1111 });
  }
);

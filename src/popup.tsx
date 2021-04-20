import { h, render, Fragment } from 'preact';
import styled, { createGlobalStyle } from 'styled-components';
import { ContentScriptMessages, PopupMessages } from '~/message';

const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0.5rem;
    min-width: 500px;
    background-color: rgb(239, 241, 236);
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  }
`;

type UiProps = { className?: string; onLoadBtnClick: () => void };
const UiComponent = (props: UiProps) => {
  return (
    <Fragment>
      <GlobalStyle />
      <div className={props.className}>
        <h1>Silver Dish Finder</h1>
        <button onClick={props.onLoadBtnClick}>データを読み込む</button>
      </div>
    </Fragment>
  );
};

const Container = () => {
  const innerProps: UiProps = {
    onLoadBtnClick: () => {
      chrome.tabs.query({ active: true, currentWindow: true }, messageToContentScript);
    },
  };

  return <UiComponent {...innerProps} />;
};

const messageToContentScript = (tabs: chrome.tabs.Tab[]) => {
  if (!tabs[0] || !tabs[0].id) {
    return;
  }

  const message: ContentScriptMessages = { action: 'load-data' };
  chrome.tabs.sendMessage(tabs[0].id, message, (response: PopupMessages) => {
    console.log(response);
  });
};

render(<Container />, document.body);

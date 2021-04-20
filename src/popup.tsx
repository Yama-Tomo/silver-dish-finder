import { h, render, Fragment } from 'preact';
import { StateUpdater, useState } from 'preact/hooks';
import styled, { createGlobalStyle } from 'styled-components';
import { ContentScriptMessages, PopupMessages } from '~/message';
import { List } from '~/popup/List';

/* -------------------- DOM -------------------- */
type UiProps = {
  className?: string;
  onLoadBtnClick: () => void;
  sushiData: PopupMessages['payload'] | undefined;
};

const UiComponent = (props: UiProps) => {
  return (
    <Fragment>
      <GlobalStyle />
      <div className={props.className}>
        <h1>Silver Dish Finder</h1>
        <button onClick={props.onLoadBtnClick}>データを読み込む</button>
        {props.sushiData && <List className="list" sushiData={props.sushiData} />}
      </div>
    </Fragment>
  );
};

/* ------------------- Style ------------------- */
const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0.5rem;
    min-width: 500px;
    background-color: rgb(239, 241, 236);
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  }
`;

const StyledUi = styled(UiComponent)`
  .list {
    margin-top: 0.5rem;
  }
`;

/* ----------------- Container ----------------- */
const Container = () => {
  const [state, setState] = useState<PopupMessages | undefined>(undefined);

  const innerProps: UiProps = {
    onLoadBtnClick: () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => loadData(tabs, setState));
    },
    sushiData: state?.payload,
  };

  return <StyledUi {...innerProps} />;
};

const loadData = (
  tabs: chrome.tabs.Tab[],
  stateUpdater: StateUpdater<PopupMessages | undefined>
) => {
  if (!tabs[0] || !tabs[0].id) {
    return;
  }

  const message: ContentScriptMessages = { action: 'load-data' };
  chrome.tabs.sendMessage(tabs[0].id, message, stateUpdater);
};

render(<Container />, document.body);

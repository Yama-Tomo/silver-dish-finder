import { h, render, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import styled, { createGlobalStyle } from 'styled-components';
import { ContentScriptMessages, PopupMessages } from '~/message';
import { List, ListProps } from '~/popup/List';

/* -------------------- DOM -------------------- */
type UiProps = {
  className?: string;
  onLoadBtnClick: () => void;
  sushiData: ListProps['sushiData'] | undefined;
  choiceMaterials: ListProps['choiceMaterials'];
  onMaterialCheckChange: ListProps['onMaterialCheckChange'];
};

const UiComponent = (props: UiProps) => (
  <div className={props.className}>
    <h1>Silver Dish Finder</h1>
    <button onClick={props.onLoadBtnClick}>データを読み込む</button>
    {props.sushiData && (
      <List
        className="list"
        sushiData={props.sushiData}
        choiceMaterials={props.choiceMaterials}
        onMaterialCheckChange={props.onMaterialCheckChange}
      />
    )}
  </div>
);

/* ------------------- Style ------------------- */
const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0.5rem;
    min-width: 500px;
    background-color: #fafafa;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    color: #45515b;
  }
`;

const StyledUi = styled((props: UiProps) => (
  <Fragment>
    <GlobalStyle />
    <UiComponent {...props} />
  </Fragment>
))`
  button {
    cursor: pointer;
  }

  .list {
    margin-top: 0.5rem;
  }
`;

/* ----------------- Container ----------------- */
type State = { sushiData: PopupMessages | undefined; choiceMaterials: UiProps['choiceMaterials'] };
const Container = () => {
  const [{ sushiData, choiceMaterials }, setState] = useState<State>({
    sushiData: undefined,
    choiceMaterials: [],
  });

  const updateSushiData = (sushiData: State['sushiData']) =>
    setState((v) => ({ choiceMaterials: [], sushiData }));

  const innerProps: UiProps = {
    onLoadBtnClick: () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
        loadData(tabs, updateSushiData)
      );
    },
    sushiData: sushiData?.payload
      ? {
          ...sushiData.payload,
          setMenus: !choiceMaterials.length
            ? sushiData.payload.setMenus
            : sushiData.payload.setMenus.filter(({ materials }) =>
                choiceMaterials.every((d) => materials.includes(d))
              ),
        }
      : undefined,
    choiceMaterials,
    onMaterialCheckChange: (targetMaterial, checked) => {
      const updateChoiceMaterials = checked
        ? choiceMaterials.concat(targetMaterial)
        : choiceMaterials.filter((material) => material !== targetMaterial);

      setState((v) => ({ ...v, choiceMaterials: updateChoiceMaterials }));
    },
  };

  return <StyledUi {...innerProps} />;
};

const loadData = (tabs: chrome.tabs.Tab[], updateSushiData: (payload: PopupMessages) => void) => {
  if (!tabs[0] || !tabs[0].id) {
    return;
  }

  const message: ContentScriptMessages = { action: 'load-data' };
  chrome.tabs.sendMessage(tabs[0].id, message, updateSushiData);
};

render(<Container />, document.body);

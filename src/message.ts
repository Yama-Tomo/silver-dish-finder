type MaterialName = string;
type MaterialCount = number;
type SushiData = {
  setMenus: { setName: string; materials: string[] }[];
  materials: Record<MaterialName, MaterialCount>;
};

type PopupMessages = { action: 'loaded-data'; payload: SushiData };

type ContentScriptMessages = { action: 'load-data' };

export type { PopupMessages, ContentScriptMessages };

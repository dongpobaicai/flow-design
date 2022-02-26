/**
 * 结点配置
 */
export interface NodeConfig {
  name: string;
  entity: any;
  force: boolean;
}

export type DesignOptions = {
  id: string;
};
export type EmptyProps = {} | null;

export interface FlowDesignInstance {
  graph: Object;
  initNode: () => void;
  layout: () => void;
  importJson: () => void;
  exportJson: () => void;
}

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
}

export interface FlowDesignInstance {
  public graph: Object;
  public initNode: () => void;
  public layout: () => void;
  public importJson: () => void;
  public exportJson: () => void;
}
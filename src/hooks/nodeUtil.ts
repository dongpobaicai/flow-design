
import { Graph, Cell } from "@antv/x6";
import { NodeConfig } from "../../types/flowNode";

import { emptyOptions} from './nodeConfigs/emptyConfig'

type EdgeOption = {
  source: Cell
  target: Cell
  zIndex?: number | string
}
/**
 * 注册结点
 */
export function registerNode(options: NodeConfig, graph: any) {
  graph.registerVueComponent(options.name, options.entity, options.force);
}

/**
 * 创建节点
 * @param key
 * @returns
 */
export function createNode(key: string, graph: Graph) {
  let options = {};
  switch (key) {
    case "emptyNode":
      options = emptyOptions;
      break;
  }
  return graph.createNode(options);
}

/**
 * 创建边
 * @param options 
 * @param graph 
 * @returns 
 */
export function createEdge(options: EdgeOption, graph: Graph) {
  return graph.createEdge({
    source: { cell: options.source.id, port: "bottom" },
    target: { cell: options.target.id, port: "top" },
    zIndex: options.zIndex,
  });
}

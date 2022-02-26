import { Graph, Cell, Node } from "@antv/x6";
import { NodeConfig } from "#/flowNode";

import { emptyOptions } from "./nodeConfigs/emptyConfig";
import { startOptions } from "./nodeConfigs/startConfig";

type EdgeOption = {
  source: Cell;
  target: Cell;
  zIndex?: number | string;
};
/**
 * 注册结点
 */
export function registerNode(options: NodeConfig): void {
  Graph.registerVueComponent(options.name, options.entity, options.force);
}

function getNodeOptions(key: string, data: Record<string, unknown> = {}) {
  let options: Node.Metadata = {};
  switch (key) {
    case "emptyNode":
      options = emptyOptions;
      break;
    case "startNode":
      options = startOptions;
      break;
    case "launch":
      options = startOptions;
      options.data = {
        isShowAddApprovalBtn: true,
        isShowConditionBtn: true,
        name: "发起人",
      };
      break;
  }
  options.data = Object.assign(options.data, data);
  return options;
}
/**
 * 创建节点
 * @param key
 * @returns
 */
export function createNode(key: string, graph: Graph, data: Record<string, unknown> = {}) {
  return graph.createNode(getNodeOptions(key, data));
}

/**
 * 创建节点并添加
 * @param key
 * @param graph
 * @param data
 * @returns
 */
export function addNode(key: string, graph: Graph, data: Record<string, unknown> = {}) {
  return graph.addNode(getNodeOptions(key, data));
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

/**
 * 创建并添加边
 * @param options
 * @param graph
 * @returns
 */
export function addEdge(options: EdgeOption, graph: Graph) {
  return graph.addEdge({
    source: { cell: options.source.id, port: "bottom" },
    target: { cell: options.target.id, port: "top" },
    zIndex: options.zIndex,
  });
}

import { NodeConfig } from "#/flowNode";
import { PORTS_OPTIONS } from "./common";

import type FlowDesign from "@/hooks/flowDesign";
import { createNode, createEdge } from "@/hooks/nodeUtil";

import ConditionNode from "@/components/node/ConditionNode.vue";

export default function getConditionConfig(design: FlowDesign): NodeConfig {
  return {
    name: "conditionNode",
    entity: {
      template: `<condition-node></condition-node>`,
      components: {
        ConditionNode,
      },
      methods: {
        addLaunchNode({ graph, node }) {
          const lastNode = graph.getNeighbors(node, {
            outgoing: true,
          });
          const edges = graph.getOutgoingEdges(node);
          const member = createNode("launch", graph);
          graph.removeEdge(edges[0]);
          const cells = [member, createEdge({ source: node, target: member, zIndex: edges[0].zIndex }, graph), createEdge({ source: member, target: lastNode[0], zIndex: edges[0].zIndex }, graph)];
          graph.addCell(cells);
          graph.freeze();
          design.layout();
        },
        addApprovalNode({ key, graph, node }) {
          const edges = graph.getOutgoingEdges(node);
          const member = createNode(key, graph);
          graph.freeze();
          edges.forEach((edge) => {
            const lastNode = graph.getNeighbors(edge, {
              outgoing: true,
            });
            graph.removeEdge(edge);
            graph.addCell([member, createEdge({ source: node, target: member, zIndex: edge.zIndex }, graph), createEdge({ source: member, target: lastNode[0], zIndex: edge.zIndex }, graph)]);
          });
          design.layout();
        },
        removeNode({ graph, node }) {
          graph.freeze();
          try {
            // inNodes[0]就相当于父节点
            const inNodes = graph.getNeighbors(node, {
              incoming: true,
            });

            const outNodes = graph.getNeighbors(node, {
              outgoing: true,
            });
            if (graph.getOutgoingEdges(inNodes[0]).length === 1) {
              // 删除最后一条边的时候，自动连接父节点和子节点
              graph.addCell([createEdge({ source: inNodes[0], target: outNodes[0] }, graph)]);
            }
            //  需要把连接到node的所有线，改成连接到node的下面这个
            graph.removeNode(node);

            //TODO 当发现父节点的条件节点只有一个的时候需要把这个也删除，
            if (inNodes[0]) {
              const fuOutNodes = graph.getNeighbors(inNodes[0], {
                outgoing: true,
              });
              if (Array.isArray(fuOutNodes)) {
                const ziConditionNode = fuOutNodes.filter((ziNode) => ziNode.component == "conditionNode");
                ziConditionNode.length === 1 &&
                  (() => {
                    const nextNode = graph.getNeighbors(ziConditionNode[0], {
                      outgoing: true,
                    });
                    graph.removeNode(ziConditionNode[0]);
                    graph.addCell([createEdge({ source: inNodes[0], target: nextNode[0] }, graph)]);
                  })();
              }
            }

            // 需要去遍历list，查看其下面还有没有条件节点，如果没有的话则需要把node下的空节点也删除，并且维持原来的绑定关系，
            let shoudDeleteNodeId, emptyNode;
            Object.entries(design.conditionFuNodeObj).forEach(([key, item]: [string, any]) => {
              const itemOutNodes = graph.getNeighbors(item, {
                outgoing: true,
              });
              // 没有出去的node或者出去的node中没有条件节点，就需要把改node的data.emptyNode设置为空，且从数组中删除，且删除emptyNode，且把对应的节点连接好
              let isNoneCondition = false; // 判断出去的node是否还有条件节点
              if (Array.isArray(itemOutNodes) && itemOutNodes.length > 0) {
                // ture表示没有条件节点，false表示还有
                isNoneCondition = itemOutNodes.every((outItem) => {
                  return outItem.component != "conditionNode";
                });
              }
              if (isNoneCondition || !itemOutNodes || (Array.isArray(itemOutNodes) && itemOutNodes.length == 0)) {
                shoudDeleteNodeId = key;
                emptyNode = graph.getCellById(item.data.emptyNodeId);
                const inEmptyNodes = graph.getNeighbors(emptyNode, {
                  incoming: true,
                });
                const outEmptyNodes = graph.getNeighbors(emptyNode, {
                  outgoing: true,
                });
                const endEmptyNode = outEmptyNodes[0];
                // Array.isArray(inEmptyNodes)
                const addCells = [];
                inEmptyNodes.forEach((inItem) => {
                  addCells.push(createEdge({ source: inItem, target: endEmptyNode }, graph));
                });
                graph.addCell(addCells);
              }
            });
            // conditionFuNodeObj中删除node  且删除node中的data.emptyNodeId
            if (shoudDeleteNodeId) {
              delete design.conditionFuNodeObj[shoudDeleteNodeId];
              delete graph.getCellById(shoudDeleteNodeId).data.emptyNodeId;
              graph.removeNode(emptyNode);
            }
          } catch (e) {
            console.warn("直接删除条件节点");
            graph.removeNode(node);
          }

          design.layout();
        },
      },
    },
    force: true,
  };
}

export const conditionOptions = {
  ports: { ...PORTS_OPTIONS },
  shape: "vue-shape",
  data: {
    isShowAddApprovalBtn: true,
    isShowConditionBtn: true,
  },
  width: 200,
  height: 76,
  component: "conditionNode",
};

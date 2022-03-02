import { Graph, Node } from "@antv/x6";

import { PORTS_OPTIONS } from "./common";

import { NodeConfig } from "#/flowNode";
import StartNode from "@/components/node/StartNode.vue";
import { createNode, createEdge } from "@/hooks/nodeUtil";
import type FlowDesign from "@/hooks/flowDesign";

export default function getStartConfig(design: FlowDesign): NodeConfig {
  return {
    name: "startNode",
    entity: {
      template: `<start-node></start-node>`,
      components: {
        StartNode,
      },
      methods: {
        addLaunchNode({ graph, node }: { graph: Graph; node: Node }) {
          const lastNode = graph.getNeighbors(node, {
            outgoing: true,
          });
          const edges = graph.getOutgoingEdges(node);
          if (!(edges && edges[0] && edges[0].zIndex)) {
            return false;
          }
          const member = createNode("launch", graph);
          graph.removeEdge(edges[0]);
          const cells = [member, createEdge({ source: node, target: member }, graph), createEdge({ source: member, target: lastNode[0] }, graph)];
          graph.addCell(cells);
          graph.freeze();
          design.layout();
        },
        addApprovalNode({ key, graph, node }) {
          const lastNode = graph.getNeighbors(node, {
            outgoing: true,
          });
          const edges = graph.getOutgoingEdges(node);
          if (!(edges && edges[0] && edges[0].zIndex)) {
            return false;
          }
          const member = createNode(key, graph);
          graph.freeze();
          let cells = [];
          // -如果创建的是分支节点需要判断，node下是否有分支节点，
          // --没有分支节点=》需要创建两条分支节点，
          // --有分支节点=》则需要创建一条分支节点
          if (key == "conditionNode") {
            // @ts-ignore: Unreachable code error
            if (lastNode[0].component == "conditionNode") {
              // 并行添加条件
              const lastLastNode = graph.getNeighbors(lastNode[0], {
                outgoing: true,
              });
              const emptyNodeId = node.data.emptyNodeId;
              cells = [
                member,
                createEdge({ source: node, target: member }, graph),
                createEdge(
                  {
                    source: member,
                    target: graph.getCellById(emptyNodeId) || lastLastNode[0],
                  },
                  graph
                ),
              ];
            } else {
              // 增加2个条件节点，1个空节点，删除原来的线，
              // 增加空节点到下个节点的线，增加条件节点到空节点的线，增加上个节点到条件节点的线
              graph.removeEdge(edges[0]);
              const member2 = createNode(key, graph);
              const emptyNodeItance = createNode("emptyNode", graph);
              cells = [
                emptyNodeItance,
                member,
                member2,
                createEdge({ source: node, target: member, zIndex: edges[0].zIndex }, graph),
                createEdge(
                  {
                    source: node,
                    target: member2,
                    zIndex: edges[0].zIndex + 9999,
                  },
                  graph
                ),
                createEdge(
                  {
                    source: member,
                    target: emptyNodeItance,
                    zIndex: edges[0].zIndex,
                  },
                  graph
                ),
                createEdge(
                  {
                    source: member2,
                    target: emptyNodeItance,
                    zIndex: edges[0].zIndex + 9999,
                  },
                  graph
                ),
                createEdge(
                  {
                    source: emptyNodeItance,
                    target: lastNode[0],
                    zIndex: edges[0].zIndex,
                  },
                  graph
                ),
              ];
              // 把空节点绑定到操作当前的node节点中去，并把node节点存到list中，用途：每当删除条件节点，需要去遍历list，查看其下面还有没有条件节点，如果没有的话则需要把node下的空节点也删除，并且维持原来的绑定关系，
              node.data.emptyNodeId = emptyNodeItance.id;
              design.conditionFuNodeObj[node.id] = node;
            }
          } else {
            if (edges.length > 1) {
              // 存在分支节点，添加审核节点
              cells = [member, createEdge({ source: node, target: member, zIndex: edges[0].zIndex }, graph)];
              edges.forEach((edge) => {
                // 删除原先的分支节点
                const lastNode = graph.getNeighbors(edge, {
                  outgoing: true,
                });
                graph.removeEdge(edge);
                cells.push(createEdge({ source: member, target: lastNode[0] }, graph));
              });
            } else {
              graph.removeEdge(edges[0]);
              cells = [
                member,
                createEdge({ source: node, target: member, zIndex: edges[0].zIndex }, graph),
                createEdge(
                  {
                    source: member,
                    target: lastNode[0],
                    zIndex: edges[0].zIndex,
                  },
                  graph
                ),
              ];
            }
          }
          // 1.oldnode连接的end节点=》需要把连到end节点断开，然后newnode连接到end上
          // 2.oldnode连接到非end节点=>需要把
          graph.addCell(cells);
          design.layout();
        },
        removeNode({ graph, node }: { graph: Graph; node: Node }) {
          graph.freeze();
          const inNodes = graph.getNeighbors(node, {
            incoming: true,
          });
          const outNodes = graph.getNeighbors(node, {
            outgoing: true,
          });
          if (!(inNodes && inNodes[0])) {
            return false;
          }
          const edges = graph.getOutgoingEdges(inNodes[0]);
          if (edges && edges.length === 1) {
            // 删除最后一条边的时候，自动连接父节点和子节点
            graph.addCell([createEdge({ source: inNodes[0], target: outNodes[0] }, graph)]);
          }
          //  需要把连接到node的所有线，改成连接到node的下面这个
          graph.removeNode(node);
          design.layout();
        },
      },
    },
    force: true,
  };
}
export const startOptions = {
  ports: { ...PORTS_OPTIONS },
  shape: "vue-shape",
  data: {},
  width: 100,
  height: 50,
  component: "startNode",
};

import { Graph, Node } from "@antv/x6";

import { PORTS_OPTIONS } from "./common";

import type FlowDesign from "@/hooks/flowDesign";
import { createNode, createEdge } from "@/hooks/nodeUtil";
import { NodeConfig } from "#/flowNode";

import EndNode from "@/components/node/EndNode.vue";

export default function getEndConfig(design: FlowDesign): NodeConfig {
  return {
    name: "endNode",
    entity: {
      template: `<end-node></end-node>`,
      components: {
        EndNode,
      },
      methods: {
        addApprovalNode({ key, graph, node }: { key: string; graph: Graph; node: Node }) {
          const member = createNode(key, graph);
          graph.freeze();
          graph.addCell([member, createEdge({ source: node, target: member }, graph)]);
          design.layout();
        },
        removeNode({ graph, node }) {
          graph.freeze();
          graph.removeNode(node);
          design.layout();
        },
      },
    },
    force: true,
  };
}

export const endOptions = {
  ports: { ...PORTS_OPTIONS },
  shape: "vue-shape",
  data: {
    name: "结束",
  },
  width: 100,
  height: 50,
  component: "endNode",
};

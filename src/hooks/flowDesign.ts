import { Graph, Shape, Markup, Edge } from "@antv/x6";
import "@antv/x6-vue-shape";
import dagre from "dagre";

import { registerNode, addNode, addEdge } from "./nodeUtil";
import getEmptyConfig from "./nodeConfigs/emptyConfig";
import getStartConfig from './nodeConfigs/startConfig'
import getEndConfig from './nodeConfigs/endConfig'
import getApprovalConfig from './nodeConfigs/approvalConfig'
import getConditionConfig from './nodeConfigs/conditionConfig'

import { DesignOptions } from "#/flowNode";

const COLOR_COLLECTION = {
  CLICK_HIGH_LIGHT: "orange",
  DEFAULT_COLOR: "#A2B1C3",
};

/**
 * 设计类
 */
export default class FlowDesign {
  public graph: Record<string, unknown>;
  public conditionFuNodeObj: Record<string, Node>;

  constructor(options: DesignOptions) {
    this.graph = this.initGraph(options.id);
    this.conditionFuNodeObj = {}
  }

  private initGraph(id: string) {
    const options = this.setGlobalCofig(id);
    // 注册全局
    this.setGlobalNode();
    // 注册事件
    this.setEvent();
    return new Graph(options);
  }
  /**
   * 设置全局画布的配置
   */
  private setGlobalCofig(elementId: string): Record<string, unknown> {
    Shape.Rect.config({
      x: 40,
      y: 40,
      width: 100,
      height: 100,
    });
    Shape.Edge.config({
      defaultLabel: {
        markup: Markup.getForeignObjectMarkup(),
        attrs: {
          cursor: "auto",

          fo: {
            width: 20,
            height: 20,
            x: -11,
            y: -40,
          },
        },
      },
      router: {
        name: "manhattan",
        args: {
          startDirections: ["bottom"],
          endDirections: ["top"],
        },
      },
      attrs: {
        line: {
          stroke: COLOR_COLLECTION.DEFAULT_COLOR,
          cursor: "auto",
        },
        wrap: {
          cursor: "auto",
        },
      },
    });
    return {
      selecting: true, // 开启点选
      panning: true, // 画布支持移动
      snapline: true, // 对齐线
      connecting: {
        snap: true,
        allowBlank: false,
      },
      // 增加缩放效果
      mousewheel: {
        enabled: true,
        modifiers: "ctrl",
        factor: 1.1,
        maxScale: 1.5,
        minScale: 0.5,
      },
      container: document.getElementById(elementId),
      grid: true,
      interacting: false,
    };
  }

  /**
   * 设置全局node配置
   */
  private setGlobalNode() {
    // 注册开始节点
    registerNode(getStartConfig(this));
    registerNode(getEndConfig(this));
    registerNode(getApprovalConfig(this));
    registerNode(getConditionConfig(this));
    // 注册空节点
    registerNode(getEmptyConfig(this));
  }

  /**
   * 设置全局事件
   */
  private setEvent() {
    //
  }

  /**
   * 初始化节点
   */
  public initNode() {
    // 增加开始节点
    const startNode = addNode("startNode", this.graph as Graph, {
      isShowAddApprovalBtn: true,
      isShowConditionBtn: true,
      name: "开始",
      isStartNode: true, /// 是否为开始节点
    });
    // 发起人
    const selfNode = addNode("startNode", this.graph as Graph, {
      isShowAddApprovalBtn: true,
      isShowConditionBtn: true,
      isFirstLaunchNode: true, // 用于判断是否是第一个发起人节点，
      name: "发起人",
    });
    const endNode = addNode("endNode", this.graph as Graph)
    addEdge({ source: startNode, target: selfNode }, this.graph as Graph);
    addEdge({ source: selfNode, target: endNode }, this.graph as Graph);
  }

  /**
   * 画布布局
   */
  public layout() {
    const dir = "TB";
    const graph = this.graph as Graph;
    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    // 将边重新排下序
    // 添加规则
    /**
     * 1. 存在分支路线上节点有  审核节点，条件节点，发起人节点 空节点
     * 2. 只有删除边的操作，才会有上下节点顺序改变   设置新的边层级位于删除边同层级，不破坏原来层级关系
     * 3. 左边节点边 优于 右边节点边  故创建分支节点  右边层级 + 9999
     * 4. 最后根据层级值排下序
     */
    edges.sort((a, b) => a.zIndex - b.zIndex);

    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 45 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      g.setNode(node.id, { width: 200, height: 76 });
    });

    edges.forEach((edge) => {
      const source = edge.getSource() as Edge.TerminalCellData;
      const target = edge.getTarget() as Edge.TerminalCellData;
      g.setEdge(source.cell, target.cell);
    });

    dagre.layout(g);

    graph.freeze();

    g.nodes().forEach((id) => {
      const node = graph.getCellById(id);
      if (node) {
        const pos = g.node(id);
        // @ts-ignore: Unreachable code error
        if (node.component === "approvalNode" || node.component === "conditionNode") {
          // @ts-ignore: Unreachable code error
          node.position(pos.x - 50, pos.y);
        } else {
          // @ts-ignore: Unreachable code error
          node.position(pos.x, pos.y);
        }
      }
    });

    graph.unfreeze();
    // 画布居中
    graph.centerContent();
  }

  public importJson() {
    // 注释
  }

  public exportJson() {
    // 注释
  }
}

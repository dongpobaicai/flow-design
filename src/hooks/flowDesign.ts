import { Graph, Shape, Markup } from "@antv/x6";
import '@antv/x6-vue-shape'

import { registerNode, createNode } from "./nodeUtil";
import getEmptyConfig from "./nodeConfigs/emptyConfig";
import { DesignOptions } from '#/flowNode'

const COLOR_COLLECTION = {
  CLICK_HIGH_LIGHT: "orange",
  DEFAULT_COLOR: "#A2B1C3",
};

/**
 * 设计类
 */
export default class FlowDesign {
  public graph: Object;

  constructor(options: DesignOptions) {
    this.graph = this.initGraph(options.id);
    this.initNode()
  }

  private initGraph(id: string) {
    const options = this.setGlobalCofig(id);
    // 注册全局
    this.setGlobalNode()
    // 注册事件
    this.setEvent()
    return new Graph(options);
  }
  /**
   * 设置全局画布的配置
   */
  private setGlobalCofig(elementId: string): object {
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
    // 注册空节点
    registerNode(getEmptyConfig(this), Graph);
  }

  /**
   * 设置全局事件
   */
  private setEvent() {}

  /**
   * 初始化节点
   */
  public initNode() {
    createNode('emptyNode', this.graph as Graph)
  }

  /**
   * 画布布局
   */
  public layout() {}

  public importJson() {}
  public exportJson() {}
}

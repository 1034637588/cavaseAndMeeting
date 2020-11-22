<template>
  <div class="canvas-box">
    <div class="header">
      <el-button @click="chooseMode('pen')">铅笔</el-button>
      <el-button @click="chooseMode('line')">直线</el-button>
      <el-button @click="chooseMode('rect')">矩形</el-button>
      <el-button @click="chooseMode('cir')">圆形</el-button>
      <el-button @click="chooseMode('text')">文字</el-button>
      <!-- <el-button @click="chooseMode('img')">图片</el-button> -->

      <el-button @click="chooseMode('clear')">橡皮</el-button>
      <el-button @click="chooseMode('select')">选中</el-button>
      <span class="demonstration">颜色</span>
      <el-color-picker v-model="color1"></el-color-picker>
    </div>
    <div class="center">
      <canvas height="600px" ref="main" width="900px" id="main"></canvas>
    </div>
    <img src="./timg.jpg" style="display: none" id="img" />
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  components: {},
  data() {
    return {
      canvas: null,
      color1: "#140202",
      mode: "pen",
      rect: {},
      cClientX: "",
      cClientY: "",
      fileList: [],
    };
  },
  methods: {
    getall() {},
    chooseMode(mode) {
      this.mode = mode;
      if (mode === "clear") {
        this.selectable(true);
      } else {
        this.selectable(false);
      }
      if (mode == "select") {
        this.selectable(true);
      }
    },
    move(options) {
      //鼠标移动时
      switch (this.mode) {
        case "pen":
        case "rect":
          let x = this.rect.get("left");
          let y = this.rect.get("top");
          let width = options.e.clientX - this.cClientX - x;
          let height = options.e.clientY - this.cClientY - y;
          this.rect.set({ width, height });
          this.canvas.renderAll();
          break;
        case "line":
          let lx = this.line.get("x1");
          let ly = this.line.get("y1");
          let lwidth = options.e.clientX - this.cClientX;
          let lheight = options.e.clientY - this.cClientY;
          this.line.set({ x2: lwidth, y2: lheight });
          this.canvas.renderAll();
          break;
        case "cir":
          let cw = this.circle.get("left");
          let cy = this.circle.get("top");
          this.circle.set(
            "radius",
            Math.max(
              Math.abs(options.e.clientX - this.cClientX - cw),
              Math.abs(options.e.clientY - this.cClientY - cy)
            )
          );
          this.canvas.renderAll();

          break;
        case "text":
          break;
        default:
          break;
      }
    },
    up() {
      //鼠标up
      let canvs_data = this.canvas.toJSON();
      //将数据序列化 然后广播出去
      this.sendCanvas(canvs_data);
      switch (this.mode) {
        case "pen":
          break;
        case "rect":
          if (this.rect.get("width") == 0) {
            this.canvas.remove(this.rect);
          }
          this.canvas.off("mouse:move", this.move);
          break;
        case "line":
          this.canvas.off("mouse:move", this.move);
          break;
        case "cir":
          this.canvas.off("mouse:move", this.move);
          break;
        case "text":
          break;
        default:
          break;
      }
    },
    down(options) {
      let self = this;
      switch (this.mode) {
        case "pen":
          break;
        case "line":
          let line = new fabric.Line(
            [
              options.e.clientX - this.cClientX,
              options.e.clientY - this.cClientY,
              options.e.clientX - this.cClientX,
              options.e.clientY - this.cClientY,
            ],
            {
              stroke: this.color1,
              strokeWidth: 2,
            }
          );
          line.on("selected", function () {
            if (self.mode === "clear") {
              this.canvas.remove(this);
            }
          });
          this.line = line;
          this.canvas.add(line);
          this.canvas.on("mouse:move", this.move);
          break;
        case "rect":
          this.canvas.isDrawingMode = false;
          let rect = new fabric.Rect({
            left: options.e.clientX - this.cClientX,
            top: options.e.clientY - this.cClientY,
            stroke: this.color1,
            fill: "rgba(255,255,255,0)",
            width: 0,
            height: 0,
            selectable: true,
          });
          rect.on("selected", function () {
            if (self.mode === "clear") {
              this.canvas.remove(this);
            }
          });
          this.rect = rect;
          this.canvas.add(rect);
          this.canvas.on("mouse:move", this.move);
          break;
        case "cir":
          this.canvas.isDrawingMode = false;
          let circle = new fabric.Circle({
            radius: 0,
            stroke: this.color1,
            fill: "rgba(255,255,255,0)",
            left: options.e.clientX - this.cClientX,
            top: options.e.clientY - this.cClientY,
          });
          circle.on("selected", function () {
            if (self.mode === "clear") {
              this.canvas.remove(this);
            }
          });
          this.circle = circle;
          this.canvas.add(circle);
          this.canvas.on("mouse:move", this.move);
          break;
        case "text":
          if (this.text) {
            //如果之前有 就先清除
            if (this.text.text == "") {
              this.text.exitEditing(); //退出编辑
              this.canvas.remove(this.text);
            }
          }
          this.canvas.isDrawingMode = false;
          let text = new fabric.IText("", {
            left: options.e.clientX - this.cClientX,
            top: options.e.clientY - this.cClientY,
            fill: this.color1,
            fontSize: 20,
          });
          text.on("selected", function () {
            if (self.mode === "clear") {
              this.canvas.remove(this);
            }
          });
          this.text = text;
          this.canvas.add(text);
          text.enterEditing();
          text.hiddenTextarea.focus();
          break;
        case "clear":
          console.log("clear");
          break;
        case "img":
          let imgElement = document.getElementById("img"); //声明我们的图片
          let imgInstance = new fabric.Image(imgElement, {
            //设置图片位置和样子
            left: 30,
            top: 30,
            scaleX: imgElement.width > this.canvas.width ? 0.1 : 1,
            scaleY: imgElement.height > this.canvas.height ? 0.1 : 1,
          });
          imgInstance.on("selected", function () {
            if (self.mode === "clear") {
              this.canvas.remove(this);
            }
          });
          this.canvas.add(imgInstance); //加入到canvas中
          break;
        default:
          break;
      }
    },
    selectable(yORn) {
      this.canvas.selectable = yORn; //控件能不能被选择，不会被操作
      this.canvas.selection = yORn; //画板显示被不被不选中
      this.canvas.skipTargetFind = !yORn; // 整个画板元素不能被选中
    },
    sendCanvas(data) {
      this.$socket.emit(`canvas`, data, this.$route.params.id);
    },
  },
  watch: {
    //判断是不是画笔
    mode(newm, oldm) {
      if (newm !== "pen") {
        this.canvas.isDrawingMode = false;
      } else {
        this.canvas.isDrawingMode = true;
      }
      if (newm !== "text") {
        if (this.text) {
          this.text.exitEditing(); //退出编辑
          //如果之前有 就先清除
          if (this.text.text == "") {
            this.canvas.remove(this.text);
          }
        }
      }
    },
    color1(newColor) {
      this.canvas.freeDrawingBrush.color = newColor;
    },
  },
  created() {},
  mounted() {
    let canvas = new fabric.Canvas("main");
    // canvas.selectable = false; //控件不能被选择，不会被操作
    canvas.selection = false; //画板显示选中
    // canvas.skipTargetFind = false; //整个画板元素不能被选中
    this.canvas = canvas;
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.color = this.color1;
    this.canvas.freeDrawingBrush.width = 2;
    canvas.on("mouse:down", this.down);
    canvas.on("mouse:up", this.up);
    canvas.on("path:created", (options) => {
      //监听自由画笔
      options.path.on("selected", () => {
        if (this.mode === "clear") {
          this.canvas.remove(options.path);
        }
      });
    });
    this.cClientX = this.$refs.main.offsetParent.offsetLeft;
    this.cClientY = this.$refs.main.offsetParent.offsetTop;
  },
};
</script>
<style lang="less" scoped>
.canvas-box {
  height: 100%;
  width: 900px;
  .header {
    height: 80px;
    display: flex;
    flex-flow: row nowrap;
    background-color: rgba(245, 144, 162, 0.5);
    border-radius: 10px;
    align-items: center;
    justify-content: space-evenly;
  }
  .center {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  #main {
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
  }
}
</style>
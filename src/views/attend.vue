<template>
  <div class="attend-box">
    <div class="left">
      <div class="header"></div>
      <canvas height="600px" width="900px" id="main"></canvas>
    </div>
    <div class="right">
      <client-video ref="client" v-show="!over"></client-video>
      <div class="over" v-show="over">会议结束！</div>
      <div class="bottom">
        <chat user="attend"></chat>
      </div>
    </div>
    <el-button :disabled="over" class="leave" @click="leave"
      >结束会议</el-button
    >
  </div>
</template>

<script>
import Chat from "../components/chat/chat";
import ClientVideo from "../components/video/ClientVideo";
export default {
  components: {
    Chat,
    ClientVideo,
  },
  data() {
    return {
      data: null,
      over: false,
    };
  },
  mounted() {
    let canvas = new fabric.Canvas("main");
    canvas.selectable = false; //控件不能被选择，不会被操作
    canvas.selection = false; //画板显示选中
    canvas.skipTargetFind = true; //整个画板元素不能被选中
    this.sockets.subscribe(`canvas`, (data) => {
      canvas.clear();
      canvas.loadFromJSON(data[0], canvas.renderAll.bind(canvas));
    });
    this.sockets.subscribe("bossleaved", ([room, name] = data) => {
      //监听会议结束
      console.log("---------bossleaved");
      this.leave();
      this.over = true;
    });
  },
  methods: {
    leave() {
      this.$confirm("是否离开会议?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "结束会议!",
          });
          this.$socket.emit("leave", {
            code: this.$route.params.id,
            name: this.$route.params.name,
          });
          this.$refs.client.closePreeConnection();
          this.over = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.attend-box {
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/04.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  padding: 10px 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  #main {
    margin-top: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    height: 500px;
  }
  .left {
    .header {
      height: 80px;
      border-radius: 10px;
      background-color: rgba(245, 144, 162, 0.5);
    }
  }
  .right {
    height: 80vh;
    display: flex;
    flex-flow: column nowrap;
    margin-left: 10px;
  }
  .over {
    border: #fff solid 2px;
    box-sizing: border-box;
    border-radius: 10px;
    width: 280px;
    height: 211px;
    text-align: center;
    line-height: 211px;
    font-size: 20px;
    text-shadow: 7px 7px 12px black;
  }
  .leave {
    position: absolute;
    right: 40px;
    top: 40px;
  }
}
</style>
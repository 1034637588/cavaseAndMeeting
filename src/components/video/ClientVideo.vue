<template>
  <div>
    <video
      width="280"
      height="211"
      id="remotevideo"
      autoplay
      playsinline
    ></video>

  </div>
</template>

<script>
export default {
  data() {
    return {
      pClient: null,
    };
  },
  created() {
    this.connect();
  },
  destroyed() {
    // this.leave();
  },
  methods: {
    connect() {
      this.createPeerConnection(); //创建连接
      this.sockets.subscribe("message", ([code, data] = datas) => {
        console.log("getMsg-----------------", data.msg.type);
        if (data.msg.type === "offer" && data.socketId === this.socketID) {
          //被调用方 收到offer后
          this.pClient.setRemoteDescription(
            new RTCSessionDescription(data.msg)
          );
          this.pClient
            .createAnswer()
            .then((e) => this.getAnswer(e, this.socketID))
            .catch(this.handleAnswerError);
        }
        if (data.msg.type === "candidate" && data.socketId === this.socketID) {
          console.log("candidate");
          this.pClient.addIceCandidate(data.msg.data);
        }
      });
    },
    sendMessage(code, data, socketId) {
      if (this.$socket) {
        this.$socket.emit(
          "message",
          data,
          code,
          this.$route.params.name,
          socketId
        );
      }
    },
    leave() {
      if (this.$socket) {
        this.$socket.emit("leave", {
          code: this.$route.params.id,
          name: this.$route.params.name,
          socketID: this.socketID,
        });
      }
      this.closePreeConnection();
    },
    closePreeConnection() {
      //销毁连接
      console.log("closePreeConnection");
      if (this.pClient) {
        this.pClient.close();
        this.pClient = null;
      }
    },
    getAnswer(desc, socketId) {
      console.log("getAnswer--------------");
      this.pClient.setLocalDescription(desc);
      this.sendMessage(this.$route.params.id, desc, socketId);
    },
    handleAnswerError(error) {
      console.log(error);
    },
    createPeerConnection() {
      console.log("createPeerConnection--------------");
      if (!this.pClient) {
        this.pClient = new RTCPeerConnection();
        this.pClient.onicecandidate = (e) => {
          if (e.candidate) {
            //当发现candidate后 发送出去
            this.sendMessage(
              this.$route.params.id,
              {
                type: "candidate",
                data: e.candidate,
              },
              this.socketID
            );
          }
        };
        this.pClient.ontrack = (e) => {
          console.log("ontrack-------------", e);
          remotevideo.srcObject = e.streams[0];
        }; //数据通了的时候
      }
    },
  },
};
</script>

<style lang="less" scoped>
#remotevideo {
  border: #fff solid 2px;
  box-sizing: border-box;
  border-radius: 10px;
}
</style>
<template>
  <div>
    <video muted id="localvideo" width="280" height="211" autoplay playsinline></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localStream: null,
      pBoos: null,
      peerList: {},
    };
  },
  mounted() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("不支持navigator.mediaDevices");
      return;
    } else {
      let constraints = {
        video: true,
        audio: true,
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this.getMediaStream)
        .catch(this.handlError);
    }
  },
  destroyed() {
    this.closePreeConnection();
    this.closeLocalMedia();
  },
  methods: {
    getMediaStream(stream) {
      localvideo.srcObject = stream;
      this.localStream = stream;
      this.conn(); //与scoketio进行连接 并且接受服务器消息
    },
    handlError(error) {
      console.log(error);
    },
    conn() {
      this.sockets.subscribe("otherjoined", ([room, name, socketId,nums] = data) => {
        console.log("otherjoined---------", room, socketId,nums);
        this.createPeerConnection(socketId); //创建连接
        this.$emit("getNums",nums);
      });
      this.sockets.subscribe("message", ([code, data] = datas) => {
        console.log("message------------------------++++");
        //监听answer
        if (data.msg.type === "answer") {
          console.log("answer------------------------");
          //调用者收到回答的answer
          this.peerList[data.socketId].setRemoteDescription(
            new RTCSessionDescription(data.msg)
          ); //设置调用方的dcp
        }
        if (data.msg.type === "candidate") {
          this.peerList[data.socketId].addIceCandidate(data.msg.data);
        }
      });

      this.sockets.subscribe("otherleaved", ([room, name, socketID]=data) => {
        console.log(room, name, socketID, "otherleaved------------------");
        this.peerList[socketID].close && this.peerList[socketID].close();
        this.peerList[socketID] = null;
        this.$emit("getNums",-1);
      });
    },
    createPeerConnection(socketId) {
      this.pBoos = new RTCPeerConnection();
      this.pBoos.onicecandidate = (e) => {
        // console.log("candidate---------", e);
        if (e.candidate) {
          //当发现candidate后 发送出去（潜在的连接端点称为 ICE 候选者。）
          this.sendMessage(
            this.$route.params.id,
            {
              type: "candidate",
              data: e.candidate,
            },
            socketId
          );
        }
      };
      //媒体协商 先添加流
      this.localStream.getTracks().forEach((track) => {
        //将本地采集的音视频流添加到pBoos中 调用者中
        this.pBoos.addTrack(track, this.localStream);
      });
      //媒体协商
      let offerOptions = {
        offerToRecieveAudio: 1,
        offerToRecieveVideo: 1,
      };
      this.pBoos
        .createOffer(offerOptions)
        .then((e) => this.getOffer(e, socketId))
        .catch(this.handleOfferError);
      this.peerList[socketId] = this.pBoos;
    },
    getOffer(desc, socketId) {
      console.log(socketId, "----------getOffer");
      this.pBoos.setLocalDescription(desc);
      this.sendMessage(this.$route.params.id, desc, socketId); //发送给接受端
    },
    handleOfferError(error) {
      console.log(error);
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
    closePreeConnection() {
      //销毁连接
      console.log("closePreeConnection");
      if (this.peerList) {
        console.log(this.peerList);
        //全部清理掉
        for (let id in this.peerList) {
          this.peerList[id].close && this.peerList[id].close();
          this.peerList[id] = null;
        }
      }
    },
    closeLocalMedia() {
      if (this.localStream && this.localStream.getTracks()) {
        this.localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      this.localStream = null;
      console.log("closeLocalMedia");
    },
  },
};
</script>

<style lang="less" scoped>
#localvideo {
  border: #fff solid 2px;
  box-sizing: border-box;
  border-radius: 10px;
}
</style>
<template>
  <div class="home_box">
    <div @click="showInput('boss')" class="left">
      <span class="tittle">创建会议</span>
    </div>
    <div @click="showInput('user')" class="right">
      <span class="tittle">加入会议</span>
    </div>
    <transition name="Binput">
      <div class="input B" v-show="BisShow">
        <el-input v-model="setcode" placeholder="请设置会议码"></el-input>
        <el-input v-model="bossName" placeholder="输入姓名"></el-input>
        <el-button @click="makeMeeting">发起会议</el-button>
      </div>
    </transition>
    <transition name="Uinput">
      <div class="input U" v-show="UisShow">
        <el-input v-model="incode" placeholder="请输入会议码"></el-input>
        <el-input v-model="userName" placeholder="输入姓名"></el-input>
        <el-button @click="joinMeeting">加入会议</el-button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      setcode: "",
      incode: "",
      bossName: "",
      userName: "",
      BisShow: false,
      UisShow: false,
    };
  },
  mounted() {
    this.sockets.subscribe("bossjoined", ([room, id] = data) => {
      //会议成共发布
      window.localStorage.setItem(`boss${room}`, true);
      this.$router.push({
        name: "hold",
        params: { id: this.setcode, name: this.bossName },
      });
    });
    this.sockets.subscribe("errorMake", ([room, id] = data) => {
      this.$message("此房间号已经被占用");
    });
    this.sockets.subscribe("userjoined", ([room, id] = data) => {
      //用户成功加入
      window.localStorage.setItem(`user${room}`, true);
      this.$options._base.prototype.socketID = id;
      this.$router.push({
        name: "attend",
        params: { id: this.incode, name: this.userName },
      });
    });
    this.sockets.subscribe("noRoom", (data) => {
      this.$message("暂时没有此会议房间");
    });
  },
  methods: {
    showInput(e) {
      if (e == "boss") {
        this.BisShow = true;
        this.UisShow = false;
      } else {
        this.BisShow = false;
        this.UisShow = true;
      }
    },
    makeMeeting() {
      //发起会议
      if (this.setcode == "" || this.bossName == "") {
        this.$message("请输入用户名或者会议ID");
        return;
      }
      console.log("发起会议");
      this.$socket.emit("makeMeeting", {
        code: this.setcode,
        name: this.bossName,
      });
    },
    joinMeeting() {
      if (this.incode == "" || this.userName == "") {
        this.$message("请输入用户名或者会议ID");
        return;
      }
      console.log("加入会议");
      this.$socket.emit("joinMeeting", {
        code: this.incode,
        name: this.userName,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.home_box {
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/04.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  .left,
  .right {
    width: 400px;
    height: 200px;
    padding: 10px;
    border-radius: 10px;
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0px 0px 10px 10px white;
    transition: 1s;
    .tittle {
      font-weight: 700;
      text-shadow: 3px 3px 10px #fff;
      letter-spacing: 3px;
      color: #333;
    }
    &:hover {
      transform: translateY(-45%) scale(1.05);
      box-shadow: 0px 0px 1px 5px white;
    }
  }
  .left {
    background-image: url("../assets/images/01.jpg");
    left: 250px;
  }
  .right {
    background-image: url("../assets/images/02.jpg");
    right: 250px;
  }
  .input {
    padding: 0 10px;
    width: 400px;
    height: 80px;
    background-color: thistle;
    display: flex;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
    border-radius: 10px;
    &.B {
      background-color: rgba(245, 144, 162, 0.5);
    }
    &.U {
      background-color: rgba(38, 141, 236, 0.5);
    }
  }
  .Binput-enter-active,
  .Binput-leave-active,
  .Uinput-enter-active,
  .Uinput-leave-active {
    transition: 0.5s;
  }
  .Binput-enter,
  .Binput-leave-to {
    transform: translateX(-1500px);
  }
  .Uinput-enter,
  .Uinput-leave-to {
    transform: translateX(1500px);
  }
}
</style>
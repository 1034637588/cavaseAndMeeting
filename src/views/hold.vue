<template>
  <div class="box">
    <draw-board></draw-board>
    <div class="chat">
      <boss-video @getNums="getNums" ref="boss"></boss-video>
      <div class="bottom">
        <chat user="hold"></chat>
      </div>
    </div>
    <el-button class="leave" @click="leave">结束会议</el-button>
    <div class="nums">
      在线人数：<span class="num">{{ nums }}</span>
    </div>
  </div>
</template>

<script>
import DrawBoard from "../components/DrawBoard/DrawBoard";
import BossVideo from "../components/video/BoosVideo";
import Chat from "../components/chat/chat";
export default {
  components: {
    DrawBoard,
    Chat,
    BossVideo,
  },
  data() {
    return {
      nums: 0,
    };
  },
  methods: {
    getNums(nums) {
      if (nums == -1) {
        this.nums--;
      } else {
        this.nums = nums;
      }
    },
    leave() {
      this.$confirm("是否结束会议?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "结束会议!",
          });
          this.$refs.boss.closePreeConnection();
          this.$refs.boss.closeLocalMedia();
          this.$socket.emit("bossleave", {
            code: this.$route.params.id,
            name: this.$route.params.name,
          });
          this.$router.push("/");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  }
};
</script>

<style lang="less" scoped>
.box {
  padding: 10px 0;
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/04.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  .chat {
    margin-left: 10px;
    width: 280px;
    display: flex;
    flex-flow: column nowrap;
  }
  .leave {
    position: absolute;
    right: 40px;
    top: 40px;
  }
  .nums {
    position: absolute;
    right: 30px;
    top: 90px;
    width: 115px;
    height: 39.6px;
    background-color: rgba(245, 144, 162, 0.2);
    text-align: center;
    line-height: 39.6px;
    border-radius: 3px;
    font-size: 12px;
    color: white;
    .num {
      font-size: 17px;
      color: tomato;
    }
  }
}
</style>
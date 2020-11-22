<template>
  <div class="chat-box">
    <div class="top" ref="top">
      <li
        :class="[
          item.msg.type.substr(1) === 'myChat' ? 'right' : 'left',
          item.msg.type.substr(0, 1) === '_' ? 'boss' : '',
        ]"
        class="item"
        v-for="(item, index) in allMsg"
        :key="index"
      >
        <span class="name">{{ item.name }}</span
        ><span class="msg">{{ item.msg.data }}</span>
      </li>
    </div>
    <div class="bottom">
      <el-input @focus="focus" @blur="blur" v-model="msg"></el-input>
      <el-button @click="sendMsg">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: String,
  },
  data() {
    return {
      msg: "",
      allMsg: [],
      isfocus: false,
    };
  },
  mounted() {
    let room = this.$route.params.id;
    this.sockets.subscribe("message", ([room, data] = datas) => {
      if (data.msg.type.substr(1) == "chat") {
        this.allMsg.push(data);
      }
    });
    this.sockets.subscribe(
      "otherjoined",
      ([room, name, socketId, nums] = data) => {
        this.allMsg.push({
          msg: {
            data: "加入会议",
            type: "goLeave",
          },
          name: name
        });
      }
    );
    this.sockets.subscribe("otherleaved", ([room, name, socketID] = data) => {
      this.allMsg.push({
        msg: {
          data: "离开会议",
          type: "goLeave",
        },
        name: name
      });
    });
    window.onkeypress = this.onkeypress;
  },
  methods: {
    focus() {
      this.isfocus = true;
    },
    blur() {
      this.isfocus = false;
    },
    sendMsg() {
      if (!this.msg) {
        return;
      }
      this.$socket.emit(
        "message",
        { data: this.msg, type: this.user === "hold" ? "_chat" : "*chat" },
        this.$route.params.id,
        this.$route.params.name
      );
      this.allMsg.push({
        msg: {
          data: this.msg,
          type: this.user === "hold" ? "_myChat" : "*myChat",
        },
        name: this.$route.params.name,
      });
      this.msg = "";
    },
    onkeypress(e) {
      if (e.key == "Enter" && this.isfocus) {
        if (!this.msg) {
          return;
        }
        this.sendMsg();
      }
    },
  },
  updated() {
    this.$refs.top.scrollTop = this.$refs.top.scrollHeight;
    console.log(this.$refs.top.scrollHeight + "---updated");
  },
  watch: {
    allMsg() {
      console.log(this.$refs.top.scrollHeight + "---watch");
    },
  },
};
</script>

<style lang="less" scoped>
.chat-box {
  height: 480px;
  width: 280px;
  border: 1px solid #fff;
  border-radius: 10px;
  display: flex;
  flex-flow: column nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  .top {
    flex: 1;
    overflow: scroll;
    .item.left,
    .item.right {
      margin: 10px 0;
      display: flex;
      position: relative;
      padding-left: 10px;
      align-items: center;
      .name {
        width: 40px;
        height: 35px;
        background-color: #ccc;
        position: absolute;
        border-radius: 5px;
        right: 10px;
        padding: 0 3px;
        color: #fff;
        font-size: 12px;
        line-height: 35px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .msg {
        margin-right: 65px;
        border-radius: 5px;
        padding: 10px;
        background-color: #fff;
        margin-left: auto;
        color: #666;
      }
    }
    .item.left {
      .name {
        left: 10px;
      }
      .msg {
        margin-right: auto;
        margin-left: 55px;
      }
      &::after {
        content: "";
        border-style: solid;
        border-color: transparent #fff transparent transparent;
        border-width: 5px;
        position: absolute;
        left: 55px;
      }
    }
    .item.right {
      &::after {
        content: "";
        border-style: solid;
        border-color: transparent transparent transparent #fff;
        border-width: 5px;
        position: absolute;
        right: 55px;
      }
    }
    .item.boss {
      .name {
        background-color: #d62828;
      }
    }
  }
  .bottom {
    display: flex;
  }
}
</style>
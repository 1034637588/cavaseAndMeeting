 - 目录结构
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20201127142125606.png)
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20201127142328971.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0ODEyODM1,size_16,color_FFFFFF,t_70)
 - 该项目主要实现一对多会议直播，实时会议画板，和群聊功能
 - 会议直播主要用webRTC进行开发，画板使用fabric.js以对象的方式进行开发，通信主要使用socket.io、vue-socket.io
 - 项目启动
 - npm install 安装依赖 
 - 1、首先在使用webRTC是需要https的，但在开发时可以通过设置Chrome来进行开发
 -  1)点桌面上的Chrome图票，右键->属性，把目票输入框中的内容换成以下内容
 - `"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --unsafely-treat-insecure-origin-as-secure="http://ip:port" --user-data-dir=本地目录`
把字符串中的ip:port换成你自己的服务器的ip加端口，本地目录就是你自己本地一个文件夹
2)再重启chrome就可以了
 - 然后启动server下的信令服务器
 - 再npm run start就可以运行项目了

相关文档
[http://fabricjs.com/](http://fabricjs.com/)
[https://socket.io/](https://socket.io/)
[https://www.npmjs.com/package/vue-socket-io](https://www.npmjs.com/package/vue-socket-io)
项目运行效果：
主页面
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201127143943488.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0ODEyODM1,size_16,color_FFFFFF,t_70)
创建会议
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201127144018617.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0ODEyODM1,size_16,color_FFFFFF,t_70)
通信效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201127144122146.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0ODEyODM1,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201127144148135.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0ODEyODM1,size_16,color_FFFFFF,t_70)


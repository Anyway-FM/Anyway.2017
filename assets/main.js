var g = new Vue({
  el: '#game',
  data: {
    onOpening: true,
    moveSpeed: 10,
    messageShow: false,
    y: 600,
    inScrolling: false,
    statusNow: 'standing',
    jjShow: true,
    currentBGM: 'opening',
    currentMessage: '旁白',
    currentMessage: '2333',
    currentMessageId: 0,
    currentSpeaker: 'JJ',
    downPressed: false,
    sceneNumber: 5,
    shakeIt: false,
    jumpNow: false,
    scaleIt: false,
    magicCount: 0,
    currentLevel: 1,
    currentNotification: '你还真按了啊……',
    currentCharacter: 'hulk',
    arrowStatus: 'none',
    btnAStatus: 'normal',
    btnBStatus: 'normal',
    sceneHeight: '400',
    sceneMoveOffset: '0',
    totalPercent: 0,
    characterList: [
     'linda',
     'hulk',
     'tom'
    ],
    currentInterval: 0,
    nickName: '',
    showIndication: true,
    jjNewPosition: false,
    leonNewPosition: false,
    gameEnding: false,
  },
  watch: {
    y: function () {
      g.totalPercent = Math.floor( g.y / ( g.sceneHeight * ( g.sceneNumber - 0.3) - g.sceneMoveOffset)  * 100 )
      if (g.totalPercent == 99) {
        g.totalPercent = 100
      }
    }
  },
  methods: {
    startGame: function () {
      g.onOpening = false
    },
  	scrollStart: function () {
      g.inScrolling = true
      if (!g.messageShow) {
          g.currentInterval = setInterval("g.scrollDown(1)",g.moveSpeed)
      }
      g.downPressed = true
      g.statusNow = 'walking'
      g.arrowStatus = 'down'
      event.preventDefault()
  	},
    scrollDown: function(offset){
      if (!g.messageShow) {
        var matrix = window.getComputedStyle(document.getElementById('map-inner')).transform.replace(/[^0-9\-.,]/g, '').split(',')
        g.y = matrix[5] - offset

        document.getElementById("map-inner").style.transform = "translateY(" + g.y + "px)"
        document.getElementById("map-mask-inner").style.transform = "translateY(" + g.y + "px)"
        document.getElementById("map-behind-inner").style.transform = "translateY(" + g.y + "px)"

        g.y = - g.y
        console.log(g.y)
        checkProgress(g.y)
      }
    },
    showDialog: function () {
      if (messageData[g.currentMessageId][1] == 'Leon') {
        g.statusNow = 'talking1'
      }
      else if (messageData[g.currentMessageId][1] == 'JJ') {
        g.statusNow = 'talking3'
      }
      else {
        g.statusNow = 'talking2'
      }
      g.currentMessage = messageData[g.currentMessageId][0]

      if ( messageData[g.currentMessageId][1] == 'You' ) {
        g.currentSpeaker = g.nickName
        if (g.currentSpeaker == '') {
          g.currentSpeaker = 'You'
        }
      }
      else {
        g.currentSpeaker = messageData[g.currentMessageId][1]
      }

      g.messageShow = true
      g.currentMessageId++
      console.log('Next ID:' + g.currentMessageId)
    },
    scrollStop: function () {
      clearInterval(g.currentInterval)
      g.inScrolling = false
      g.downPressed = false
      if (!g.messageShow) {
        g.statusNow = 'standing'
      }
      g.arrowStatus = 'none'
  	},
    btnA: function () {
      event.preventDefault()
      g.scrollStop()
      g.btnAStatus = 'pressed'
      if (messageData[g.currentMessageId-1][2] != 0) {
        g.showDialog()
      }
      else {
        g.messageShow = false
        g.statusNow = 'standing'
      }
      g.btnAStatus = 'normal'
    },
    btnB: function () {
      event.preventDefault()
      g.jumpNow = false
      g.btnBStatus = 'normal'
    },
    btnUp: function () {
      event.preventDefault()
      n = Math.floor(Math.random()*16)
      g.shakeIt = true
      g.currentNotification = btnArrowMessage[n]
      g.showNotification = true
      g.arrowStatus = 'up'
      g.magicCount ++
    },
    btnLeft: function () {
      event.preventDefault()
      n = Math.floor(Math.random()*16)
      g.shakeIt = true
      g.currentNotification = btnArrowMessage[n]
      g.showNotification = true
      g.arrowStatus = 'left'
      g.magicCount ++
    },
    btnRight: function () {
      event.preventDefault()
      n = Math.floor(Math.random()*16)
      g.currentNotification = btnArrowMessage[n]
      g.shakeIt = true
      g.showNotification = true
      g.arrowStatus = 'right'
      g.magicCount ++
    },
    btnAPressed: function () {
      g.btnAStatus = 'pressed'
    },
    btnBPressed: function () {
      g.btnBStatus = 'pressed'
      g.jumpNow = true
    },
    btnArrowLifted: function () {
      g.arrowStatus = 'none'
    },
    selectCharacter: function (name) {
      console.log(name)
      g.currentCharacter = name
    },
    doNothing: function () {
      event.preventDefault()
      g.arrowStatus = 'none'
    },
    changeFormation: function () {
      g.jjNewPosition = !g.jjNewPosition
      g.leonNewPosition = !g.leonNewPosition
      console.log('New Foramtion!');
    }
  }
})

// Disable Double Tap Zooming
var lastTouchEnd = 0
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime()
  if (now - lastTouchEnd <= 300) {
    event.preventDefault()
  }
  lastTouchEnd = now
}, false)

window.onload = function(){
  initProcess()

}
window.onresize = function(){
  initProcess()
}

initProcess = function() {
  fullWidth = window.getComputedStyle(document.getElementById('mask-bottom')).width.replace(/[^-\d\.]/g, '')
  paddingBottom = fullWidth / 1.53
  paddingTop = fullWidth / 6
  paddingLeft = fullWidth / 6.16
  screenWidth = fullWidth / 1.44
  document.getElementById("dialog").style.bottom = paddingBottom + "px"
  document.getElementById("dialog").style.height = fullWidth / 4.49 + "px"

  document.getElementById("on-screen").style.marginTop = paddingTop + "px"
  document.getElementById("on-screen").style.marginLeft = paddingLeft + "px"
  document.getElementById("on-screen").style.width = screenWidth + "px"

  document.getElementById("btns").style.height = paddingBottom + "px"

  g.sceneHeight = window.getComputedStyle(document.getElementById('scene-1')).height.replace(/[^-\d\.]/g, '')

  g.sceneMoveOffset = parseInt(window.getComputedStyle(document.getElementById('players')).top.replace(/[^-\d\.]/g, ''))
  console.log('Scene Height: '+ g.sceneHeight)
  console.log('Scene Move Offset: '+g.sceneMoveOffset)
}

checkProgress = function(y) {
  switch (y) {
    case 10:  //开场
      g.showIndication = false
      audioAutoPlay('game-bgm')
    break
    case 30:  //开场
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 0.72 - g.sceneMoveOffset): // 邮报
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 1 - g.sceneMoveOffset): // 换场景
      g.currentLevel++
      stopAudio('game-bgm')
      audioAutoPlay('game-bgm-2')
    break
    case Math.round(g.sceneHeight * 1.15 - g.sceneMoveOffset): // 隐藏 JJ
      g.jjShow = false
    break
    case Math.round(g.sceneHeight * 1.2 - g.sceneMoveOffset): // 隐藏 JJ
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 1.65 - g.sceneMoveOffset): // Zhihu
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 2.02 - g.sceneMoveOffset): // JJ 回来了
      g.showDialog()
      g.jjShow = true
      g.currentLevel++
    break
    case Math.round(g.sceneHeight * 2.1 - g.sceneMoveOffset): // JJ 回来了
      g.changeFormation()
    break
    case Math.round(g.sceneHeight * 2.3 - g.sceneMoveOffset): // 演播室
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 2.85 - g.sceneMoveOffset): // 新设备
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 3 - g.sceneMoveOffset): // 进第四关
      g.currentLevel++
      audioAutoPlay('opening-bgm')
    break
    case Math.round(g.sceneHeight * 3.3 - g.sceneMoveOffset): // 深圳
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 3.8 - g.sceneMoveOffset): // 「套路」
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 4 - g.sceneMoveOffset): // 进第五关
      g.currentLevel++
    break
    case Math.round(g.sceneHeight * 4.3 - g.sceneMoveOffset): // iTunes
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 4.55 - g.sceneMoveOffset): // 网易
      g.showDialog()
    break
    case Math.round(g.sceneHeight * 4.6 - g.sceneMoveOffset): // 结尾
      g.changeFormation()
    break
    case Math.round(g.sceneHeight * 4.7 - g.sceneMoveOffset): // 结尾
        g.gameEnding = true;
        g.scrollStop()
        g.showDialog()
    break
    default: break
  }
}

var messageData =
[
  // 开场
  ["别人家的年度总结都红红火火的，你们的为啥气氛这么阴暗！","You",1],
  ["这个…… 你就要问 Leon 了……","JJ",1],
  ["最近我沉迷「荒野之息」，所以美术是右边那个光头网上扒的~","Leon",1],
  ["那也不至于要把贵台的名字刻在我身后那个墓碑上吧……","You",1],
  ["没办法，开源的像素风素材就这么点，不要浪费嘛哈哈哈~","JJ",1],
  ["再说这个寓意也不错呀~ 纪念一下 Anyway.FM 的逝去的 2017 年~","JJ",0],
  // 安妮薇邮报
  ["这么浮夸的一个邮筒是不是风格不太统一啊两位大哥……","You",1],
  ["习惯一下就好了…… 凡是重点突出的物品都是发生了特殊事件~","Leon",1],
  ["嗯，邮筒代表的是我台今年第一件大事：Anyway.Post ~","JJ",1],
  ["也就是「安妮薇邮报」，去年年初创刊的邮件组，推送设计资讯~","Leon",1],
  ["现已发行 21 期，订阅人数 2000+，Leon 最近也开始写专栏啦~","JJ",0],
  // JJ 掉了
  ["那个叫啥…… JJ 好像掉水里了……","You",1],
  ["噗…… 估计他自己写的程序出 bug 了，别管他，继续走~","Leon",1],
  ["好吧…… 中国好搭档……","You",0],
  //知乎 Live
  ["桥上那只动物到底是啥…… 经常看到但一直没搞懂……","You",1],
  ["是知乎的吉祥物啦~「刘看山」是一只北极狐~","Leon",1],
  ["难怪这个场景切换这么生硬……","You",1],
  ["嘿嘿~ 今年我们第一次办了知乎 Live","Leon",1],
  ["核心主题是「别随便入 UI 这行」","Leon",1],
  ["听起来跟一般「七天学会 XXX」的货色好像不太一样","You",1],
  ["唉，太毒鸡汤了，所以没啥人听，不提了……","Leon",1],
  ["哈哈哈哈","You",0],
  // JJ 回来了
  ["终于游上来了，差点淹死，你们也不来救我一下……","JJ",1],
  ["你这个破游戏除了往下走啥功能都没有，怎么救啊？","Leon",1],
  ["两位大哥别吵了，为防不测，我们靠拢一点儿走吧……","You",0],
  //新工位
  ["这个看起来有两百平的房间就是你们的录音专用办公室了吗？？","You",1],
  ["还得再往前走走…… 我们的真·演播室 10 平米都不到哈哈哈哈","Leon",1],
  ["但好歹我们有了正式的办公空间啦，就在「米域」~","JJ",0],
  //新设备
  ["在过去的 2017 年里，我们更新了录音设备","JJ",1],
  ["两台舒尔 MV 51，哈哈哈哈，我亲自挑的","Leon",1],
  ["终于再也没人吐槽我们音质差了","JJ",1],
  ["但还是有人吐槽你声音难听……","Leon",1],
  ["确实还是 Leon 声音好听一点儿……","You",1],
  ["信不信我把你俩一起烧了…… 你按下「⇧ 键」试试……","JJ",0],
  //深圳
  ["怎么穿越到春运现场了…… 这是…… 机场？","You",1],
  ["给你个提示，这里是全国最能逼死密集恐惧症患者的机场","JJ",1],
  ["……","You",1],
  ["哈哈哈，是深圳机场啦~","Leon",1],
  ["今年我们办了两次线下活动，其中一次就在深圳哦~","JJ",1],
  ["两年来我们已经去过四个城市，见过 310 人次的听众啦~","Leon",0],
  // 套路
  ["一般来说年度总结总要有个「列数字环节」吧~","You",1],
  ["嗯，你已经熟悉我们的套路了，马上就来了","JJ",0],
  // iTunes
  ["先要感谢大家积极响应我们的「音频弹窗」，哈哈哈","Leon",1],
  ["哈哈哈哈，我们在 iTunes 播客上终于有 100 条评论/打分了~","JJ",0],
  // 网易
  ["不过现在我们的主推平台还是网易云音乐，毕竟用的人多~","JJ",1],
  ["嗯，2017 年 10 月，我们在网易上的订阅数终于破万啦！","Leon",0],
  // Ending
  ["今年好看的数字不多，就列这两个吧~","JJ",1],
  ["嗯，主要还是想感谢大家一年来的陪伴~","Leon",1],
  ["（屁咧…… 明明就是假期快到了，懒得做下去了……）","You",1],
  ["咳…… 咳…… Anyway，光头大哥，应该出分享提醒了……","Leon",1],
  ["不存在的，我最讨厌诱导分享了","JJ",1],
  ["真想要分享的，现在啥浏览器不能方便地一键分享啊~","JJ",1],
  ["噗…… 那好吧，我们狗年再见啦~ ","Leon",1],
  ["新年快乐~ 我们一直在老地方等你哦~ https://Anyway.FM ","JJ",0]
]

var btnArrowMessage =
[
  '只能往下走啊，别试其他的了……',
  '你知道补完四个方向所有动作的 GIF 有多少工作量吗？啊？你知道吗？',
  '真没写完代码……再按也没用……',
  '大过年的，行行好吧……',
  '快快快，往下走！',
  '既然这么闲，那我们来聊个 5 块吧~',
  '啊！别再调戏我了，我只是个普通的「十字键」啊！',
  '麻烦你去按一会儿隔壁那个「B键」好吗？啊？',
  '快继续往下走吧，底下三个小人都等不及了！',
  '再按我就要爆炸啦！',
  '作为一个游戏机我也是有底线的好么！',
  '你这么有耐心，再按 99 次试试看好了……',
  '喂？这里是 110 吗？有人一直在戳我',
  '你以为是玩街霸啊！搓不出升龙拳的！',
  '求求你了亲……咱别再按了，我让 Leon 发你红包行不？',
  '再按 36 次你就成仙了……'
]

function audioAutoPlay(id){
  var audio = document.getElementById(id),
      play = function(){
          audio.play()
          document.removeEventListener("touchstart",play, false)
      }
  audio.play()
  document.addEventListener("WeixinJSBridgeReady", function () {
      play()
  }, false)
  document.addEventListener('YixinJSBridgeReady', function() {
      play()
  }, false)
  document.addEventListener("touchstart",play, false)
}

function stopAudio(id){
  var audio = document.getElementById(id),
      pause = function(){
          audio.pause()
          document.removeEventListener("touchstart",pause, false)
      }
  audio.pause()
  document.addEventListener("WeixinJSBridgeReady", function () {
      pause()
  }, false)
  document.addEventListener('YixinJSBridgeReady', function() {
      pause()
  }, false)
  document.addEventListener("touchstart",pause, false)
}

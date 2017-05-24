/* 
* @Author: hs
* @Date:   2015-04-29 17:13:25
* @Last Modified time: 2017-05-23 19:58:23
*/
$(document).ready(function($) {
    var aidurl = '/shenqu/zbj/getAnchorId.do?cid=';
    var listurl = '/shenqu/zbj/listZbjCenter.do?aid=';
    var isReady = false;
    var isUserLogin = false;
    var info = null;
    var isSub = false;
    var isAjaxIsSubscribed = false;
    var isSubscriedLiving = false;
    
    var nopage = 1;
    var _data,aid,sid,anHeight,anWidth,anTop,anLeft,videoHeight,videoWidth,anoHeight,anoWidth;
    var cid = GetArgsFromHref(window.location.href,"cid");
    var uid = GetArgsFromHref(window.location.href,"uid");
    var focusurl = 'http://shenqu.yy.com/zbj/isSubscribed.do?uid='+uid+'&aid=';
    var clickfoc = 'http://shenqu.yy.com/zbj/subscriedLiving.do?uid='+uid+'&cid='+cid+'&isSub=false';
    var img = 'http://s1.yy.com/shenqu/site/ext/pcc/images/';
    var pagesize = (function(){
        var vheigh=GetArgsFromHref(window.location.href,"videoW");
        var result = 6;
        anHeight = 124;
        anWidth = 164;
        anoHeight = 108;
        anoWidth = 143;
        anTop = -8;
        anLeft = -11;
        videoHeight = 360;
        videoWidth = 480;
        switch(vheigh){
            case "640":
              $(".header,.focus-btn,.maincontent").addClass("v_480");
              videoHeight = 480;
              videoWidth = 640;
              result = 12;
              break;
            case "400":
              $(".header,.focus-btn,.maincontent").addClass("v_400");
              videoHeight = 300;
              videoWidth = 400;
              result = 4;
              break;
            case "320":
              $(".maincontent,.go-index").addClass("v_320");
              videoHeight = 240;
              videoWidth = 320;
              result = 2;
              break;
            default:
              result = 6;
              break;
        }
        return result;
    })();
    
    var playId;

    /*fan hiido*/
    var STAT_ID = 10006059;
    var feventid = 10005121;
    var STAT_VISIT = 'visit';
    var STAT_PLAY = 'play';
    var danmakuOpen = "dmon";
    var danmakuClose = "dmoff";
    var STAT_LISTCLICK = 'listclick';

    playId = "videoPlayer_0";

    hiidoStat(STAT_ID,STAT_VISIT);
     //新统计
    function hiidoStat(eventId,type,resid,uid) {//发送hiido
        var params = {
            "act": "webevent",
            "eventid": eventId,//EVENTID
            "value" : 1,//VALUE
            "eventype" : 1,//EVENTTYPE
            "class1" :'ent',//表示娱乐
            "class2" :'shenqusite',// 表示神曲站点
            "bak1" : 'zbjc',
            "bak2" : resid,//resid  神曲ID,
            "bak3" : type,//表示动作
            "parm3" : ''
        };
        if (uid) {
            params.uid = uid;
        }
        if (window.appHiido) {
            window.appHiido.stat(params);
        }
    }
     //add  IE8 support
    if (!Array.prototype.indexOf)
    {
      Array.prototype.indexOf = function(elt /*, from*/)
      {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
          from += len;

        for (; from < len; from++)
        {
          if (from in this &&
              this[from] === elt)
            return from;
        }
        return -1;
      };
    }
    function loadData(url,success,error){
        $.ajax({
          url: url,
          type: 'get',
          dataType: 'json',
          cache : false
        })
        .done(function(data) {
          success(data);
        })
        .fail(function(message) {
        });
    }
  
     function GetArgsFromHref(sHref, sArgName){
       var args    = sHref.split("?");
       var retval = ""; 
       if(args[0] == sHref) /*参数为空*/
       {
            return retval; /*无需做任何处理*/
       }
       var str = args[1];
       args = str.split("&"); 
       for(var i = 0; i < args.length; i ++)
       {
           str = args[i];
           var arg = str.split("=");
           if(arg.length <= 1) continue;
           if(arg[0] == sArgName) retval = arg[1];
       }
       return retval;
     }

  function newInstance(obj,url,img){
      obj.jPlayer({
           ready: function () {
               $(this).jPlayer("setMedia", {
                 m4v: url,
                 poster: img
               });
               $(this).jPlayer("play");
               $.danmaku && $.danmaku.go(true);
//                 hiidoStat(STAT_ID,STAT_PLAY,resid);
               $(".errorTip").hide();
             },
           click:function(event){
             var noAllow = ["8.0","7.0","6.0"];
             if($.browser.msie && noAllow.indexOf($.browser.version) !=-1){
               if (event.jPlayer.status.paused == true){
                 $(this).jPlayer("play");
               }else{
                 $(this).jPlayer("pause");
               }
             }
           },
           play: function(event){
             if($.danmaku && $.danmaku._state){//检测弹幕开关的状态
               $.danmaku.go();
             }
           },
           pause:function(event){
             $.danmaku && $.danmaku.stop();
           },
           ended:function(event){
             $.danmaku && $.danmaku.stop();
             $(".playcontent").hide("5000");
           },
           resize:function(evnet){
             if($.danmaku && $.danmaku._state){
                $.danmaku.stop();
                $.danmaku.toggleActiveClass();
                $.danmaku.go();
             }else{
               $.danmaku && $.danmaku.toggleActiveClass();
             }
           },
           swfPath: "http://s1.yy.com/shenqu/common/site/",
           supplied: "m4v",
           size: {
             width: videoWidth+"px",
             height: videoHeight+"px",
             cssClass: "jp-video-360p"
           },
           useStateClassSkin: true,
           autoBlur: false,
           smoothPlayBar: true,
           keyEnabled: true,
           dbcfullscreen:false
      });
    }
  /*page event*/
  function bindChangePageEvent(){
       $(".footer").delegate('.prev,.next', 'click.shenqu', function(e) {
        var type = $(e.currentTarget).attr("class").split(" ")[0];
        switch(type){
          case "prev":
              if(nopage == 1)return;
              nopage--;
              var ssong = buldDom(_data);
              if(ssong.length !=0){
                $(".songlist").html(ssong.join(" "));
                $(".songlist").html(ssong.join(" "));
              }else{
                nopage++;
              }
          break;
          case "next":
              nopage++;
              var ssong = buldDom(_data);
              if(ssong.length !=0){
                $(".songlist").html(ssong.join(" "));
                $(".songlist").html(ssong.join(" "));
              }
              else
                nopage--;
          break;
        }
      var coutpage = _data.length % pagesize ==0?_data.length/pagesize:Math.floor(_data.length/pagesize)+1;
      if(nopage == 1){
        $(".prev").removeClass("active");
        if(_data.length>pagesize){
            $(".next").addClass("active");
        }
      }else if(nopage >= coutpage){
        $(".next,.prev").addClass("active");
        $(".next").removeClass("active").removeClass("active");
      }else{  
        $(".next,.prev").addClass("active").addClass("active");
      }
      });
    if(_data.length>pagesize){
      $(".next").addClass("active");
    }
    
  }
  /*build listHtml*/
  function buldDom(data){
      if($.isEmptyObject(data))return [];
      if(nopage > Math.floor(data.length/pagesize+1))return [];
      var html = [];
      var i = (nopage-1)*pagesize;
      var len = nopage*pagesize > data.length?data.length:nopage*pagesize;
      for(;i<len; i ++){
          var n = data[i];
          html.push('<li class="'+(n.songtype?n.songtype:"")+'" data-shorico="'+(n.snapshotURL?n.snapshotURL:"")+'" data-short="'+(n.shortVideoURL?n.shortVideoURL:"")+'" name="'+(n.worksUrl?n.worksUrl:n.longVideoURL)+'" title="'+(n.worksName?n.worksName:n.title)+'" desc="'+(n.description?n.description:"")+'" vid="'+(n.id?n.id:"")+'" aid="'+aid+'"><a href="javascript:void(0);"><img src="'+(n.snapshot?n.snapshot:n.snapshotURL)+'" ><i class="text"></i><p>'+(n.worksName?n.worksName:n.title)+'</p></a></li>');
      }
      return html;
  }
  /*bindClickEvent*/
  function bindClickEvent(){
    $(".songlist").delegate('li',"click",function(e){
        window.external.sendCommand('openvideownd', "http://shenqu.yy.com/ext/zbj/onlyplayer.html?url=" + $(this).attr("name") + "&vid=" + $(this).attr("vid") + "&aid=" + $(this).attr("aid")+"&from=zbjc",'640','514');
        hiidoStat(STAT_ID,STAT_LISTCLICK,$(this).attr("vid"));
    });
  }
   /*focus btn Event*/
  function bindfocusEvent(){
      if(aid == uid){
        $(".focus-btn").remove();
        return;
      }
      loadData(focusurl+aid,function(data){
        if(data.data && data.data.isSub){
              $(".focus-btn").remove();
              $(".header").html("TA的最新神曲");
        }else{
            $(".focus-btn").one("click.zbj",function(e){
                loadData(clickfoc,function(data){
                    if(data.data && data.data.result){
                        $(".focus-btn").addClass("success");
                        $(".focus-btn").html("已关注");
                        $(".header").html("TA的最新神曲");
                        $(".focus-btn").remove();
                        window.external.sendCommand('livenotifycallback',aid);
                    }else{
                        $(".focus-btn").addClass("error");
                        $(".focus-btn").html("失败");
                        setTimeout(function(e){
                            $(".focus-btn").html("关注TA");
                            $(".focus-btn").removeClass("error");
                            bindfocusEvent();
                        },5000);
                    }
                },function(e){
                    $(".focus-btn").addClass("error");
                    $(".focus-btn").html("失败");
                    setTimeout(function(e){
                        $(".focus-btn").html("关注TA");
                        $(".focus-btn").removeClass("error");
                        bindfocusEvent();
                    },5000)
            });
      });
        }
      });
  }
  /*logo title*/
  function bindTipsEvent(resid) {
      $(".jp-index").bind("mouseenter",function(){
        $(".tips").addClass("active");
      });
      $(".jp-index").bind("mouseleave",function(){
        $(".tips").removeClass("active");
      });
      if(resid){
        $(".jp-index").attr("href","http://shenqu.yy.com/play/id_"+resid+".html");
      }else{
        $(".jp-index").attr("href","javascript:void(0)");
        $(".jp-index").removeAttr('href');
      }
  }
  /*ie6-9mouse enter*/
  function bindMouseOn(){
       $('.songlist').delegate('li', 'mouseenter', function(e){
            $('img',e.currentTarget).stop(true,false).animate({
                width:anWidth,
                height:anHeight},150,'linear');
      $('a',e.currentTarget).stop(true,false).animate({
                top:anTop,
        left:anLeft},150,'linear');
                
        });
        $('.songlist').delegate('li', 'mouseleave', function(e){
            $('img',e.currentTarget).animate({
                width:anoWidth,
                height:anoHeight},150,'linear');
      $('a',e.currentTarget).stop(true,false).animate({
               top:0,
               left:0},150,'linear');
         
        });
  }
  function bindUploadEvent(){
     $(".upLoad").bind("click.shenqu",function(){
         if(aid && aid!= 0){
             window.external.sendCommand('musicOpenUrl_nologin', "http://m.yy.com/ents/u/"+aid+"#gm");
         }
     });
  }
  /*bind Event*/
  function bindEvent(){
      bindClickEvent();
      bindCloseBtnEvent();
      bindfocusEvent();
      if(!!window.ActiveXObject || "ActiveXObject" in window){
          bindMouseOn();
      }
      bindChangePageEvent();
      bindUploadEvent();
  }
  /*closebtnEvent*/
  function bindCloseBtnEvent(){
    $(".closebtn").bind("click.zbj",function(e){
        $("#jquery_jplayer_1").jPlayer("pause");
        $(".playcontent").hide("5000");
    });
  }
  /*播放凡人歌*/
  function playFan(){
    var obj = $(".songlist").find(".fanrenge:first");
    if(obj.length !=0){
        newInstance($("#jquery_jplayer_1"),obj.attr("data-short"),obj.attr("data-shorico"));
        $("#jp_container_1").delegate('#jquery_jplayer_1',"dblclick",function(){return false;});
        $(".playcontent").show("5000");
          bindTipsEvent(obj.attr("vid"))
          hiidoStat(feventid,STAT_PLAY,obj.attr("vid"),uid);
    }
  }
  
  function init(){
      loadData(aidurl+cid,function(data){
          if(data.code)return;
          aid = data.data.aid;

          if(typeof(aid)=="undefined"){
			      $('#errorTip p').html('加载失败，请稍后再试！');
			      return flase;
		      }else{
            loadData(listurl+aid+"&sortRule=2",function(data){
              if(data.code)return;
              var songdata = data.data;
              if(songdata.fanrenge && songdata.fanrenge.length != 0){
                  songdata.fanrenge[0].songtype = "fanrenge";
                  songdata.shenqu.splice(0,0,songdata.fanrenge[0]);
              }
              _data = data.data.shenqu?data.data.shenqu:[];
              var ssong = buldDom(songdata.shenqu);
              $(".songlist").html(ssong.join(" "));
              $(".songlist").html(ssong.join(" "));//直播间中多一次图片就不会消失
              if(ssong.length == 0){
                if(aid == uid){
                    $(".sid-acthor").show();
                }else{
                    $(".sid-user").show();
                }
              }
              bindEvent();
              $("#errorTip").hide();
              playFan();
          },function(message){
            $('#errorTip p').html('服务器掉地上了，请稍后再试！');
            $("#errorTip").hide();
          });
			   }
		  
          
      });
      $(".body-content").addClass("active");
  }
  init();
});
  
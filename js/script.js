$(function(){
	$("#local-search-result").hide();
	$("#local-search-result").slideToggle();
});
var baiduShare = {
        ele: {
            weixinEle: $(".article-content .bds_weixin")
        },
        init: function () {
            baiduShare.ele.weixinEle.bind("click", baiduShare.clickFun);
        },
        clickFun: function () {
            $(".bd_weixin_popup").css({"opacity": "0"});
            var _this = $(this);
            var left = Math.ceil(_this.offset().left - 60);
            var top = Math.ceil(_this.offset().top + 40);
            setTimeout(function () {
                $("#bdshare_weixin_qrcode_dialog_bg").remove();
                $(".bd_weixin_popup").after($(".bd_weixin_popup").prop("outerHTML")).remove();
                $(".bd_weixin_popup").css({"left": left, "top": top, "opacity": "1"});
                if ($(window).width() > 992) {
                    $(window).scroll(function () {
                        if ($(window).scrollTop() >= 1) {
                            $(".bd_weixin_popup").css({"top": top - 60});
                        } else {
                            $(".bd_weixin_popup").css({"top": top});
                        }
                    });
                } else if ($(window).width() < 380) {
                    var small_left = ($(window).width() - 255) / 2;
                    $(".bd_weixin_popup").css({"left": small_left});
                }
                $(".bd_weixin_popup .bd_weixin_popup_close").click(function () {
                    $(".bd_weixin_popup").hide()
                });
            }, 1000);
            $(window).resize(function () {
                var left = Math.ceil(_this.offset().left - 60);
                var top = Math.ceil(_this.offset().top + 40);
                $(".bd_weixin_popup").css({"left": left, "top": top, "opacity": "1"});
            })
        }
    };
    baiduShare.init();

(function($){
  // Search
var searchFunc = function(path, search_id, content_id) {
    'use strict'; //使用严格模式
    $.ajax({
        url: path,
        dataType: "xml",
        success: function( xmlResponse ) {
            // 从xml中获取相应的标题等数据
            var datas = $( "entry", xmlResponse ).map(function() {
                return {
                    title: $( "title", this ).text(),
                    content: $("content",this).text(),
                    url: $( "url" , this).text()
                };
            }).get();
            //ID选择器
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
            $input.addEventListener('input', function(){
                var str='<ul class=\"search-result-list\">';                
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // 本地搜索主要部分
                datas.forEach(function(data) {
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // 只匹配非空文章
                    if(data_title != '' && data_content != '') {
                        keywords.forEach(function(keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if( index_title < 0 && index_content < 0 ){
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }
                    // 返回搜索结果
                    if (isMatch) {
                    //结果标签
                        str += "<li><a href='"+ data_url +"' class='search-result-title' target='_blank'>"+ "> " + data_title +"</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g,"");
                        if (first_occur >= 0) {
                            // 拿出含有搜索字的部分
                            var start = first_occur-2;
                            var end = first_occur+2;
                            if(start < 0){
                                start = 0;
                            }
                            if(start == 0){
                                end = 4;
                            }
                            if(end > content.length){
                                end = content.length;
                            }
                            var match_content = content.substr(start, 24); 
                            // 列出搜索关键字，定义class加高亮
                            keywords.forEach(function(keyword){
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
                            })
                            str += "<p class=\"search-result\">" + match_content +"...</p>"
                        }
                    }
                })
                $resultContent.innerHTML = str;
            })
        }
    })
};
var path = "../search.xml";
searchFunc(path, 'local-search-input', 'local-search-result');

   //Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
			'<a href="http://tieba.baidu.com/f/commit/share/openShareApi?url=' + encodedUrl + '" class="article-share-tieba" target="_blank" title="百度贴吧"></a>',
			'<a href="http://service.weibo.com/share/share.php?url=' + encodedUrl + '" class="article-share-weibo" target="_blank" title="新浪微博"></a>',
			'<a href="http://share.v.t.qq.com/index.php?c=share&a=index&url=' + encodedUrl + '" class="article-share-tqq" target="_blank" title="腾讯微博"></a>',
			'<a href="http://widget.renren.com/dialog/share?resourceUrl=' + encodedUrl + '" class="article-share-renren" target="_blank" title="人人"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').show();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });
  
    // link
    var $linkUl = $('#link-list');
    var $list = $('#link-list li');
    $linkUl.empty();
    var count = $list.length;
    for(var i = 0; i < count; i++)
    {
        var ran = Math.floor(Math.random() * $list.length);
        $linkUl.append($list.eq(ran));
        $list.splice(ran, 1);
    }
})(jQuery);
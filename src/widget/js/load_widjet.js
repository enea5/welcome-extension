
window['SERVER_API'] = 'https://theconversation.social/social_curation/'
const MAX_COLLECTION_URL_WAIT_BEFORE_BACKUP_USE = 3000;
const SHOW_TUTORIAL = false
var SHOW_RELATED_CONVERSATION_MAIN_TWEET = true;
var MAIN_TWEET_ID = null;
var animation_lock = false;
let INSTALLED = 'installed-sidebar'
var TW_BACKGROUND = "rgb(255, 255, 255)"
var TW_FONT_COLOR = "#000000"
var TW_THEME = "light"

  chrome.storage.local.get('tw_backgroundColor', async function (result) {
   //console.log(result.tw_backgroundColor)
   TW_BACKGROUND = result.tw_backgroundColor
   jQuery(".right-sidebar").css({backgroundColor: TW_BACKGROUND})
   if (TW_BACKGROUND != "rgb(255, 255, 255)"){
      TW_FONT_COLOR = "#FFFFFF"
      TW_THEME = "dark"
      if (TW_BACKGROUND == "rgb(0, 0, 0)"){
          TW_FONT_COLOR = "#D9D9D9"
      }
    }
  })

chrome.tabs.getCurrent(tabInfo => {
    const location = new URL(tabInfo.url)
    if (location.hostname != 'twitter.com'){
		SHOW_RELATED_CONVERSATION_MAIN_TWEET = false; // override flag
    }
})

// first large tooltip on sidebar asking if user wants demo of sidebar buttons
const horizontal = {
    popup: 'z-index: 2147483647 !important;position: fixed;background-color: #fff;bottom: calc(50% + 20px);left: 145px;font-family: sans-serif !important;font-weight: 500;width: 460px;padding: 35px;border: 2px solid rgba(0, 0, 0, 0.1);box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);border-radius: 3px;',
    container: 'width: 24px;text-align: center;font-size: 80px;z-index: 21474836470;height: 100px;display: inline;cursor: pointer;position: fixed;bottom: calc(50% - 80px);left: 130px;',
}
// second, small tooltip, by the side of the buttons
const vertical = {
    popup: 'z-index: 2147483647 !important;position: fixed;background-color: #fff;bottom: calc(46% + 0px);left: 95px;font-family: sans-serif !important;font-weight: 500;width: 200px;padding: 35px;border: 2px solid rgba(0, 0, 0, 0.1);box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);border-radius: 3px;',
    container: 'width: 24px;text-align: center;font-size: 80px;z-index: 21474836470;height: 100px;display: inline;cursor: pointer;position: fixed;bottom: calc(50% - 80px);left: 130px;',
}

const options = {
  display_mode: 'full',
  speaker_types: {
    public_figures: true,
    other_public_figures: true,
    media: true,
    the_public: true,
    news_comments: true
  },
  required_speaker_types: {
    public_figures: false,
    other_public_figures: false,
    media: false,
    the_public: false,
    news_comments: false
  },
  news_comments_from_domains: [],
  news_comments_types: {
    disqus_comments: true,
    fb_comments: true,
    fb_plugin_comments: true,
    fyre_comments: true,
    g_comments: true,
    nytimes_comments: true,
    viafoura_comments: true
  },
  max_results_per_section: {
    public_figures: 0,
    other_public_figures: 0,
    media: 0,
    the_public: 0,
    news_comments: 0
  },
  max_results: 10,
  min_popularity: 0,
  category_tags_whitelist: '',
  id: 'ROOT_ELEMENT',
  allow_low_confidence: true,
  allow_news: 'storydevelopmet,widelyreported',
  bio: 'wikipedia', // 'original', 'wikipedia', 'category', false
  show_community_feedback: true,
  category_section_headers: true,
  header: 'Top Conversation',
  display_top_section_header: true,
  css_file: 'style.css',
  max_queries_before_stop: 75,
  query_frequency_seconds: 1, // how often to query api in seconds
  placeholder_html: '',
  placeholder_frequency: 0,
  storydevlopment_prefer_date: false
}

var Ajax = {
  request: function (ops, callback) {
    chrome.runtime.sendMessage({message: 'API', data: ops}, (response) => {
      //console.log('API', response)
      callback && callback(response)
    })
  }
}

function loadingInfo (tabInfo, linkId) {
  const apiurl = 'https://theconversation.social/social_curation/'
  let url
  if (linkId) {
    url = `${apiurl}?createcollection=true&link_id=${linkId}`
  } else {
    url = tabInfo.url
  }
  return new Promise((resolve) => {
    Ajax.request({url, method: 'get'}, (data) => {
      resolve(data);
    })
  })
}

function sleep (time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

function loadJs (tabInfo,linkId,total_tweets_on_sidebar_open ) {
  const originalAppend = HTMLElement.prototype.appendChild;

  if(!originalAppend.updated){
    // Handle overriding twitter 30 second polling from their server's https://platform.twitter.com/widgets.js', 
    // with it changed to 4 seconds, then adding a timestamp so that we solve 
    // the caching that prevented the frontend from updating with the polled data.
    HTMLElement.prototype.appendChild = function(){
      const args = [...arguments];
      try{
        if(this === document.body){
          const n = args[0]
          if (n && n.tagName && n.tagName.toLowerCase() === 'script' && n.src) {
            const parts = n.src.split('?');
            if (parts.length > 1) {
              parts[1].split('&').map((p) => {
                if (p.split('=')[0] === 'callback') {
                  const cb = decodeURIComponent(p.split('=')[1]);
                  if (!cb.includes('__twttr.callbacks.')) return;
                  n.src = n.src + '&_=' + (new Date().getTime());
                  const name = cb.replace('__twttr.callbacks.','');
                  const oldFunc = __twttr.callbacks[name];
                  if(oldFunc.inBox) return;
                  __twttr.callbacks[name] = function(){
                    const args = [...arguments];
                    if(args.length>0 && args[0].headers ){
                      args[0].headers.xPolling = 4;
                    }
                    //console.log('Calling old callback', new Date().toUTCString());
                    oldFunc(...args);
                  }
                  __twttr.callbacks[name].inBox = true;
                }
              });
              args[0]=n;
            }
          }
        }
      }catch (e){}
      originalAppend.call(this,...args);
    }
    HTMLElement.prototype.appendChild.updated = true;
  }
  var TOTAL_TWEETS = 0;
  if (total_tweets_on_sidebar_open){
    TOTAL_TWEETS = total_tweets_on_sidebar_open
  }
  var head = document.getElementsByTagName('head')[0]
  var script = document.createElement('script')
  script.src = 'https://platform.twitter.com/widgets.js'
  head.appendChild(script)
  script.addEventListener('load', () => {
      var fullPageTweets = document.getElementById('fullPageTweets');
      var fullPageTweetsCounter = document.getElementById('fullPageTweets-count');
      fullPageTweetsCounter.innerText = TOTAL_TWEETS;
      var button_shown_count = 0;
      var timeoutWillBeHidden;
      var startTime;
      var startTimeTimer;
      fullPageTweets.onmouseenter = function () {
        if (timeoutWillBeHidden) clearTimeout(timeoutWillBeHidden);
        fullPageTweets.classList.remove('fullPageTweets_hidden');
      }
      fullPageTweets.onmouseleave = function () {
        timeoutWillBeHidden = setTimeout(() => {
          fullPageTweets.classList.add('fullPageTweets_hidden');
        }, 3000)
      }

      // Listener that set TOTAL_TWEETS value to the new one from message. This needs for 'onScroll' event below.
      // Also it sets the value of 'fullPageTweetsCounter.innerText' to the new one. This is required to display the correct number of tweets on the button.
      chrome.runtime.onMessage.addListener(onMessageListener);
      function onMessageListener(request, sender, sendResponse){
        if(request.message === 'NEW_TOTAL_TWEETS')
        {
          if(request.linkid == linkId)
          {
            TOTAL_TWEETS = request.total_tweets;
            fullPageTweetsCounter.innerText = request.total_tweets;
          }
        }
      }

      document.body.onscroll = function () {
        if (TOTAL_TWEETS < 30 || button_shown_count > 2) return;
        if (!startTime) startTime = new Date();
        // 2250 -- amount of consecutive scroll time to pull up message
        if ((startTime.getTime() + 2250 < new Date().getTime()) && fullPageTweets.classList.contains('fullPageTweets_hidden')) {
            if (button_shown_count < 2){
              fullPageTweets.classList.remove('fullPageTweets_hidden');
              button_shown_count ++;
            }
        }
        if (timeoutWillBeHidden) clearTimeout(timeoutWillBeHidden);
        timeoutWillBeHidden = setTimeout(() => {
          if (!fullPageTweets.classList.contains('fullPageTweets_hidden')) {
            // button_shown_count++ originally was here but it was redone and removed as it was not counting properly. 
          }
          fullPageTweets.classList.add('fullPageTweets_hidden');
        }, 2650) // amount of time the button stays up before disappearing if no interaction with it and no continued scroll
        if(startTimeTimer)clearTimeout(startTimeTimer);
        startTimeTimer = setTimeout(() => {
          startTime = null;
        },575)
      }
  });
}

// Illia start
const is_left_bar = false; //Choose if you need lefside bar or bottom bar for twitter widget

function media_events(data){
  if (data.collection_url) {
    var redirect_link = data.collection_url
  }
  else {
	  var redirect_link = `https://theconversation.social/c/${data.link_id}`
  }

  if(is_left_bar) {
    $('.leftside_bar_js').css({'display': 'flex'})
  }

  $('.spinner').hide() // ONLY FOR DEMO
  $('.no_result').show()
  $('.link_text').text(redirect_link);
  $('.bottom_link_redirect').attr('href', redirect_link);
  // Click on side full page button (full page view)
  $('.bottom_link_redirect').on("click", function(){
    collectionPageAccessed(data.link_id);
  });

  $('#fullPageTweets-view').attr('href', redirect_link);
  $('#fullPageTweets-view').data('openinparent',true);
  $('#fullPageTweets-view').show();
  $('#fullPageTweets').one("click", function(){
    // Click on bottom full page button (full page view)
    collectionPageAccessed(data.link_id);
  });
  document.getElementById('fullPageTweets').onclick = () =>{
    document.getElementById('fullPageTweets-view').click();
  }

  document.getElementById('fullPageTweets').style.cursor = 'pointer';
  document.getElementById('fullPageTweets').style.color = '#337ab7'
  window.initVideoClickHadler && window.initVideoClickHadler(data)
  var collection_info = {"Public Figures Involved": null, "Notable People & Influencers": null, "Commentators & Journalists": null, "General Public": null}
  // insert collection headers
  if (data.collection_headers){
    collection_info = data.collection_headers
  }

  if(data.article_summary && data.collection_url){
   let topic_title = data.article_summary.title
   // take first 105 characters
   topic_title = topic_title.slice(0, 105)
   // get all text before the final space character, then add elipse ... to the end
   topic_title = topic_title.slice(0, topic_title.lastIndexOf(' ')) + "...";
   // now encode it so strings like ampersand and quotes don't mess things up
   topic_title = encodeURIComponent(topic_title)
    var shareURl = `https://twitter.com/compose/tweet?text=I%27m%20reading%20the%20twitter%20conversation%20on%3A%0A%0A%22${topic_title}%22%0A%0A${data.collection_url}%20https://theconversation.social/c/${data.link_id}`
    collection_info["link_text_share_url"] = shareURl
    collection_info["collection_id"] = /[^/]*$/.exec(data.collection_url)[0]
    chrome.storage.local.set({"collection_page_info": collection_info}, function () {
      
    });
   $('.link_text_share').attr('href', `https://twitter.com/compose/tweet?text=I%27m%20reading%20the%20twitter%20conversation%20on%3A%0A%0A%22${topic_title}%22%0A%0A${data.collection_url}%20https://theconversation.social/c/${data.link_id}`)
  }
  else if(data.article_summary){
    var shareURl = `https://twitter.com/compose/tweet?text=I%27m%20reading%20the%20twitter%20conversation%20on%3A%0A%0A%22${topic_title}%22%0A%0Ahttps://theconversation.social/c/${data.link_id}`
    collection_info["link_text_share_url"] = shareURl
    collection_info["collection_id"] = "no collection url yet"
    chrome.storage.local.set({"collection_page_info": collection_info}, function () {      
    });
   $('.link_text_share').attr('href', `https://twitter.com/compose/tweet?text=I%27m%20reading%20the%20twitter%20conversation%20on%3A%0A%0A%22${topic_title}%22%0A%0Ahttps://theconversation.social/c/${data.link_id}`)
  }
}
// Illia end

function collectionPageAccessed(linkId){
    chrome.runtime.sendMessage({message: 'COLLECTION_PAGE_ACCESSED', linkId: linkId}, function(response){});
}

async function enableOfficialTwitterWidget (tabInfo, lastLinkId=null, collectionURL = null) {
  let count = 0
  let linkId = lastLinkId

  let response = await  Promise.race([loadingInfo(tabInfo, linkId), new Promise((resolve) => {
    setTimeout(resolve, MAX_COLLECTION_URL_WAIT_BEFORE_BACKUP_USE);
  })]);

  if (!response && !!collectionURL) {
    //console.log('Using existing CollectionURL');
    response = {
      collection_url: collectionURL,
      url: 'https://twitter.com/i/status/' + findGetParameter('status_id'),
      article_summary: {curation_scope : 'single_tweet', title: 'This Topic'}
    }
  }

  while (count < 30) {    
    if (response && response.collection_url) {
      const ROOT_ELEMENT = document.querySelector('#ROOT_ELEMENT')
      if (ROOT_ELEMENT) {
        ROOT_ELEMENT.innerHTML = `
          <a class="twitter-timeline" href=${response.collection_url} data-theme=${TW_THEME}>Loading...</a>
        `
        if (response.stats){
          loadJs(tabInfo, lastLinkId, response.stats.total_tweets)
        } else {
          loadJs(tabInfo, lastLinkId, 0)
        }
        media_events(response)
        if(SHOW_RELATED_CONVERSATION_MAIN_TWEET) {
          let status_id = findGetParameter('status_id')
          if (!response.article_summary){
            response.article_summary = {curation_scope : 'single_tweet', title: 'This Topic'}
          }
          if (!response.url || !(response.url.includes('twitter.com'))){
            response.url = 'https://twitter.com/i/status/' + status_id
            response.article_summary.url = response.url 
          }
          MAIN_TWEET_ID = status_id
          const curation_scope = response.article_summary ? response.article_summary.curation_scope : 'single_tweet'
          showRelatedConversation(response.url, curation_scope)
        }
        break
      }
    }
    await sleep(5000)
    count++
    //console.log(count, 'enableOfficialTwitterWidget COUNT')
    response = await loadingInfo(tabInfo, linkId);
  }
}

async function enableOfficialTwitterWidgetOnNewsArticle (tabInfo, lastLinkId=null) {
  let count = 0
  let linkId = lastLinkId
  while (count < 30) {
    const response = await loadingInfo(tabInfo, linkId)
    linkId = response.link_id
    if (response.collection_url) {
      const ROOT_ELEMENT = document.querySelector('#ROOT_ELEMENT')
      if (ROOT_ELEMENT) {
        ROOT_ELEMENT.innerHTML = `
          <a class="twitter-timeline" href=${response.collection_url}>The Conversation</a>
        `
        if (response.stats){
          loadJs(tabInfo, lastLinkId, response.stats.total_tweets)
        } else {
          loadJs(tabInfo, lastLinkId, 0)
        }

        media_events(response)
        break
      }
    }
    await sleep(5000)
    count++
    //console.log(count, 'enableOfficialTwitterWidget COUNT')
  }
}

function showRelatedConversation(url, title) {
  $('.widget_body').css('overflow', 'hidden')
  let titleType = 'on this Tweet'
  if(title !== 'single_tweet') {
    titleType = 'on this Story';
  }
  $(`#${options.id}`).css({opacity: 0})
  let res = new Promise((resolve) => {
    $.ajax({url: `https://publish.twitter.com/oembed?&url=${url}&hide_media=true&hide_thread=true&theme=${TW_THEME}`}).done((data) => {
      resolve(data);
    })
  })
  res.then(twt => {
    $html = `<div class="related_conversation" style="background-color: ${TW_BACKGROUND}">
    <div class="related_conversation-load">Loading...</div>
    <div class="related_conversation-title" style="color:${TW_FONT_COLOR}">Related Conversation ${titleType}</div>
    <div id="temporary-tweet">${twt.html}</div>
    </div>`

    const RC_TWEET = document.querySelector('#RC_TWEET')
    $(RC_TWEET).append($html)

    $('.related_conversation-title').hide()
    
    setTimeout((function() {
      $('.related_conversation-load').hide()
      $('.related_conversation-title').fadeIn()
      $('#twitter-widget-1').css('max-width', '100%')
      $('#temporary-tweet .twitter-tweet').css({
        margin: '10px 0 30px',
      })
      $('#temporary-tweet').css({
        opacity: 1,
        height: 'auto',
        transition: 'opacity .5s linear'
      })
      setTimeout((function() {
        $('.widget_body').css('overflow', 'auto')
        $(`#${options.id}`).css({
          opacity: 1,
          transition: 'opacity .5s linear'
        })
      }), 100);
    }), 1500);
  }).catch((error) => {
    $('.widget_body').css('overflow', 'auto')
    $(`#${options.id}`).css({
      opacity: 1,
      transition: 'opacity .5s linear'
    })
    console.log('error', error)
  })
}

function closeHandler (tabInfo) {
  window['$']('#close').click(() => {
    // Illia start
    // Don`t show bars arter re-open widget during spinner works
    window['$']('.bottom_bar_js').hide()
    window['$']('.leftside_bar_js').hide()
    window['$']('.left_side_bar_js').hide()
    // Illia end
    chrome.storage.local.set({
      'close': {
        tabId: tabInfo.id,
        rnd: Math.random()
      }
    });
  })
}

function enableOwnWidget (tabInfo) {
  window['Module'] && window['Module'](window)
  window['initWidget'] && window['initWidget'](options, tabInfo.url, Ajax)

  closeHandler(tabInfo)

  window['$']('.widget_body').addClass('widget_body_id') // use this class to insert tooltips
    // if the user has just installed extension, we'll show them a demo tutorial tour, with their permission
    chrome.storage.local.get(INSTALLED, async function (result) {
        if (result['installed-sidebar'] && SHOW_TUTORIAL) {
            await sleep(9500)
            // show first tooltip, confirm if they want the tour
            const tooltipW = document.createElement('div')
            window['$']('#widget_body_id').append(tooltipW)
            tooltipW.outerHTML = createToolTip(horizontal, 'w_popup', 'w_tooltip', 1)
            // on click of simulate button, tour begins
            jQuery("#simulate_button").click(function(){
                simulate();
            });
            jQuery("#no_tour").click(async function(){
                await sleep(1200)
                $('.non_twitter_left_side_bar').addClass("simulate");
                await sleep(600)
                const tooltipT = document.createElement('div')
                window['$']('#widget_body_id').append(tooltipT)
                tooltipT.outerHTML = createToolTip(vertical, 't_popup', 't_tooltip', 4)
                await sleep(5300)
                $(`#t_tooltip`).remove();
                $(`#t_popup`).remove();
                await sleep(2400)
                $('.non_twitter_left_side_bar').removeClass("simulate");
            });			
            // on click of the tooltips, the tooltip goes away			
            $( "#t_popup" )
                .hide()
                .on("click",function (){removeTooltip("t")});
            $( "#t_tooltip" )
                .hide()
                .on("click",function (){removeTooltip("t")});
            $( "#w_popup" ).on("click", function (){removeTooltip("w")});
            $( "#w_tooltip" ).on("click", function (){removeTooltip("w")});
            // set the installed-sidebar flag back to false.
            chrome.storage.local.set({'installed-sidebar': false});
        }
    })
}

function removeTooltip(id) {
    if ($(`#${id}_tooltip`).length) {
        $(`#${id}_tooltip`).remove();
        $(`#${id}_popup`).remove();

        if (id === 'w') {
            $("#t_popup").show()
            $("#t_tooltip").show()
            $('.bottom_bar').addClass("bottom_bar_animate");
        } else {
            $('.bottom_bar').finish()
        }
    }
}

function createToolTip(styles, popupId, arrowId, tooltip_number) {
    if (tooltip_number === 1){
      return `<div id="${popupId}" style="${styles.popup}">
                      <div>
                        <p style="line-height: 2.4rem;font-size: 15px;font-weight: 600;">Hey there!</p>
                      </div>
                        <div>
                          <p class="desc">Mind if we show you a quick tour of what your powerful <strong>conversation.social extension</strong> can do?<br><br></p>
                          <div>
                          <button id="simulate_button" type="button">Sure, let me see!</button>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="no_tour" type="button">No thanks</button>
                          </div>
                        </div>
                      <div style="${styles.container}" id="${arrowId}">
                        <div style="${styles.arrow}"></div>
                        <div style="${styles.arrowDown}"></div>
                      </div>
            </div>`
    } 
    if (tooltip_number === 2) {
      return `<div id="${popupId}" style="${styles.popup}">
                      <div>
                        <p style="line-height: 2.4rem;font-size: 15px;font-weight: 600;">This is Your Sidebar Menu</p>
                      </div>
                        <div>
                          <p class="desc">It appears on hover.  Watch what each button does...<br></p>
                        </div>
                      <div style="${styles.container}" id="${arrowId}">
                        <div style="${styles.arrow}"></div>
                        <div style="${styles.arrowDown}"></div>
                      </div>
            </div>`		
	}
    if (tooltip_number === 3) {
      return `<div id="${popupId}" style="${styles.popup}">
                      <div>
                        <p style="text-align:center;line-height: 2.4rem;font-size: 15.5px;font-weight: 600;">That's it! Thanks for taking the tour!</p>
                      </div>
                      <div style="${styles.container}" id="${arrowId}">
                        <div style="${styles.arrow}"></div>
                        <div style="${styles.arrowDown}"></div>
                      </div>
            </div>`		
	}
    if (tooltip_number === 4) {
      return `<div id="${popupId}" style="${styles.popup}">
                      <div>
                        <p style="line-height: 2.4rem;font-size: 15px;font-weight: 600;">No Problem. Just Try it Yourself at Any Time!</p>
                      </div>
                        <div>
                          <p class="desc">Extra features are always available here, on this menu.</p>
                        </div>
                      <div style="${styles.container}" id="${arrowId}">
                        <div style="${styles.arrow}"></div>
                      </div>
            </div>`		
	}
}

function doChangeIframeStyle() {
  if ($("#twitter-widget-0").contents().find("head").length == 0) {
    setTimeout(function(){
     doChangeIframeStyle();
    }, 100);
    return false;
  }

  let head = $("#twitter-widget-0").contents().find("head");
  let css = `<style>
      .timeline-Tweet-text {
          margin-left: 50px!important;
          font-size: 16.5px!important;
          font-weight: 400!important;
      }
      ${MAIN_TWEET_ID && `
      .timeline-Tweet-text a[href*="${MAIN_TWEET_ID}"] {
          display: none!important;
        }
      `}
      .TweetAuthor-name  {
		  font-size: 15px!important;
      }
      .TweetAuthor-avatar  {
          width: 40px!important;
          height: 40!important;
      }
      .timeline-Tweet-author  {
          padding-left: 50px!important;
      }
      .timeline-Tweet  {
		  padding-right: 30px!important;
      }
      .timeline-Header-title  {
		  font-size: 16.5px!important;
		  font-weight: 800!important;
		  letter-spacing: 0.5px!important;
		  font-family: system-ui!important;
      }
      .timeline-Tweet-inReplyTo  {
          padding-left: 50px!important;
      }
      ${SHOW_RELATED_CONVERSATION_MAIN_TWEET && `
        .timeline-Header {
          display: none!important;
        }
      `}
  </style>`;

  $(head).append(css);
  return true;
}

chrome.tabs.getCurrent(tabInfo => {
  //  debugger
  chrome.storage.local.get({official: false, lastLinkId: null, collectionURL: null, fullmode: true}, items => {
    const location = new URL(tabInfo.url)
    if (location.hostname === 'twitter.com' && items.lastLinkId) {
      enableOfficialTwitterWidget(tabInfo, items.lastLinkId, items.collectionURL).then(_ => {
        chrome.storage.local.set({'lastLinkId': null, collectionURL: null}, function() {
          //console.log('lastLinkId is set to null');
          doChangeIframeStyle()
        });
        closeHandler(tabInfo)
      })
    } else if (items.official) {
      enableOfficialTwitterWidgetOnNewsArticle(tabInfo).then(_ => {
        closeHandler(tabInfo)
      })
    } else {
      if (items.fullmode) {
        options.fullmode = items.fullmode;
      }
      enableOwnWidget(tabInfo)
    }
  })
})

window['$'](document).on('click', 'a', (evt) => {
  const url = evt.target.href || window['$'](evt.target).closest('a').prop('href')
  if (/https?:\/\//.test(url)) {
    evt.preventDefault()
    if($(evt.target).data('openinparent')) {
      chrome.tabs.update(null, {url})
    } else {
      chrome.tabs.create({url})
    }
    return false
  }
})

// for checking if user is on twitter.com -- whether to show the widget side buttons
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

$( document ).ready(function() {
    if (findGetParameter('parent_host_name') === "twitter.com") {
      $(".widget_inner").addClass("widget_inner_for_twitter");
      jQuery('.non_twitter_left_side_bar').hide();
    }
    $(".widget_body").show();
    
    /**
     * Window event listener for message sent from parent to unit/iframe
     * When message is sent from a parent, function iframeClose is being invoked
     * 
     * @param {string} "message" - a case-sensitive string representing the event type to listen for
     * @param {function} iframeClose - function used invoking iframe closure action
     * 
     */
    window.addEventListener("message", iframeClose, false);

    /**
     * Click event for triggering animation logic
     * 
     * @param {function} - function for triggering animation of the unit/iframe
     * 
     */
    jQuery("#expand-trigger").click(function() {
      if(!animation_lock) {
        expandTrigger();
        animation_lock = true;
      }
    });
    
    if (findGetParameter('parent_host_name') !== "twitter.com") {
      jQuery(".right-sidebar").css({marginLeft: '40px'})
    }

    jQuery("#simulate_button").click(function(){
		simulate();
    });
  
    /**
     * Click event for sending message to parent for reseting background overlay
     */
    jQuery("#close").click(function(){
      parent.postMessage("iframe_closed", "*");
    });
});

/**
 * Function for triggering unit/iframe animation
 */
function expandTrigger() {
  //$('.non_twitter_left_side_bar').addClass("simulate");
  //jQuery(".non_twitter_left_side_bar").addClass("simulate");
  var animate = jQuery("#expand-trigger").hasClass("animate");
  if(animate) {
    jQuery("#expand-trigger").removeClass("animate");
    parent.postMessage("animate", "*");
    resetAnimation();
    setAnimationCSS();    
  } else {
    jQuery("#expand-trigger").css({"transform": "rotate(360deg)"});
    jQuery("#expand-trigger").addClass("animate");
    parent.postMessage("do_not_animate", "*");
    resetAnimation();
    unsetAnimationCSS();
  }

}

/**
 * Function for reseting animation lock. 
 * Lock is being used to prevent user for invoking animation until the previous animation is completed.
 */
function resetAnimation() {
  setTimeout(function(){
    animation_lock = false;
   }, 3000);
}

/**
 * Function used for applying override css when the unit/iframe is animated
 */
function setAnimationCSS() {
  setTimeout(function(){
    var animateCss = `
      <style id="animate_css">
        #ROOT_ELEMENT.social-curation {
          padding: 10px 50px !important;
          transition: padding 1s;
        }
        
        #ROOT_ELEMENT.social-curation li {
            padding-top: 23px !important;
            padding-bottom: 18px !important;
            transition: padding 1s;
        }
        
        #ROOT_ELEMENT.social-curation .social-curation__right {
            padding: 0 0 0 24px !important;
            transition: padding 1s;
        }
        
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__picture {
            height: 65px !important;
            width: 65px !important;
        }
        
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__header {
            font-size: 25px !important;
            transition: font-size 1s;
        }
        
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__section {
            font-size: 20px !important;
            transition: font-size 1s;
        }
        
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__person {
            font-size: 17px !important;
            transition: font-size 1s;
        }
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__person-link {
            font-size: 16px !important;
            transition: font-size 1s;
        }
        
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__bio {
            font-size: 13.5px !important;
            margin: 2px 0 19px 0 !important;
            transition: font-size 1s;
        }
        
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__retweets {
            font-size: 13px !important;
            transition: font-size 1s;
        }
        
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__likes {
            font-size: 13px !important;
            transition: font-size 1s;
        }
        
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__date {
            font-size: 13px !important;
            transition: font-size 1s;
        }
        #ROOT_ELEMENT.social-curation.social-curation__full .social-curation__message {
          font-size: 16.5px !important;
          color: #313131 !important;
          transition: font-size 1s;
          line-height: 1.5em !important;
          padding-right: 40px !important;
        }
      </style>`;
      jQuery("head").append(animateCss);
   }, 200);
}

/**
 * Function for resetting css when unit/iframe animation is reverted
 */
function unsetAnimationCSS() {
  jQuery("style#animate_css").remove();
}

/**
 * The event listener callback function for closing unit/iframe when user clicks outside of the unit/iframe.
 * Function is invoked only when unit/iframe is animated.
 * 
 * @param {event} event - an event object sent from window event lisiner
 * 
 */
function iframeClose(event) {
  var animate = jQuery("#expand-trigger").hasClass("animate");

  if(event.origin == window.document.location.ancestorOrigins[0] && 
    event.data === "trigger_close_click") {
    if(!animate) {
      jQuery("#close").trigger("click");
    }
  }  
}
// end for checking if user is on twitter.com -- whether to show the widget side buttons

function getTabID() {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                resolve(tabs[0].id);
            })
        } catch (e) {
            reject(e);
        }
    })
}

async function simulateResizeButton()
{
    let expander = $("#expand-trigger");
    // create some on/off hover activity on the button to show the user the simulation is interacting with the button    
    expander.addClass("simulate-hover");
    await sleep(70);
    expander.removeClass("simulate-hover");
    await sleep(70);
    expander.addClass("simulate-hover");
    await sleep(70);
    expander.removeClass("simulate-hover");
    // go into click
    expander.addClass("simulate-hover");
    await sleep(1000);
    expander.click();
    await sleep(1000);
    
    while (animation_lock)
    {
        await sleep(100);
    }
    // create on/off activity on the button as we prepare to click it again to resize down
    await sleep(1000);
    expander.addClass("simulate-hover");
    await sleep(70);
    expander.removeClass("simulate-hover");
    await sleep(70);
    expander.addClass("simulate-hover");
    await sleep(70);
    expander.removeClass("simulate-hover");
    // go into click
    expander.click();
    
    while (animation_lock)
    {
        await sleep(100);
    }
    
    await sleep(1000);
    expander.removeClass("simulate-hover");
}

async function simulateVideoLink()
{
    let videoLinkDiv = $('.video_link');
    // create some on/off hover activity on the button to show the user the simulation is interacting with the button
    videoLinkDiv.addClass("simulate-hover");
    await sleep(350);
    videoLinkDiv.removeClass("simulate-hover");
    await sleep(130);
    videoLinkDiv.addClass("simulate-hover");
    await sleep(70);
    videoLinkDiv.removeClass("simulate-hover");
    await sleep(70);
    videoLinkDiv.addClass("simulate-hover");
    await sleep(70);
    videoLinkDiv.removeClass("simulate-hover");
    // go into click
    videoLinkDiv.addClass("simulate-hover");
    await sleep(1300);
    videoLinkDiv.click();
    await sleep(11000);
    // close video iframe now
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let currTab = tabs[0];
        
        if (currTab) { // Sanity check
            chrome.tabs.sendMessage(currTab.id, {message: 'CLICK_CLOSE_VIDEO_LINK', data: ''});
        }
    });
    
    await sleep(1000);
    videoLinkDiv.removeClass("simulate-hover");
}

async function simulateTwitterButton(el, seconds)
{
    let currentTabId = await getTabID();

    // create some on/off hover activity on the button to show the user the simulation is interacting with the button
    el.addClass("simulate-hover");
    await sleep(70);
    el.removeClass("simulate-hover");
    await sleep(70);
    el.addClass("simulate-hover");
    await sleep(70);
    el.removeClass("simulate-hover");
    // go into click
    el.addClass("simulate-hover");
    await sleep(1000);
    el.click();
    await sleep(1000);
    let newTabId = await getTabID();
    await sleep(1000);
    chrome.tabs.sendMessage(newTabId, {message: 'SHOW_TWITTER_TIMER', data: seconds});
    await sleep(seconds * 1000);
    chrome.tabs.remove(newTabId);
    chrome.tabs.update(currentTabId, {selected: true});	
    await sleep(1000);	
    el.removeClass("simulate-hover");
}


async function simulate()
{
    let twitterView = $(".twitter-view");
    let twitterShare = $(".twitter-share");

    await sleep(1900)
    // show second tooltip, by the sidebars if they take the tour
    const tooltipT = document.createElement('div')
    window['$']('#widget_body_id').append(tooltipT)
    tooltipT.outerHTML = createToolTip(vertical, 't_popup', 't_tooltip', 2)			
    await sleep(1200);
    // slide out the buttons on the sidebar
    $('.non_twitter_left_side_bar').addClass("simulate");
    await sleep(3600);
    // remove the second tooltip, by the buttons side
    $(`#t_tooltip`).remove();
    $(`#t_popup`).remove();
    await sleep(2200);
    // now run the video button demo
    await simulateVideoLink();
    await sleep(1000);
    // now run the expand button demo
    await simulateResizeButton();
    await sleep(1050);
    // now run the twitter view button demo
    await simulateTwitterButton(twitterView, 7);
    await sleep(1600);
    // now run the twitter share button demo
    await simulateTwitterButton(twitterShare, 5);
    await sleep(1000);
    // now hide the sidebar buttons since demo is over
    $('.non_twitter_left_side_bar').removeClass("simulate");
    // show a closing tooltip
    const tooltipW = document.createElement('div')
    window['$']('#widget_body_id').append(tooltipW)
    tooltipW.outerHTML = createToolTip(horizontal, 'w_popup', 'w_tooltip', 3)
    await sleep(2500);
    $(`#w_tooltip`).remove();
    $(`#w_popup`).remove();	
}

var EXT_URL = `chrome-extension://${chrome.runtime.id}`
var domainlist = []
var loadTimer = null
var dontdisplay = false
var shouldBeOpen = false
var reading_list = [];
var NOTIFICATION_BEING_SHOWN = false
var GOOEY_CAN_BE_SHOWN = true
var user_subscribed = false
    let INSTALLED = 'installed-c'
    const vertical = {
        popup: 'z-index: 2147483647 !important;position: fixed;background-color: #fff;bottom: 160px;right: 20px;font-family: sans-serif !important;font-weight: 500;width: 200px;padding: 15px;border: 2px solid rgba(0, 0, 0, 0.1);box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);border-radius: 3px;',
        container: 'width: 24px;text-align: center;font-size: 80px;z-index: 21474836470;height: 140px;display: inline;cursor: pointer;position: fixed;bottom: 4px;right: 130px;',
        arrow: 'width: 12px;height: 0px;text-align: center;justify-content: center;margin: auto;background: rgba(49, 33, 119, 1);border-radius: 3px 3px 0px 0;',
        arrowDown: 'width: 0;height: 0;border-left: 12px solid transparent;border-right: 12px solid transparent;border-top: 20px solid rgba(49, 33, 119, 1);border-radius: 4px;'
    }
var installed = true
var isCurationClickedFromPopUp = false;
var TimeLoading = {
  SCRIPT: Date.now(),
  DOM: 0,
  STYLE: 0,
  LOAD: 0
}

var popupMailHtml = `<style>
                        .mail-extension {
                          padding: 10px;
                          background-color: #deddff;
                          border-color: #deddff;
                          color: #721c24;
                          border-radius: 5px;
                          font-size: 12px;
                          line-height: 14px;
                          bottom: 10px;
                        }

						.tweetrecommendationfromfriend {
                          padding: 10px;
                        }						
                      </style>  
                      <div id="mailAlert-extension" class="mail-extension">
                      </div>`

var popupReadingListHtml = `<style>
                        .mail-extension {
                          padding: 10px;
                          background-color: #fff;
                          /* background-color: #d5e2ff; */
                          border: 1px solid grey;
                          border-color: gray;
                          color: black;
                          border-radius: 5px;
                          font-size: 14px;
                          font-weight: 700;
                          line-height: 18px;
                          bottom: 10px;
                          margin-right: 600px;
                        }

                        .tweetrecommendationfromfriend {
                          padding: 10px;
                        }	
                      </style>  
                      <div id="mailAlert-extension" class="mail-extension">
                      </div>`

var hiddenNotificationTabDistanceFromRight;
	
function createHiddenNotificationTab(avatarSrcUrl, numberToShow, tabType) {
	if (document.querySelector('#hiddenNotificationTab'))
		document.querySelector('#hiddenNotificationTab').remove();
	
	var distanceFromTop = '27px';
	hiddenNotificationTabDistanceFromRight = '16px'
	if (tabType == 'FriendReaction') {
		distanceFromTop = '12%';
		hiddenNotificationTabDistanceFromRight = '0px'
	}
	var tab = document.createElement('div');
    tab.setAttribute('id', 'hiddenNotificationTab');
    tab.setAttribute('style', `
    		position: fixed;
			width: 32px; 
			height: 32px;
			//right: 0px;
			right: -100px;
			transition: right 2s;
			top: ${distanceFromTop};
			
			background: #FFFFFF;
			border: 1px solid #000000;
			box-sizing: border-box;
			box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
			border-radius: 5px 0px 0px 5px;
    `);
    tab.style.setProperty("z-index", "2147483647", "important");
    document.body.appendChild(tab);
    
    var avatar = document.createElement('div');
    avatar.setAttribute('style', `
    		position: absolute;
			width: 24px;
			height: 24px;
			right: 5px;
			top: 4px;
			
			border-radius: 90px;
			background-image: url("${avatarSrcUrl}");
			background-size: contain;
    `);
    
    tab.appendChild(avatar);
    
    var par = document.createElement('p');
    par.setAttribute('style', `
    		position: absolute;
			width: 15px;
			height: 15px;
			right: 1px;
			top: 14px;
			
			background: linear-gradient(180deg, #6065DA 0%, #393EB5 100%);
			border: 1px solid #FFFFFF;
			border-radius: 50%;
    		box-sizing: border-box;
			
			font-family: Roboto;
			font-style: normal;
			font-weight: 900;
			font-size: 10px;
			line-height: 12px;
			text-align:center;
			
			color: #FFFFFF;
    `);
    
    var text = document.createTextNode(numberToShow);
    par.appendChild(text);
    tab.appendChild(par);

    $('#hiddenNotificationTab').hover(function(){
        window.hntTimeout = setTimeout(function(){
        	document.querySelector('#extensionNotifications').style.setProperty("left", "66%");
        	hideHiddenNotificationTab();
        	window.enTimeout = setTimeout(() => {
        	      document.querySelector('#extensionNotifications').style.left="+100%";
        	      showHiddenNotificationTab();
        	    }, 4000);
        	$('#mailAlert-extension').hover(function(){
        		clearTimeout(window.enTimeout);
        	}, function(){
        		window.enTimeout = setTimeout(() => {
          	      document.querySelector('#extensionNotifications').style.left="+100%";
          	      showHiddenNotificationTab();
          	    }, 4000)
        	});
        }, 300);
    }, function(){
        clearTimeout(window.hntTimeout);    
    });
}

function showHiddenNotificationTab() {
	document.querySelector('#hiddenNotificationTab').style.setProperty('right', hiddenNotificationTabDistanceFromRight);
}

function hideHiddenNotificationTab() {
	document.querySelector('#hiddenNotificationTab').style.setProperty('right', '-100px');
}

async function showMail(data) {
  let time_length_to_show_mail = 100E3
  mailAlert = document.getElementById('mailAlert-extension');
  if (!mailAlert) {
	document.querySelector('#extensionNotifications').style.setProperty("bottom", "10px", "important")
    rootEl = document.getElementById('extensionNotifications');
    rootEl.innerHTML = popupMailHtml;
    mailAlert = document.getElementById('mailAlert-extension');
  }
  if (mailAlert && !mailAlert.querySelector("div[id='" + 7000 + "']")) {
    let mailMesage = document.createElement('div');
    mailMesage.className = "error-message";
    mailMesage.id = 7000
    mailMesage.innerHTML = "<a id='mailAlert-extension' style='background-color: #deddff !important; color: navy;' href=#><img  src='data:image/png;base64,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'   height=18 width=22 style='vertical-align:middle;padding-right:4px; width: 22px; height: 18px;'><span style='position: absolute; text-align: center; color: white; font-weight: 700; display: normal; font-family: Poppins; font-weight: 500; sans-serif; box-sizing: content-box; padding: 3px; border-radius: 50%; background: #2a00f5; width: 7px; height: 7px;line-height: 8px; left:22px'>1</span><font style='margin-left:16px'> You have one new message</font> </a>";
    mailAlert.appendChild(mailMesage);
	window['$']('#mailAlert-extension').click({param1: data.mail.promo_url, param2: "123 test"}, openMailIframe);

    setTimeout(() => {
      mailAlert.removeChild(mailMesage);
      if (0 === mailAlert.children.length) {
        mailAlert.remove();
      }
    }, time_length_to_show_mail)
  }

}

async function showFriendReactionAlert(data) {
  createHiddenNotificationTab(data.shared_by.avatar, 1, 'FriendReaction');
	
  let time_length_to_show_mail
  if (data.reaction_text){
    time_length_to_show_mail = 11900
  } else {
    time_length_to_show_mail = 5170  
  }
  mailAlert = document.getElementById('mailAlert-extension');
  if (!mailAlert) {
    document.querySelector('#extensionNotifications').style.setProperty("opacity", "1")
    document.querySelector('#extensionNotifications').style.setProperty("right", "-100%", "important")
    document.querySelector('#extensionNotifications').style.setProperty("width", "1040px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("top", "6%", "important")
    document.querySelector('#extensionNotifications').style.setProperty("transition", "left 1.3s")
    document.querySelector('#extensionNotifications').style.setProperty("padding", "20px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("font-family", "system-ui, arial", "important")
    rootEl = document.getElementById('extensionNotifications');
    rootEl.innerHTML = popupReadingListHtml;
    mailAlert = document.getElementById('mailAlert-extension');
    setTimeout(() => {
      document.querySelector('#extensionNotifications').style.setProperty("opacity", "1")
      document.querySelector('#extensionNotifications').style.setProperty("left", "100%")
      hideHiddenNotificationTab();
      setTimeout(()=>{
        document.querySelector('#extensionNotifications').style.left="66%";
      },1400)
      
    }, 0000);
  }

  if (mailAlert && !mailAlert.querySelector("div[id='" + 7000 + "']")) {
    let mailMesage = document.createElement('div');
    mailMesage.className = "tweetrecommendationfromfriend";
    mailMesage.id = 7000

    mailMesage.innerHTML = `<span style="float: left;"><img style="border-radius: 50%; vertical-align:middle;" src="` + data.shared_by.avatar + `"></span>`;
    mailMesage.innerHTML += `<span style="margin-left: 20px; color: black !important; font-weight: 700; background:white;">` + data.shared_by.full_name + `</span><span><img style="float:right; width: 16px; height: 16px; position: initial; top: 20px; right: 20px; object-fit: cover;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48Zz48cGF0aCBkPSJNMi42LDQ0Ni4zYzU2LjgsNS40LDEwNy4xLTguOCwxNTMtNDMuMmMtMTEuOS0wLjktMjIuMy0yLjUtMzIuMy02LjFjLTI2LjItOS41LTQ1LjgtMjYuNC01OC41LTUxLjIgICBjLTEuOC0zLjUtMy4zLTcuMy01LTEwLjljLTEuOC0zLjgsMC00LjMsMy4zLTMuOGMxMywyLjEsMjUuOSwxLjIsMzguNy0xLjRjMC4zLTAuMSwwLjUtMC40LDAuOC0wLjZjMC4yLTEuNC0wLjktMS42LTEuOC0xLjggICBjLTI5LTcuMi01MC43LTI0LjItNjUuNi00OS44Yy04LjQtMTQuNS0xMi44LTMwLjItMTMuMy00N2MtMC4xLTQuMywxLjEtNC44LDQuNy0zLjFjMTIuOCw2LjIsMjYuMywxMCw0MS43LDEwLjUgICBjLTcuNS01LjktMTQuMi0xMS4zLTE5LjgtMTcuOWMtMjAuNS0yNC4xLTI5LTUxLjgtMjQuOS04My4zYzEuNS0xMS43LDUuMi0yMi42LDEwLjMtMzMuMmMxLjktMy45LDMuMy00LjQsNi4yLTAuOSAgIGMxNi43LDIwLjMsMzYuMiwzNy42LDU3LjcsNTIuNmMxNi4xLDExLjMsMzMuMywyMC43LDUxLjMsMjguNmMyMy4zLDEwLjEsNDcuNiwxNyw3Mi42LDIxYzguNCwxLjMsMTYuOSwxLjYsMjUuMywyLjYgICBjMy45LDAuNCw0LjUtMS4xLDMuOC00LjZjLTQuMi0yMS44LTEuNC00Mi45LDguMS02Mi44YzE0LjktMzEsMzkuMi01MC44LDczLjEtNThjMzMuNS03LjEsNjMuMiwxLjMsODkuNiwyMi42ICAgYzguNSwxMi44LDE5LjIsNS4zLDI4LjksMi42YzE1LjQtNC4zLDI5LjktMTEsNDQuMy0xOC41Yy03LjMsMjMuMy0yMS43LDQxLjItNDEuOCw1NS4xYzE5LjQtMS4zLDM3LjUtNy4zLDU2LjctMTQuOSAgIGMtNS4xLDguMS0xMC40LDE0LjQtMTUuNiwyMC43Yy05LjcsMTEuNi0yMC45LDIxLjQtMzIuOCwzMC41Yy0yLjUsMS45LTMuMiwzLjgtMy4xLDYuN2MwLjYsMjEtMS4xLDQxLjktNC45LDYyLjYgICBjLTQsMjEuNy0xMC40LDQyLjYtMTguOSw2Mi45Yy05LjUsMjIuNi0yMS41LDQ0LTM2LjEsNjMuN2MtMTguMiwyNC42LTM5LjcsNDYuMS02NC43LDYzLjljLTMzLjcsMjQtNzEsMzkuNi0xMTEuNiw0Ny40ICAgYy0yNS40LDQuOS01MS4xLDYuNC03Nyw1LjFjLTIwLjEtMS0zOS43LTQuMS01OS05LjFjLTI0LjItNi4zLTQ3LjQtMTUuNS02OS4xLTI3LjlDMTIuMyw0NTIuNyw3LjIsNDUwLjksMi42LDQ0Ni4zeiIgZmlsbD0iIzU4QUVFNyIvPjwvZz48L3N2Zz4="></span>`;
    mailMesage.innerHTML += "<br>";	
    mailMesage.innerHTML += `<span style="margin-left: 20px; color: black !important; font-weight: 400">@` + data.shared_by.screen_name + `</span>`;
    mailMesage.innerHTML += "<br><br>";	
    if (data.reaction_text){
      mailMesage.innerHTML += `<span style="margin-left: 0px; font-size: 16px; color: black !important; font-weight: 400 !important; line-height: 1.5rem !important;">` + data.reaction_text + `</span>`;
    } else {
      mailMesage.innerHTML += `<span style="margin-left: 0px; font-size: 16px; color: black !important; font-weight: 400 !important; line-height: 1.5rem !important;">` + "Shared this story " + data.shared_by.time_ago + " ago" + `</span>`;
    }
    mailMesage.innerHTML += "<br><br>";
    mailMesage.innerHTML += `<span style="margin-left: 0px; font-size: 13px; color: black !important; font-weight: 600 !important; float: right;"><a href="https://twitter.com/i/status/` + data.id + `" target="_blank">` +  data.shared_by.time_ago +  `</a></span><span class=retweetssharedby style="width: 13px; height: 13px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAABAlBMVEV1hZN9jJl+jZl+jpp/jZt/jpp/jpuAj5uFk5+HlaGHlqGIlaGIlqKKl6OLmKSToKqUoauVoayYo66ZpK6dqLKeqrOjrbakr7iqtb2ttr6ttr+wucGwusGxusGxusKyusKyu8KzvMS6w8m7w8m7w8q8w8rBx87ByM7Cyc/Dys/FzNHGzNLGzdLHzdPHztTIztTJz9TJ0NXK0NXL0dbM0dbM0tfN09fN09jU2d7U2t7X3N/Z3uHa3uLa3+Pb3+Pm6evv8fLv8fPx8vTx8/Ty8/Xy9PXz9PX29/j39/j3+Pj3+Pn4+fn4+fr6+vr6+/v7+/v7/Pz8/Pz8/P3+/v7+/v////+ObWbIAAAAw0lEQVR42l3I6XLBYBiG4RcVSQlV+05LQ9CitcdOVMTuOf9TkeSL0en95565CP8zRIkFogNgEA3ExpZ0vDk5/1ytCRk56+sasuIqU232+eT6mmnTCrcCNYUNAD2V1gFshBaoEIHZfGEtXAC9BfGnlyJIod0DDqSAto72QzqOLQjv/PoOv3wJhqhi/MLgkvCrpmDolJiU3SNYcmxw0hW4fngaJybQ63xyuUzydR1MDOq/imKoZ4ItOE++fyZn2MLaH2B3A0CTSyBJLKRjAAAAAElFTkSuQmCC); display: inline-block; background-size: contain; background-repeat: no-repeat; vertical-align: middle; margin-left: 0px;"></span><span class=likesnumber style="margin-left: 4px; font-size: 13px; color: black !important;font-weight: 600 !important;">` + data.shared_by.likes + `</span><span class=likessharedby style="width: 13px; height: 13px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAMAAAAYGszCAAAAllBMVEVld4ZleYZleYple5lljLllk8Bqd4ZqeYZvgqFvnsV5teB+q8yDe4aDjKmDvOCHteCNxeSSgo6XzeiX1P+bjJm1jIa16P+6k4a+norD7v/Jq5bJ7ODdtZnhtZHhvJnh7Mzm///ry6HrzaXr+//r/f/r///6////1KX/6Ln/6L3/7sj/++j//ez//+j//+z///f///v///98f8gjAAAAZklEQVR42sXLxRaDQBBE0QEGd4IFd2JI///PMaHZwZ63vKeKwEUMP64DMEeExesd4tvgiDXg5BtrO77MNPAS+9CRVnifggfKvbhkekNLP/wj5GqLuhYSJ4Sw4y+RCUvsAWrlifdzG9yQK0hxY6KUAAAAAElFTkSuQmCC); display: inline-block; background-size: contain; background-repeat: no-repeat; vertical-align: middle;margin-left: 18px;"></span><span class=likesnumber style="margin-left: 4px;font-size: 13px; color: black !important;font-weight: 600 !important;">` + data.shared_by.retweets + `</span>`;
    mailMesage.innerHTML += "<center style='padding-bottom: 5px;'>";
    mailAlert.appendChild(mailMesage);
    mailAlert.style.transition="left 1s";
    //window['$']('#readingList-extension').click({reading_list_array: data.personalization.tweets_for_reading_list}, openReadingListPage);    
    setTimeout(() => {
      document.querySelector('#extensionNotifications').style.left="+100%";
      showHiddenNotificationTab();
    }, time_length_to_show_mail)
  }

}

async function showReadingListAlert(data) {
  let time_length_to_show_mail = 1000E3
  mailAlert = document.getElementById('mailAlert-extension');
  if (!mailAlert) {
    document.querySelector('#extensionNotifications').style.setProperty("opacity", "0")
    document.querySelector('#extensionNotifications').style.setProperty("right", "-100%")
    document.querySelector('#extensionNotifications').style.setProperty("width", "1040px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("bottom", "2%", "important")
    document.querySelector('#extensionNotifications').style.setProperty("transition", "right 2s linear")
    rootEl = document.getElementById('extensionNotifications');
    rootEl.innerHTML = popupReadingListHtml;
    mailAlert = document.getElementById('mailAlert-extension');
    setTimeout(() => {
      document.querySelector('#extensionNotifications').style.setProperty("opacity", "1")
      document.querySelector('#extensionNotifications').style.setProperty("right", "2%")
    }, 500);
  }

  if (mailAlert && !mailAlert.querySelector("div[id='" + 7000 + "']")) {
    let mailMesage = document.createElement('div');
    mailMesage.className = "error-message";
    mailMesage.id = 7000
    mailMesage.innerHTML = "<center style='padding-bottom: 5px;'><img src='data:image/png;base64,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' style='display:inline; vertical-align: middle; width: 25px;padding-right: 4px;'><font size=1>THE CONVERSATION - FEED UPDATE</font></center><br><center><img height=25 width=25 src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48Zz48cGF0aCBkPSJNMi42LDQ0Ni4zYzU2LjgsNS40LDEwNy4xLTguOCwxNTMtNDMuMmMtMTEuOS0wLjktMjIuMy0yLjUtMzIuMy02LjFjLTI2LjItOS41LTQ1LjgtMjYuNC01OC41LTUxLjIgICBjLTEuOC0zLjUtMy4zLTcuMy01LTEwLjljLTEuOC0zLjgsMC00LjMsMy4zLTMuOGMxMywyLjEsMjUuOSwxLjIsMzguNy0xLjRjMC4zLTAuMSwwLjUtMC40LDAuOC0wLjZjMC4yLTEuNC0wLjktMS42LTEuOC0xLjggICBjLTI5LTcuMi01MC43LTI0LjItNjUuNi00OS44Yy04LjQtMTQuNS0xMi44LTMwLjItMTMuMy00N2MtMC4xLTQuMywxLjEtNC44LDQuNy0zLjFjMTIuOCw2LjIsMjYuMywxMCw0MS43LDEwLjUgICBjLTcuNS01LjktMTQuMi0xMS4zLTE5LjgtMTcuOWMtMjAuNS0yNC4xLTI5LTUxLjgtMjQuOS04My4zYzEuNS0xMS43LDUuMi0yMi42LDEwLjMtMzMuMmMxLjktMy45LDMuMy00LjQsNi4yLTAuOSAgIGMxNi43LDIwLjMsMzYuMiwzNy42LDU3LjcsNTIuNmMxNi4xLDExLjMsMzMuMywyMC43LDUxLjMsMjguNmMyMy4zLDEwLjEsNDcuNiwxNyw3Mi42LDIxYzguNCwxLjMsMTYuOSwxLjYsMjUuMywyLjYgICBjMy45LDAuNCw0LjUtMS4xLDMuOC00LjZjLTQuMi0yMS44LTEuNC00Mi45LDguMS02Mi44YzE0LjktMzEsMzkuMi01MC44LDczLjEtNThjMzMuNS03LjEsNjMuMiwxLjMsODkuNiwyMi42ICAgYzguNSwxMi44LDE5LjIsNS4zLDI4LjksMi42YzE1LjQtNC4zLDI5LjktMTEsNDQuMy0xOC41Yy03LjMsMjMuMy0yMS43LDQxLjItNDEuOCw1NS4xYzE5LjQtMS4zLDM3LjUtNy4zLDU2LjctMTQuOSAgIGMtNS4xLDguMS0xMC40LDE0LjQtMTUuNiwyMC43Yy05LjcsMTEuNi0yMC45LDIxLjQtMzIuOCwzMC41Yy0yLjUsMS45LTMuMiwzLjgtMy4xLDYuN2MwLjYsMjEtMS4xLDQxLjktNC45LDYyLjYgICBjLTQsMjEuNy0xMC40LDQyLjYtMTguOSw2Mi45Yy05LjUsMjIuNi0yMS41LDQ0LTM2LjEsNjMuN2MtMTguMiwyNC42LTM5LjcsNDYuMS02NC43LDYzLjljLTMzLjcsMjQtNzEsMzkuNi0xMTEuNiw0Ny40ICAgYy0yNS40LDQuOS01MS4xLDYuNC03Nyw1LjFjLTIwLjEtMS0zOS43LTQuMS01OS05LjFjLTI0LjItNi4zLTQ3LjQtMTUuNS02OS4xLTI3LjlDMTIuMyw0NTIuNyw3LjIsNDUwLjksMi42LDQ0Ni4zeiIgZmlsbD0iIzU4QUVFNyIvPjwvZz48L3N2Zz4=' style='vertical-align:middle;padding-right:8px;display:inline;width:25px;'><a id='readingList-extension' style='color:#337ab7; font-weight: 600; font-size:13.5px;' href=#>2 new reading recommendations from Twitter Friends. </a></center><b style='margin-top: 5px;color:blue !important;text-decoration: underline;'>";
    mailAlert.appendChild(mailMesage);
    window['$']('#readingList-extension').click({reading_list_array: data.personalization.tweets_for_reading_list}, openReadingListPage);    
    setTimeout(() => {
      mailAlert.removeChild(mailMesage);
      if (0 === mailAlert.children.length) {
        mailAlert.remove();
      }
    }, time_length_to_show_mail)
  }

}

function sleep (time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
  
async function showFriendRecommendationsAlert(data) {
    if (NOTIFICATION_BEING_SHOWN) {
        return 
    }
    await sleep(16800)
	
    createHiddenNotificationTab(
        data.personalization.same_publisher_tweets_from_people_you_follow[0]['profile_image_url'],
        data.personalization.same_publisher_tweets_from_people_you_follow.length,
        'FriendRecommendations');
	
    document.querySelector('#curate_button_id').style.setProperty("z-index", "2147483644", "important")
    try{
      document.querySelector('#widget_frame_id').style.setProperty("z-index", "2147483645", "important")
    }
    catch (e) {
      try{
        document.querySelector('#main_iframe').style.setProperty("z-index", "2147483645", "important")
      }
      catch (e) {}
	}
  let time_length_to_show_mail
  time_length_to_show_mail = 8190
  document.querySelector('#extensionNotifications').style.setProperty("z-index", "2147483647", "important")
  mailAlert = document.getElementById('mailAlert-extension');
  if (!mailAlert) {
    document.querySelector('#extensionNotifications').style.setProperty("z-index", "2147483647", "important")
    document.querySelector('#extensionNotifications').style.setProperty("opacity", "1")
    document.querySelector('#extensionNotifications').style.setProperty("right", "-100%", "important")
    document.querySelector('#extensionNotifications').style.setProperty("width", "1040px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("top", "27px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("transition", "left 1.2s")
    document.querySelector('#extensionNotifications').style.setProperty("padding", "0px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("font-family", "system-ui, arial", "important")

    rootEl = document.getElementById('extensionNotifications');
    rootEl.innerHTML = popupReadingListHtml;
    mailAlert = document.getElementById('mailAlert-extension');
    setTimeout(() => {
      document.querySelector('#extensionNotifications').style.setProperty("opacity", "1")
      document.querySelector('#extensionNotifications').style.setProperty("left", "100%")
      hideHiddenNotificationTab();
      setTimeout(()=>{
        document.querySelector('#extensionNotifications').style.left="66%";
      },2400)
      
    }, 2000);
  }

  if (mailAlert && !mailAlert.querySelector("div[id='" + 7000 + "']")) {
    let mailMesage = document.createElement('div');
    mailMesage.className = "friends_story_recommends";
    mailMesage.id = 7000

    function buildAvatars(friend, index, array) {
      var avatar_html = `<img width=28 height=28 style="border-radius: 50%; border: 2px solid gray;  height: 28px; width: 28px; margin-left:-10px; display: initial; vertical-align:middle;" src="` + friend['profile_image_url'] + `">`;
      avatars = avatars + avatar_html;
    }
    var avatars = "";
    data.personalization.same_publisher_tweets_from_people_you_follow.slice(0, 3).forEach(buildAvatars);

    mailMesage.innerHTML = `<span style="float: left;"></span>`;
    mailMesage.innerHTML += `<span style="margin-left: 5px;">` + avatars + `</span>`
    if (data.personalization.same_publisher_tweets_from_people_you_follow.length === 1){
      mailMesage.innerHTML += `<a id='readingList-extension' style='cursor: pointer'> <span style="margin-left: 4px; color: black !important; font-weight: 600; font-size: 12px; font-family: mulish, muli, system-ui, arial;">` + data.personalization.same_publisher_tweets_from_people_you_follow[0]['user_name'] + " has a " + window.location.hostname.replace('www.','') + ` reading recommendation</span></a>`;
    } 
    else if (data.personalization.same_publisher_tweets_from_people_you_follow.length === 2){
      mailMesage.innerHTML += `<a id='readingList-extension' style='cursor: pointer'> <span style="margin-left: 4px; color: black !important; font-weight: 600; font-size: 12px; font-family: mulish, muli, system-ui, arial;">` + data.personalization.same_publisher_tweets_from_people_you_follow[0]['user_name'] + " & " + data.personalization.same_publisher_tweets_from_people_you_follow[1]['user_name'] + " have " + window.location.hostname.replace('www.','') + ` reading recommendations</span></a>`;
    } else {
      mailMesage.innerHTML += `<a id='readingList-extension' style='cursor: pointer'> <span style="margin-left: 4px; color: black !important; font-weight: 600; font-size: 12px; font-family: mulish, muli, system-ui, arial;">` + data.personalization.same_publisher_tweets_from_people_you_follow[0]['user_name'] +" &  " + (data.personalization.same_publisher_tweets_from_people_you_follow.length - 1) + " friends have " + window.location.hostname.replace('www.','') + ` recommends</span></a>`;
    }
    //mailMesage.innerHTML += `<br><a id='readingList-extension' style='cursor: pointer'><span style="margin-left: 44px; color: black !important; font-weight: 400; font-size: 12px; font-family: mulish, muli, system-ui, arial;">` + "Click to view " + `</span></a>`;
    mailMesage.innerHTML += `</a><center style='padding-bottom: 10px;'>`;
    mailAlert.appendChild(mailMesage);
    mailAlert.style.transition="left 1s";
    mailAlert.style.background="#fbfdfc";
    window['$']('#mailAlert-extension').click({recommends_list_array: data.personalization.same_publisher_tweets_from_people_you_follow}, openFriendsSameDomainPage);   
    mailAlert.onmouseover = function(){document.querySelector('#mailAlert-extension').style.setProperty("background-color", "#ecf1ef", "important")
                                       document.querySelector('#readingList-extension').style.setProperty("color", "white", "important")
                                       document.querySelector('#mailAlert-extension').style.setProperty("cursor", 'pointer', "important")
                                      };
    mailAlert.onmouseout = function(){document.querySelector('#mailAlert-extension').style.setProperty("background-color", "#fbfdfc", "important")};
    
    setTimeout(() => {
      document.querySelector('#extensionNotifications').style.left="+100%";
      showHiddenNotificationTab();
    }, time_length_to_show_mail)

    try{
      document.querySelector('#widget_frame_id').style.setProperty("z-index", "2147483647", "important")
    }
    catch (e) {
      try{
        document.querySelector('#main_iframe').style.setProperty("z-index", "2147483647", "important")
      }
      catch (e) {}
	}
    document.querySelector('#curate_button_id').style.setProperty("z-index", "2147483646", "important")
  }

}

// end showFriendRecommendationsAlert

async function showBottomSlideOutAlert(data, sleep_time=200) {
  NOTIFICATION_BEING_SHOWN = true
  if ("sleep_time" in data.alert) {
    sleep_time = data.alert.sleep_time
  }
  await sleep(sleep_time)
  let time_length_to_show_mail = 1000E3
  mailAlert = document.getElementById('mailAlert-extension');
  if (!mailAlert) {
    document.querySelector('#extensionNotifications').style.setProperty("opacity", "0")
    document.querySelector('#extensionNotifications').style.setProperty("right", "-100%")
    document.querySelector('#extensionNotifications').style.setProperty("width", "1040px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("bottom", "2%", "important")
    document.querySelector('#extensionNotifications').style.setProperty("transition", "right 2s linear")
    rootEl = document.getElementById('extensionNotifications');
    rootEl.innerHTML = popupReadingListHtml;
    mailAlert = document.getElementById('mailAlert-extension');
    setTimeout(() => {
      document.querySelector('#extensionNotifications').style.setProperty("opacity", "1")
      document.querySelector('#extensionNotifications').style.setProperty("right", "2%")
    }, 500);
  }

  if (mailAlert && !mailAlert.querySelector("div[id='" + 7000 + "']")) {
    let mailMesage = document.createElement('div');
    mailMesage.className = "error-message";
    mailMesage.id = 7000
    mailMesage.innerHTML = `<center style='padding-bottom: 0px;'><img src='data:image/png;base64,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' 
	                       style='display:inline; vertical-align: middle; width: 25px;padding-right: 4px;'>
                           <font size=1>NOTIFICATION</font></center><center>
                           <!--<img height=25 width=25 src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48Zz48cGF0aCBkPSJNMi42LDQ0Ni4zYzU2LjgsNS40LDEwNy4xLTguOCwxNTMtNDMuMmMtMTEuOS0wLjktMjIuMy0yLjUtMzIuMy02LjFjLTI2LjItOS41LTQ1LjgtMjYuNC01OC41LTUxLjIgICBjLTEuOC0zLjUtMy4zLTcuMy01LTEwLjljLTEuOC0zLjgsMC00LjMsMy4zLTMuOGMxMywyLjEsMjUuOSwxLjIsMzguNy0xLjRjMC4zLTAuMSwwLjUtMC40LDAuOC0wLjZjMC4yLTEuNC0wLjktMS42LTEuOC0xLjggICBjLTI5LTcuMi01MC43LTI0LjItNjUuNi00OS44Yy04LjQtMTQuNS0xMi44LTMwLjItMTMuMy00N2MtMC4xLTQuMywxLjEtNC44LDQuNy0zLjFjMTIuOCw2LjIsMjYuMywxMCw0MS43LDEwLjUgICBjLTcuNS01LjktMTQuMi0xMS4zLTE5LjgtMTcuOWMtMjAuNS0yNC4xLTI5LTUxLjgtMjQuOS04My4zYzEuNS0xMS43LDUuMi0yMi42LDEwLjMtMzMuMmMxLjktMy45LDMuMy00LjQsNi4yLTAuOSAgIGMxNi43LDIwLjMsMzYuMiwzNy42LDU3LjcsNTIuNmMxNi4xLDExLjMsMzMuMywyMC43LDUxLjMsMjguNmMyMy4zLDEwLjEsNDcuNiwxNyw3Mi42LDIxYzguNCwxLjMsMTYuOSwxLjYsMjUuMywyLjYgICBjMy45LDAuNCw0LjUtMS4xLDMuOC00LjZjLTQuMi0yMS44LTEuNC00Mi45LDguMS02Mi44YzE0LjktMzEsMzkuMi01MC44LDczLjEtNThjMzMuNS03LjEsNjMuMiwxLjMsODkuNiwyMi42ICAgYzguNSwxMi44LDE5LjIsNS4zLDI4LjksMi42YzE1LjQtNC4zLDI5LjktMTEsNDQuMy0xOC41Yy03LjMsMjMuMy0yMS43LDQxLjItNDEuOCw1NS4xYzE5LjQtMS4zLDM3LjUtNy4zLDU2LjctMTQuOSAgIGMtNS4xLDguMS0xMC40LDE0LjQtMTUuNiwyMC43Yy05LjcsMTEuNi0yMC45LDIxLjQtMzIuOCwzMC41Yy0yLjUsMS45LTMuMiwzLjgtMy4xLDYuN2MwLjYsMjEtMS4xLDQxLjktNC45LDYyLjYgICBjLTQsMjEuNy0xMC40LDQyLjYtMTguOSw2Mi45Yy05LjUsMjIuNi0yMS41LDQ0LTM2LjEsNjMuN2MtMTguMiwyNC42LTM5LjcsNDYuMS02NC43LDYzLjljLTMzLjcsMjQtNzEsMzkuNi0xMTEuNiw0Ny40ICAgYy0yNS40LDQuOS01MS4xLDYuNC03Nyw1LjFjLTIwLjEtMS0zOS43LTQuMS01OS05LjFjLTI0LjItNi4zLTQ3LjQtMTUuNS02OS4xLTI3LjlDMTIuMyw0NTIuNyw3LjIsNDUwLjksMi42LDQ0Ni4zeiIgZmlsbD0iIzU4QUVFNyIvPjwvZz48L3N2Zz4=' style='vertical-align:middle;padding-right:8px;display:inline;width:25px;'>-->
                           <a id='readingList-extension' style='color:#337ab7; font-weight: 600; font-size:13.5px;' href=#>${data.alert.message}</a></center><b style='margin-top: 5px;color:blue !important;text-decoration: underline;'>`;    
    mailAlert.appendChild(mailMesage);
    if ("new_tab" in data.alert && data.alert.new_tab){
      window['$']('#readingList-extension').click({param1: data.alert.alert_url, param2: "needed"}, openMailIframe);
    } else {
      window['$']('#readingList-extension').click({param1: data.alert.alert_url, param2: "123 test"}, openMailIframe);
    }
    setTimeout(() => {
      mailAlert.removeChild(mailMesage);
      if (0 === mailAlert.children.length) {
        mailAlert.remove();
      }
    }, time_length_to_show_mail)
  }

}
// end showBottomSlideOutAlert

  
async function showTopSlideOutAlert(data, sleep_time=1000) {
    NOTIFICATION_BEING_SHOWN = true
    if ("sleep_time" in data.alert) {
      sleep_time = data.alert.sleep_time
    }
    await sleep(sleep_time)
    createHiddenNotificationTab(
        'data:image/png;base64,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',
        1,
        'FriendRecommendations');
	
    document.querySelector('#curate_button_id').style.setProperty("z-index", "2147483644", "important")
    try{
      document.querySelector('#widget_frame_id').style.setProperty("z-index", "2147483645", "important")
    }
    catch (e) {
      try{
        document.querySelector('#main_iframe').style.setProperty("z-index", "2147483645", "important")
      }
      catch (e) {}
	}
  let time_length_to_show_mail
  time_length_to_show_mail = 15490
  document.querySelector('#extensionNotifications').style.setProperty("z-index", "2147483647", "important")
  mailAlert = document.getElementById('mailAlert-extension');
  if (!mailAlert) {
    document.querySelector('#extensionNotifications').style.setProperty("z-index", "2147483647", "important")
    document.querySelector('#extensionNotifications').style.setProperty("opacity", "1")
    document.querySelector('#extensionNotifications').style.setProperty("right", "-100%", "important")
    document.querySelector('#extensionNotifications').style.setProperty("width", "1040px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("top", "27px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("transition", "left 1.2s")
    document.querySelector('#extensionNotifications').style.setProperty("padding", "0px", "important")
    document.querySelector('#extensionNotifications').style.setProperty("font-family", "system-ui, arial", "important")

    rootEl = document.getElementById('extensionNotifications');
    rootEl.innerHTML = popupReadingListHtml;
    mailAlert = document.getElementById('mailAlert-extension');
    setTimeout(() => {
      document.querySelector('#extensionNotifications').style.setProperty("opacity", "1")
      document.querySelector('#extensionNotifications').style.setProperty("left", "100%")
      hideHiddenNotificationTab();
      setTimeout(()=>{
        document.querySelector('#extensionNotifications').style.left="66%";
      },2400)
      
    }, 2000);
  }

  if (mailAlert && !mailAlert.querySelector("div[id='" + 7000 + "']")) {
    let mailMesage = document.createElement('div');
    mailMesage.className = "error-message";
    mailMesage.id = 7000
    mailMesage.innerHTML = `<span style="float: left;"></span><img src='data:image/png;base64,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' width="20px" align="left">`;
    mailMesage.innerHTML += `<a id='readingList-extension' style='cursor: pointer'> <span style="margin-left: 7px; color: black !important; font-weight: 600; font-size: 12px; font-family: mulish, muli, system-ui, arial;">${data.alert.message}</span></a>`;
    //mailMesage.innerHTML += `<br><a id='readingList-extension' style='cursor: pointer'><span style="margin-left: 44px; color: black !important; font-weight: 400; font-size: 12px; font-family: mulish, muli, system-ui, arial;">` + "Click to view " + `</span></a>`;
    mailMesage.innerHTML += `</a><center style='padding-bottom: 10px;'>`;
    mailAlert.appendChild(mailMesage);
    mailAlert.style.transition="left 1s";
    mailAlert.style.background="#fbfdfc";
    if ("new_tab" in data.alert && data.alert.new_tab){
      window['$']('#mailAlert-extension').click({param1: data.alert.alert_url, param2: "needed"}, openMailIframe);
    } else {
      window['$']('#mailAlert-extension').click({param1: data.alert.alert_url, param2: "123 test"}, openMailIframe);
    }
    mailAlert.onmouseover = function(){document.querySelector('#mailAlert-extension').style.setProperty("background-color", "#ecf1ef", "important")
                                       document.querySelector('#readingList-extension').style.setProperty("color", "white", "important")
                                       document.querySelector('#mailAlert-extension').style.setProperty("cursor", 'pointer', "important")
                                      };
    mailAlert.onmouseout = function(){document.querySelector('#mailAlert-extension').style.setProperty("background-color", "#fbfdfc", "important")};
    
    setTimeout(() => {
      document.querySelector('#extensionNotifications').style.left="+100%";
      showHiddenNotificationTab();
    }, time_length_to_show_mail)

    try{
      document.querySelector('#widget_frame_id').style.setProperty("z-index", "2147483647", "important")
    }
    catch (e) {
      try{
        document.querySelector('#main_iframe').style.setProperty("z-index", "2147483647", "important")
      }
      catch (e) {}
	}
    document.querySelector('#curate_button_id').style.setProperty("z-index", "2147483646", "important")
  }

}
// end showTopSlideOutAlert


var popupErrorHtml = `<style>
                        .alert-extension {
                          padding: 10px;
                          background-color: #f8d7da;
                          border-color: #f5c6cb;
                          color: #721c24;
                          border-radius: 5px;
                          font-size: 12px;
                          line-height: 14px;
                        }
                      </style>  
                      <div id="errorsAlert-extension" class="alert-extension">
                      </div>`

function showError(err) {
  let time_length_to_show_error = 10E3
  if (err.code === 4007){
    time_length_to_show_error = 5000E3
  }
  if (err.code === 4003 || err.code === 4004 || err.code === 4005){
    time_length_to_show_error = 5E3
  }
  errorsAlert = document.getElementById('errorsAlert-extension');
  if (!errorsAlert) {
    rootEl = document.getElementById('extensionNotifications');
    rootEl.innerHTML = popupErrorHtml;
    errorsAlert = document.getElementById('errorsAlert-extension');
  }
  if (errorsAlert && !errorsAlert.querySelector("div[id='" + err.code + "']")) {
    let errorMesage = document.createElement('div');
    errorMesage.className = "error-message";
    errorMesage.id = err.code
    errorMesage.innerHTML = err.message;
    errorsAlert.appendChild(errorMesage);
    setTimeout(() => {
      errorsAlert.removeChild(errorMesage);
      if (0 === errorsAlert.children.length) {
        errorsAlert.remove();
      }
    }, time_length_to_show_error)
  }

}


function openReadingListPage(event) {
  let openReadingListTab = null
  let reading_list = event.data.reading_list_array
  chrome.runtime.sendMessage({message: 'READING_LIST', 'reading_list': reading_list})
  openReadingListIframe()
  //chrome.tabs.create({url: EXT_URL + '/widget/reading_list.html'})
  //chrome.tabs.create({url: `chrome-extension://${chrome.runtime.id}/widget/reading_list.html`}, function (tab) {
    //openReadingListTab = tab;
  //});
}

async function openFriendsSameDomainPage(event) {
  let openReadingListTab = null
  let recommends_list = event.data.recommends_list_array
  var recommends_list_ids = []
  var recommends_listLength = recommends_list.length;
  for (var i = 0; i < recommends_listLength; i++) {
    recommends_list_ids.push(recommends_list[i]['id'])
}
  chrome.runtime.sendMessage({message: 'RECOMMENDS_LIST', 'recommends_list': recommends_list_ids})
  openReadingListIframe(mode='same_domain')
}
  
function twitterShowLeftPanel() {
  var svg = window['$']('.extension-svg');
  if (svg.length > 0) svg['remove']();
  window['document']['body']['classList']['remove']('body-collapsed');
}

function openReadingListIframe(mode='all_sites') {
  chrome.runtime.sendMessage({message: 'READING_LIST_ACCESSED'});

  let iframe = document.querySelector('iframe#limitReached');
  if (!iframe || iframe == null) {
    iframe = document.createElement('iframe');
    iframe.src = `${EXT_URL + '/widget/reading_list.html'}`;
    if (mode == 'same_domain'){
      iframe.src = `${EXT_URL + '/widget/recommends_list.html'}`;
	}
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'yes');
    iframe.setAttribute('id', 'limitReached');
    iframe.setAttribute('style', `position: fixed;
          top: 25px;
          display: block;
          width: 1100px !important;
          height: 620px;
          left: 10%;
          margin-left: -1px;
          z-index: 99999999999999;
          -webkit-box-shadow: -12px 0px 148px 110px rgba(50,50,50,.3);
          //*-webkit-box-shadow: -12px 0px 148px 110px rgba(0,0,0,0.3);*//
          -moz-box-shadow: -12px 0px 148px 110px rgba(0,0,0,0.3);
          transition: opacity .5s linear;
          opacity: 0;
    `);
    setTimeout(() => {
      iframe.style.opacity = 1;
    }, 100);
    iframe.style.setProperty("z-index", "2147483647", "important");
    rootElement = document.querySelector('#overlay_Div1');
    document.body.appendChild(iframe);
    iframeClose = document.createElement('div');
    iframeClose.setAttribute('id', 'iframeClose');
    iframeClose.onclick = function() {
      document.querySelector('iframe#limitReached').style.opacity = 0;
      setTimeout(() => {
        document.querySelector('iframe#limitReached').remove();
        this.remove();
      }, 100);
    }
    iframeClose.setAttribute('style', `position: fixed;
          top: 0;
          margin-top: 47px;
          display: block;
          height: 61%;
          left: 60%;
          margin-left: 330px;
          font-family: poppins, arial;
          font-size: 12px;
          color: gray;
          font-weight: 600;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          z-index: 2147483648;
      `);
    iframeClose.textContent = 'CLOSE';
    document.body.appendChild(iframeClose);
  }
  return iframe
}


function openLimitReachedIframe() {
  let iframe = document.querySelector('iframe#limitReached');
  if (!iframe || iframe == null) {
    iframe = document.createElement('iframe');
    iframe.src = "https://theconversation.social/limit_reached/";
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('id', 'limitReached');
    iframe.setAttribute('style', `position: fixed;
          top: 25px;
          display: block;
          width: 750px;
          height: 600px;
          left: 50%;
			    margin-left: -375px;
          z-index: 99999999999999;
          -webkit-box-shadow: -12px 0 48px 0 rgba(50,50,50,.20);
          //*-webkit-box-shadow: 0px 0px 20px 9px rgba(0,0,0,0.35);*//
          -moz-box-shadow: 0px 0px 20px 9px rgba(0,0,0,0);
          transition: opacity .5s linear;
          opacity: 0;
    `);
    setTimeout(() => {
      iframe.style.opacity = 1;
    }, 100);
    iframe.style.setProperty("z-index", "2147483647", "important");
    rootElement = document.querySelector('#overlay_Div1');
    document.body.appendChild(iframe);
    iframeClose = document.createElement('div');
    iframeClose.setAttribute('id', 'iframeClose');
    iframeClose.onclick = function() {
      document.querySelector('iframe#limitReached').style.opacity = 0;
      setTimeout(() => {
        document.querySelector('iframe#limitReached').remove();
        this.remove();
      }, 100);
    }
    iframeClose.setAttribute('style', `position: fixed;
          top: 0;
          margin-top: 40px;
          display: block;
          height: 60%;
          left: 49%;
          margin-left: 330px;
          font-family: poppins, arial;
			    font-size: 12px;
			    color: gray;
			    font-weight: 600;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          z-index: 2147483648;
      `);
    iframeClose.textContent = 'CLOSE';
    document.body.appendChild(iframeClose);
  }
  return iframe
}

function openNoSubscriptionIframe(has_twitter=true) {
  let iframe = document.querySelector('iframe#ext_complete_registration');
  if (!iframe || iframe == null) {
    iframe = document.createElement('iframe');
    iframe.src = `${EXT_URL + '/widget/no_subscription.html'}`;
    if (has_twitter){
      iframe.src = "https://theconversation.social/ext_complete_registration/";
    } else {
      iframe.src = "https://theconversation.social/ext_complete_registration/?no_tw=true";
    }
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('id', 'ext_complete_registration');
    iframe.setAttribute('style', `position: fixed;
          background-color: white;
          top: 25px;
          display: block;
          width: 750px;
          height: 600px;
          left: 50%;
			    margin-left: -375px;
          z-index: 99999999999999;
          -webkit-box-shadow: -12px 0 48px 0 rgba(50,50,50,.20);
          //*-webkit-box-shadow: 0px 0px 20px 9px rgba(0,0,0,0.35);*//
          -moz-box-shadow: 0px 0px 20px 9px rgba(0,0,0,0);
          transition: opacity .5s linear;
          opacity: 0;
    `);
    setTimeout(() => {
      iframe.style.opacity = 1;
    }, 100);
    iframe.style.setProperty("z-index", "2147483647", "important");
    rootElement = document.querySelector('#overlay_Div1');
    document.body.appendChild(iframe);
    iframeClose = document.createElement('div');
    iframeClose.setAttribute('id', 'iframeClose');
    iframeClose.onclick = function() {
      document.querySelector('iframe#ext_complete_registration').style.opacity = 0;
      setTimeout(() => {
        document.querySelector('iframe#ext_complete_registration').remove();
        this.remove();
      }, 100);
    }
    iframeClose.setAttribute('style', `position: fixed;
          top: 0;
          margin-top: 40px;
          display: block;
          height: 60%;
          left: 49%;
          margin-left: 330px;
          font-family: poppins, arial;
			    font-size: 12px;
			    color: gray;
			    font-weight: 600;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          z-index: 2147483648;
      `);
    iframeClose.textContent = 'CLOSE';
    document.body.appendChild(iframeClose);
  }
  return iframe
}

async function openMailIframe(event) {
  let url_to_iframe = event.data.param1;
  let new_tab_instead = event.data.param2;
  if (new_tab_instead == 'needed'){
    chrome.runtime.sendMessage({message: 'OPEN_NEW_TAB', 'url': url_to_iframe})
    return
  }  
  // if we aren't doing tab, proceed with iframe
  let iframe = document.querySelector('iframe#limitReached');
  if (!iframe || iframe == null) {
    iframe = document.createElement('iframe');
    value1="false"
    // important -- to use this you must edit manifest.json; add your html where widget/index.html is
    //iframe.src = `${EXT_URL + '/widget/no_subscription.html'}`;
    //iframe.src = `${EXT_URL + '/widget/no_subscription.html?param1=' + value1}`
    //iframe.src = 'https://theconversation.social/promo_for_ext_user/'
    //iframe.src = 'https://theconversation.social/promo_for_send_invitations/'
    iframe.src = url_to_iframe // here we are passing a url from the backend API to know what to serve
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('id', 'limitReached');
    iframe.setAttribute('style', `position: fixed;
          background-color: white;
          top: 25px;
          display: block;
          width: 750px;
          height: 600px;
          border: 2px solid grey;
          left: 50%;
          margin-left: -375px;
          z-index: 99999999999999;
          -webkit-box-shadow: -12px 0 48px 0 rgba(50,50,50,.20);
          //*-webkit-box-shadow: 0px 0px 20px 9px rgba(0,0,0,0.35);*//
          -moz-box-shadow: 0px 0px 20px 9px rgba(0,0,0,0);
          transition: opacity .5s linear;
          opacity: 0;
    `);
    setTimeout(() => {
      iframe.style.opacity = 1;
    }, 100);
    iframe.style.setProperty("z-index", "2147483647", "important");
    rootElement = document.querySelector('#overlay_Div1');
    document.body.appendChild(iframe);
    iframeClose = document.createElement('div');
    iframeClose.setAttribute('id', 'iframeClose');
    iframeClose.onclick = function() {
      document.querySelector('iframe#limitReached').style.opacity = 0;
      setTimeout(() => {
        document.querySelector('iframe#limitReached').remove();
        this.remove();
      }, 100);
    }
    iframeClose.setAttribute('style', `position: fixed;
          top: 0;
          margin-top: 40px;
          display: block;
          height: 60%;
          left: 49%;
          margin-left: 330px;
          font-family: poppins, arial;
			    font-size: 12px;
			    color: gray;
			    font-weight: 600;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          z-index: 2147483648;
      `);
    iframeClose.textContent = 'CLOSE';
    document.body.appendChild(iframeClose);
  }
  return iframe
}

async function stopadditionalButtons(){
    //console.log("additional buttons can't be shown!")
    GOOEY_CAN_BE_SHOWN = false
    await sleep(10000)
    GOOEY_CAN_BE_SHOWN = true
    //console.log('additional buttons can be shown again!')
}

function resetLoadParams() {
  load.timing = 0;
  load.frames_per_sec = 30;
  load.cur_speed = 1.5 / load.frames_per_sec;
  load.min_anim_speed = 4;
  clearInterval(load.load_interval);
  load.load_interval = null;
  load.cur_progress = 0;
}

function load () {
  // Got response in content script

  // init SVG animation vars
  resetLoadParams()
  load.cur_progress = window['$']('#curate_button_id').attr('data-progress') | 0
  //let cur_progress = 0

  // eslint-disable-next-line no-undef
  chrome.runtime.onMessage.addListener((request) => {
    const updateProgress = (value) => {
      const getPathData = (percentage) => {
        const getPathString = (startX, startY, startAngle, endAngle, radius) => {
          var x1 = (startX + radius * Math.cos(Math.PI * startAngle / 180)).toFixed(3)
          var y1 = (startY + radius * Math.sin(Math.PI * startAngle / 180)).toFixed(3)
          var x2 = (startX + radius * Math.cos(Math.PI * endAngle / 180)).toFixed(3)
          var y2 = (startY + radius * Math.sin(Math.PI * endAngle / 180)).toFixed(3)
          var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
          var pathString = 'M' + startX + ',' + startY + ' L' + x1 + ',' + y1 + ' A' + radius + ', ' + radius + ', 0, ' + largeArcFlag + ', 1, ' + x2 + ', ' + y2 + 'z'
          return pathString
        }

        const maxAngle = 360 / 100 * percentage;
        const svg = window['$']('#curate_button_id').find('svg');
        const svgElement = svg.get(0);

        const width = parseInt(svgElement ? svgElement.getAttribute('width') : '80');
        const height = parseInt(svgElement ? svgElement.getAttribute('height'): '80');

        return getPathString(width / 2, height / 2, -90, maxAngle - 90, 40)
      }

      value = parseFloat(value)
      if (value == 100) {
        value = 99.99
      }
      const speed_adjuster = ((1 / (value - load.cur_progress)) * 2) + 1
      const speed = ((value - load.cur_progress) / ((load.min_anim_speed * load.frames_per_sec) / speed_adjuster));
      load.cur_speed = speed
      // eslint-disable-next-line no-console
      //console.log((load.timing / 1000).toFixed(2), load.cur_progress.toFixed(2), value.toFixed(2), load.cur_speed.toFixed(2), "Data")
      if (!load.load_interval) {
        load.load_interval = setInterval(function () {
          load.timing = load.timing + (1000 / load.frames_per_sec)
          load.cur_progress = load.cur_progress + load.cur_speed
          if (load.cur_progress > 99) {
            load.cur_progress = 99.99
          }
          const pathValue = getPathData(load.cur_progress)
          const path = document.getElementById('clip_path')
          path.setAttribute('d', pathValue)
          if (load.cur_progress == 99.99) {
            // eslint-disable-next-line no-console
            //console.log('Finished at :', load.timing / 1000)
            clearInterval(load.load_interval)
          }
        }, 1000 / load.frames_per_sec)
      }
    }

    if (request.message === 'NOTIFICATION_ERROR') {
      showError(request.data)
    }
    else if (request.message === 'LIMIT_REACHED_ERROR') {
      openLimitReachedIframe()
    }
    else if (request.message === 'NO_SUBSCRIPTION_ERROR') {
      openNoSubscriptionIframe()
    }
    else if (request.message === 'NO_SUBSCRIPTION_NO_TW_ERROR') {
      openNoSubscriptionIframe(has_tw=false)
    }
    else if ((request.message === 'API') && (window.location.hostname !== 'twitter.com')) {
      if (request.data.mail){
        showMail(request.data)
      }
      if (request.data.alert){
        if (request.data.alert.style == "top"){
            showTopSlideOutAlert(request.data)
        } else if (request.data.alert.style == "bottom") {
            showBottomSlideOutAlert(request.data)
        }
      }
      if (request.data.personalization){
        if ((request.data.personalization.same_publisher_tweets_from_people_you_follow) &&
         (request.data.personalization.same_publisher_tweets_from_people_you_follow.length > 0)) {
           showFriendRecommendationsAlert(request.data)
		}	
        // removing tweets_for_reading_list alert
        else if ((request.data.personalization.tweets_for_reading_list) &&
         (request.data.personalization.tweets_for_reading_list.length > 0)) {
		   chrome.runtime.sendMessage({message: 'READING_LIST', 'reading_list': request.data.personalization.tweets_for_reading_list})
           //showReadingListAlert(request.data) 
		}
	  } 
      if (request.data.set_options){
          chrome.storage.local.set(request.data.set_options)
      }
      const { data = {} } = request
      const dataProgress = window['$']('#curate_button_id').attr('data-progress') | 0
      if (data && (data.completion_percentage && (dataProgress < 100)) || (data.completion_percentage == 'undefined')) {
        const currentPercentage = data.completion_percentage | 1
	  //* use logic below if you want it to move at all times.
      //const currentPercentage = data.completion_percentage | 1
      //if (data && (dataProgress < 100) && (dataProgress < currentPercentage)) {
        updateProgress(currentPercentage)
        // eslint-disable-next-line no-console
        //console.log('data-progress', currentPercentage)
        window['$']('#curate_button_id').attr('data-progress', currentPercentage)

        if (shouldBeOpen && (data.stats || {total_tweets: 0}).total_tweets > 0) {
          openWidget_popup()
        }

        if (((data.stats || {total_tweets: 0}).total_tweets > 0) || (data.status && data.status == 'finished')){
          const size = String(data.stats.total_tweets).length;
          window['$']('#curate_button_id .__badge').text(data.stats.total_tweets);
          window['$']('#curate_button_id .__badge').addClass('badge-size-' + size);
          window['$']('#curate_button_id .__badge').show();
        }
      }
    }
  })

  window.addEventListener('load', () => {
    TimeLoading.LOAD = Date.now()
    //console.log('-------------------------------------------')
    //console.log('DOM CONTENT LOADED', TimeLoading.DOM)
    //console.log('STYLE LOADED', TimeLoading.STYLE)
    //console.log('FULL LOADED', TimeLoading.LOAD)
    //console.log('FULL LOADED  - DOM Content Loaded (sec)', (TimeLoading.LOAD - TimeLoading.DOM) / 1000)
    //console.log('FULL LOADED  - STYLE LOADED', (TimeLoading.LOAD - TimeLoading.STYLE) / 1000)
    //console.log('STYLE LOADED - DOM Content Loaded (sec)', (TimeLoading.STYLE - TimeLoading.DOM) / 1000)
    //console.log('DOM Content Loaded - Content script inited (sec)', (TimeLoading.DOM - TimeLoading.SCRIPT) / 1000)
    //console.log('-------------------------------------------')
  }, false)

  // Get information about tab id
  chrome.runtime.sendMessage({message: 'TAB_ID'}, (response) => {
    const {tabId} = response
    chrome.storage.onChanged.addListener((changes) => {
      if ('close' in changes && changes.close.newValue && changes.close.newValue.tabId === tabId) {
        const iframe = window['$']('#overlay_Div1 iframe')
        window['$'](iframe).animate({ 'right': '-=661px' }, 'slow', () => {
          window['$']('#overlay_Div1 iframe').remove()
        });
        twitterShowLeftPanel();
      } else if ('dontdisplay' in changes && changes.dontdisplay) {
        showHideCuration(changes.dontdisplay.newValue)
      }
    })
  })
  loadTimer = setInterval(initCurationDomain, 1000)
}

/**
 * Window event listener for messages sent from unit/iframe
 * When message is sent from an iframe/unit, function animateIframe is being invoked
 *
 * @param {string} "message" - a case-sensitive string representing the event type to listen for
 * @param {function} animateIframe - animate function used for animating iframe/unit
 *
 */
window.addEventListener("message", animateIframe, false);

var iframeCloseEvent = null;

/**
 * The event listener callback function for executing animation of an iframe.
 * Animation consists of two parts:
 *  - animating the unit to the center of the screen
 *  - animating unit to the original position
 *
 * @param {event} event - an event object sent from window event lisiner
 *
 */
function animateIframe(event) {
  if(event.origin === EXT_URL) {
    var expendWidth = 58.5;
    var marginWidth = (100 - expendWidth)/2;
    var screenWidth = jQuery(window).width();
    var iframeWidth = jQuery("#overlay_Div1 iframe").width();
    var iframeWidthProcentage = (iframeWidth * 100) / screenWidth;
    var translationWidth = 100 - iframeWidthProcentage - marginWidth;
    let width
    let expandedWidth = 58.5

    if (window.location.hostname === 'twitter.com') {
      width = 620
    } else {
      const percentageOf40px = 40 / screenWidth * 100
      expandedWidth += percentageOf40px
      translationWidth += percentageOf40px
      width = 661
    }

    if(event.data == "animate"){
      jQuery("#overlay_Div1 iframe").animate({
        left: "-=" + translationWidth + "%",
      width: expandedWidth + "%"}, 1025);
      jQuery("#overlay_Div1 iframe").addClass("animated");
      jQuery("#overlay_Div1").addClass("iframe-overlay-in");
      iframeCloseEvent = event;
    } else if(event.data == "do_not_animate"){
        // close logic
        jQuery("#overlay_Div1 iframe").animate({
          width: `${width}px`
        }, 925, function() {
          var percentWindow = screenWidth/100
          var framePosition = jQuery("#overlay_Div1 iframe").offset()
          translationWidth = (screenWidth-(width + framePosition.left))/percentWindow
          jQuery("#overlay_Div1 iframe").animate({
            left: "+=" + translationWidth + "%"
          }, 925);
        });

        jQuery("#overlay_Div1 iframe").removeClass("animated");
        jQuery("#overlay_Div1").removeClass("iframe-overlay-in");

        jQuery("#overlay_Div1").addClass("iframe-overlay-out");

        setTimeout(function(){
          jQuery("#overlay_Div1").removeClass("iframe-overlay-out");
        }, 3000);
        iframeCloseEvent = null;
    } else if(event.data == "iframe_closed") {
        jQuery("#overlay_Div1").removeClass("iframe-overlay-in");
        jQuery("#overlay_Div1").removeClass("iframe-overlay-out");
        iframeCloseEvent = null;
    }
  }
}

/**
 * Document event listener for click on the document
 *
 * @param {string} "click" - a case-sensitive string representing the event type to listen for
 * @param {function} - function used for sending message to an iframe that the user has clicked
 * on the document outside of the unit/iframe to invoke unit/iframe closure action
 *
 */
document.addEventListener("click", function(event){
  if(iframeCloseEvent !== null) {
    iframeCloseEvent.source.postMessage("trigger_close_click", EXT_URL);

  }
});

load()

function buttonAnimnation (url) {
  if (document.getElementById('curate_button_id') != null) {
    document.getElementById('curate_button_id').addEventListener('click', function () {
      document.getElementById('curate_button_id').style.animation = 'move 0.3s'
      // document.getElementById('curate_button_id').style.WebkitAnimationFillMode = " forwards";
      document.getElementById('curate_button_id').style.animationduration = ' 0.3s'
      var styleEl = document.createElement('style')
      styleEl.innerHTML = '@keyframes move{' +
             'from{transform: translateX(0); opacity : 1;animation-duration: 0.15s;}' +
             'to{transform: translate(4px, 4px);' +
             'animation-duration: 0.3s;}' +
             '}'
      document.head.appendChild(styleEl)
      setTimeout(function () {
        // var newUrl = 'https://theconversation.social/social-discovery/?q=' + url
        // console.log(newUrl)
        // var win = window.open(newUrl, '_blank')
        // win.focus()
        if (!document.getElementById('curate_button_id'))
          document.getElementById('curate_button_id').style.animation = 'unset'
      }, 2000)
      removeTooltip()
    })
        if ($('#c_tooltip').length) {
                $("#c_tooltip").on("click", function() {
                    removeTooltip()
                });
                $("#c_popup_tooltip").on("click", function() {
                    removeTooltip()
                });
                $(document).ready(
                    function() {
                        function animateMydiv() {
                            $('#c_tooltip').animate({
                                'bottom': '12px'
                            }, 1500).animate({
                                'bottom': '20px'
                            }, 1500, animateMydiv);
                        }
                        animateMydiv();
                    });
            }
        }
    }
    
    function removeTooltip() {
        if ($(`#c_tooltip`).length) {
            $(`#c_tooltip`).remove();
            $(`#c_popup_tooltip`).remove();
  }
}

function createIframe (rootElement) {
  const iframe = document.createElement('iframe')
  iframe.src = `${EXT_URL + '/widget/index.html'}`
  iframe.setAttribute('allowTransparency', 'true');
  iframe.setAttribute('id', 'widget_frame_id');
  iframe.setAttribute('style', `position: fixed;
        top: 0;
        display: block;
        right: -661px;
        width: 661px;
        height: 100%;
        z-index: 99999999999999;
        border: none;
        //*-webkit-box-shadow: -12px 0 48px 0 rgba(50,50,50,.20);*//
        //*-moz-box-shadow: 0px 0px 20px 9px rgba(0,0,0,0*//
  `)
  // window['$'](iframe).hide()
  rootElement.appendChild(iframe)
  return iframe
}

function openWidget_popup () {
  // disable gooey buttons from coming up for 10 seconds after click of C
  stopadditionalButtons()

  // make sure gooey buttons are not visible already
  $(".icon-menu").css({
    "visibility": "hidden",
    "opacity": 0,
  });
  setTimeout(() => {
    $(".icon-menu").css({
      "visibility": "visible",
      "opacity": 1,
    });
  }, 3000);

  // now proceed
  let iframe = document.querySelector('#overlay_Div1 iframe')
  if (!iframe || iframe == null) {
    addWidget_popup()
    iframe = document.querySelector('#overlay_Div1 iframe')
    shouldBeOpen = true
  }
  const progress = window['$']('#curate_button_id').attr('data-progress') || 0
  if (progress) {
    shouldBeOpen = false
    window['$'](iframe).animate({ 'right': '0' }, 'slow')
    document.querySelector('#curate_button_id').style.setProperty("z-index", "2147483646", "important")
    document.querySelector('#extensionNotifications').style.setProperty("z-index", "2147483646", "important")
    // commenting this out because extension alerts like showFriendRecommendationsAlert getting covered by iframe. add back in if it creates problems.
    //iframe.style.setProperty("z-index", "2147483647", "important")
  }
}

function addWidget_popup () {
  var g = document.querySelector('#overlay_Div1')
  const iframe = document.querySelector('#overlay_Div1 iframe')
  if (!iframe || iframe == null) {
    createIframe(g)
  }
}

// adding gooey buttons	
function addGooeyStyle(styles) {
  /* Create style document */
  var css = document.createElement('style');
  css.type = 'text/css';
  if (css.styleSheet)
    css.styleSheet.cssText = styles;
  else
    css.appendChild(document.createTextNode(styles));
  /* Append style to the tag name */
  document.getElementsByTagName("head")[0].appendChild(css);
}

function addCuration (autorun) {
  const COLOR_SCHEME = {
    default: {
      circle_white_black: '<circle style="stroke: #000; fill: #fff; filter:url(#dropshadow);" cx="39" cy="39" r="32" stroke="#000" stroke-width="1" fill="#fff"></circle>',
      text_white_black: '<text x="39" y="43" alignment-baseline="middle" dominant-baseline="middle" font-size="48" fill="#000" text-anchor="middle" style=" font-size: 48px !important; font-family: poppins !important; font-weight: 500 !important;">C</text>',
      circle_black_white: '<circle style="fill: #000" cx="39" cy="39" r="32" fill="#000"></circle>',
      text_black_white: '<text x="39" y="43" alignment-baseline="middle" dominant-baseline="middle" font-size="48" fill="#fff" text-anchor="middle" style=" font-size: 48px !important; font-family: poppins !important; font-weight: 500 !important;">C</text>',
    },
    gray: {
      circle_white_black: '<circle style="stroke: black; fill: #fff; filter:url(#dropshadow);" cx="39" cy="39" r="32" stroke="#000" stroke-width="1" fill="#fff"></circle>',
      text_white_black: '<text x="39" y="43" alignment-baseline="middle" dominant-baseline="middle" font-size="48" fill="fff" text-anchor="middle" style=" font-size: 48px !important; font-family: poppins !important; font-weight: 500 !important;">C</text>',
      circle_black_white: '<circle style="fill: #d8dce3;" cx="39" cy="39" r="32" fill="#d8dce3"></circle>',
      text_black_white: '<text x="39" y="43" alignment-baseline="middle" dominant-baseline="middle" font-size="48" fill="#202020" text-anchor="middle" style=" font-size: 48px !important; font-family: poppins !important; font-weight: 500 !important;">C</text>',
    }
  };

  const currentScheme = COLOR_SCHEME[autorun ? 'gray' : 'default'];
	    chrome.storage.local.get(INSTALLED, function(result) {
	        installed = result['installed-c']
	        return true
	    });
  chrome.storage.local.get({dontdisplay: false}, function (items) {
    dontdisplay = items.dontdisplay
    if (!dontdisplay) {
      var od = document.querySelector('#overlay_Div1')
      if(!od){
        //console.log("added on ICON C on popup button")
        od = document.createElement('div')
        od.setAttribute('id', 'overlay_Div1')
        document.body.appendChild(od)
      }
      var cb = document.querySelector("#curate_button_id")
      if(!cb){
        const elNotification = document.createElement('div')
        od.appendChild(elNotification)
        elNotification.outerHTML = '<div id="extensionNotifications"></div>'

        const curateButtonId = document.createElement('div')
        curateButtonId.setAttribute('id', 'container_curate_button_id')
        od.appendChild(curateButtonId)
        // curateButtonId.outerHTML = '<div id="curate_button_id">'

        if (installed) {
            const tooltip = document.createElement('div')
            curateButtonId.appendChild(tooltip)
            tooltip.outerHTML = createToolTip()
            chrome.storage.local.set({
                'installed-c': false
            });
        }

        const elCurateButtonChild = document.createElement('div')
        curateButtonId.appendChild(elCurateButtonChild)
        // adding gooey buttons
        const readIcon = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNyAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguNSAyLjA0NDE3QzkuNDczMzMgMS4zOTc1IDEwLjc5NSAxIDEyLjI1IDFDMTMuNzA1OCAxIDE1LjAyNjcgMS4zOTc1IDE2IDIuMDQ0MTdWMTIuODc3NUMxNS4wMjY3IDEyLjIzMDggMTMuNzA1OCAxMS44MzMzIDEyLjI1IDExLjgzMzNDMTAuNzk1IDExLjgzMzMgOS40NzMzMyAxMi4yMzA4IDguNSAxMi44Nzc1TTguNSAyLjA0NDE3VjEyLjg3NzVWMi4wNDQxN1pNOC41IDIuMDQ0MTdDNy41MjY2NyAxLjM5NzUgNi4yMDUgMSA0Ljc1IDFDMy4yOTUgMSAxLjk3MzMzIDEuMzk3NSAxIDIuMDQ0MTdWMTIuODc3NUMxLjk3MzMzIDEyLjIzMDggMy4yOTUgMTEuODMzMyA0Ljc1IDExLjgzMzNDNi4yMDUgMTEuODMzMyA3LjUyNjY3IDEyLjIzMDggOC41IDEyLjg3NzVWMi4wNDQxN1oiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMS42NjY2NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=`;
        const gearIcon = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5LjUxODcgMTEuMDg1QzE5LjU1ODEgMTAuNzI4NyAxOS41ODMxIDEwLjM2NzUgMTkuNTgzMSAxMEMxOS41ODMxIDkuNjMyNSAxOS41NTgxIDkuMjcxMjUgMTkuNTE4MSA4LjkxNDM3TDE2Ljc4MTkgNy45NDEyNUMxNi42NDU2IDcuNDkzNzUgMTYuNDY2OSA3LjA2NjI1IDE2LjI1MDYgNi42NkwxNy40OTU2IDQuMDRDMTcuMDQyNSAzLjQ3MTc4IDE2LjUyNzIgMi45NTYwNyAxNS45NTk0IDIuNTAyNUwxMy4zMzk0IDMuNzVDMTIuOTMxIDMuNTMwNzkgMTIuNTAxOCAzLjM1MjgzIDEyLjA1ODEgMy4yMTg3NUwxMS4wODU2IDAuNDgyNDk1QzEwLjcyODcgMC40NDI0OTUgMTAuMzY3NSAwLjQxNjg3IDEwIDAuNDE2ODdDOS42MzI0OSAwLjQxNjg3IDkuMjcxMjUgMC40NDE4NyA4LjkxNDM3IDAuNDgyNDk1TDcuOTQxODcgMy4yMTg3NUM3LjQ5NDM3IDMuMzU0MzcgNy4wNjY4NyAzLjUzMjUgNi42NjA2MiAzLjc1TDQuMDQgMi41MDI1QzMuNDcxMjUgMi45NTU2MiAyLjk1NjI1IDMuNDcxMjUgMi41MDI1IDQuMDRMMy43NSA2LjY1ODc1QzMuNTMyNSA3LjA2NSAzLjM1NDM3IDcuNDkzMTIgMy4yMTg3NSA3Ljk0TDAuNDgyNDk1IDguOTE1QzAuNDQyNDk1IDkuMjcxMjUgMC40MTY4NyA5LjYzMzc1IDAuNDE2ODcgMTAuMDAwNkMwLjQxNjg3IDEwLjM2NzUgMC40NDE4NyAxMC43Mjg3IDAuNDgyNDk1IDExLjA4NTZMMy4yMTg3NSAxMi4wNTk0QzMuMzU0MzcgMTIuNTA2MiAzLjUzMjUgMTIuOTM0NCAzLjc1IDEzLjM0MDZMMi41MDMxMiAxNS45NjA2QzIuOTU2MjUgMTYuNTI5NCAzLjQ3MTg3IDE3LjA0MzcgNC4wNDA2MiAxNy40OTY5TDYuNjU4NzUgMTYuMjVDNy4wNjUgMTYuNDY3NSA3LjQ5MzEyIDE2LjY0NjIgNy45NCAxNi43ODI1TDguOTEzNzQgMTkuNTE4MUM5LjI3IDE5LjU1NzUgOS42MzEyNCAxOS41ODI1IDkuOTk5MzcgMTkuNTgyNUMxMC4zNjY5IDE5LjU4MjUgMTAuNzI3NSAxOS41NTc1IDExLjA4NDQgMTkuNTE3NUwxMi4wNTgxIDE2Ljc4MTJDMTIuNTA1IDE2LjY0NSAxMi45MzMxIDE2LjQ2NjIgMTMuMzM5NCAxNi4yNUwxNS45NTk0IDE3LjQ5NUMxNi41MjgxIDE3LjA0MTkgMTcuMDQyNSAxNi41MjYyIDE3LjQ5NTYgMTUuOTU4N0wxNi4yNSAxMy4zMzk0QzE2LjQ2NzUgMTIuOTM1IDE2LjY0NjIgMTIuNTA1NiAxNi43ODI1IDEyLjA1ODFMMTkuNTE4MSAxMS4wODVIMTkuNTE4N1pNMTAgMTMuMDQzN0M5LjYwMDIgMTMuMDQzOCA5LjIwNDMxIDEyLjk2NTIgOC44MzQ5MiAxMi44MTIyQzguNDY1NTIgMTIuNjU5MyA4LjEyOTg3IDEyLjQzNTIgNy44NDcxMSAxMi4xNTI1QzcuMjc2MDcgMTEuNTgxNyA2Ljk1NTE2IDEwLjgwNzQgNi45NTUgMTBDNi45NTQ4MyA5LjE5MjU4IDcuMjc1NDIgOC40MTgxNiA3Ljg0NjIzIDcuODQ3MTJDOC40MTcwNCA3LjI3NjA3IDkuMTkxMzMgNi45NTUxNiA5Ljk5ODc0IDYuOTU1QzEwLjgwNjIgNi45NTQ4MyAxMS41ODA2IDcuMjc1NDIgMTIuMTUxNiA3Ljg0NjIzQzEyLjcyMjcgOC40MTcwNCAxMy4wNDM2IDkuMTkxMzMgMTMuMDQzNyA5Ljk5ODc1QzEzLjA0MzkgMTAuODA2MiAxMi43MjMzIDExLjU4MDYgMTIuMTUyNSAxMi4xNTE2QzExLjU4MTcgMTIuNzIyNyAxMC44MDc0IDEzLjA0MzYgMTAgMTMuMDQzN1oiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=`;

        elCurateButtonChild.outerHTML = `
        <div id="curate_button_id" class="menu-open-button">
        <svg style="height: 80px !important; width: 80px !important;" width="80" height="80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    
          <defs>
              <filter id="dropshadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <!-- stdDeviation is how much to blur -->
                  <feMerge>
                      <feMergeNode/>
                      <!-- this contains the offset blurred image -->
                      <feMergeNode in="SourceGraphic" />
                      <!-- this contains the element that the filter is applied to -->
                  </feMerge>
              </filter>
          </defs>
          <defs>
              <clipPath id="cut-off-bottom" clip-rule="nonzero">
                  <path d="M0,0" id="clip_path"></path>
              </clipPath>
          </defs>
          <g id="white_black">
              ${currentScheme.circle_white_black}
              ${currentScheme.text_white_black}
          </g>
          <g id="black_white" clip-path="url(#cut-off-bottom)">
              ${currentScheme.circle_black_white}
              ${currentScheme.text_black_white}
          </g>
        </svg>
        <span class="__badge" ></span>
        <span class="__mail" ></span>
      </div>
  <nav class="icon-menu" id="icon-menu-id">
        <a href="#" id="gear-icon-event-id" class="menu-item"> <img src="${readIcon}"> </a>
        <a href="https://theconversation.social/manage" target="_blank" class="menu-item"> <img src='${gearIcon}'> </a>
      </nav>
      
          <!-- filters -->
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
              <defs>
                <filter id="shadowed-goo">
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                    <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
                    <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2" result="shadow" />
                    <feOffset in="shadow" dx="1" dy="1" result="shadow" />
                    <feComposite in2="shadow" in="goo" result="goo" />
                    <feComposite in2="goo" in="SourceGraphic" result="mix" />
                </filter>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                    <feComposite in2="goo" in="SourceGraphic" result="mix" />
                </filter>
              </defs>
          </svg>
          `;
        const buttonStyle = `

          .icon-menu {
            transform: translate3d(0, 0, 0);
            transition: transform ease-out 200ms;
            cursor: pointer;
            position: fixed;
            bottom: 48px;
            right: 0;
            z-index: 21474836 !important;
            display: flex;
            width: 175px;
            height: 96px;
            align-items: center;
            filter: url(#shadowed-goo);
          }
          .icon-menu .menu-item {
            transition-duration: 180ms;
            height: 35px;
            width: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #FFF;
            border-radius: 50%;
            /* border: 2px solid #444; */
            font-weight: bold;
            /* position: absolute; */
            box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.4);
            // padding: 2px;
            margin: 2px;
          }
          .icon-menu .menu-item img {
            width: 18px;
            height: 18px;
          }
          .icon-menu {
           visibility: hidden;
          //  opacity: 0;
          }
        `;
        // Evan this controls 2nd button speed => menu-open-button:hover ~ .menu-item:nth-child(2)
        // Evan this controls 3rd button speed => menu-open-button:hover ~ .menu-item:nth-child(3)
        // ICON background color => search =>  .icon-menu .menu-item
        // ICON speed of 2nd icon => search =>  transform: translate3d(85px, 0, 0);
        // ICON speed of 3rd icon => search =>  transform: translate3d(140px, 0, 0);
        addGooeyStyle(buttonStyle);
      }
      if (autorun) {
        chrome.storage.local.get({'user_subscribed': false}, function (result) {
          if(result.user_subscribed)
            addWidget_popup()
          else{
            var url="https://theconversation.social/article_check/?url="+window.location.href;
            chrome.runtime.sendMessage({message: 'ARTICLE_CHECK', url: url}, (response) => {
            if(response.link_exists)
              addWidget_popup()
			})
          }
        })
      }
      // reads from friends
      setTimeout(() => checkForTweetReaction(), 1000);
      //addFriendsReads(od) //commenting  this out as we have moved the button
      window['$']('#curate_button_id').click(openWidget_popup)
      // gooey start
      const todo = `
      .menu-open-button:hover ~ .icon-menu,
            
            .icon-menu:hover .menu-item:nth-child(1),
            .menu-open-button:hover ~ .icon-menu .menu-item:nth-child(1) {
              transition-duration: 180ms;
              transform: translate3d(80px, 0, 0);
            }
            .icon-menu:hover .menu-item:nth-child(2),
            .menu-open-button:hover ~ .icon-menu .menu-item:nth-child(2) {
              transition-duration: 280ms;
              transform: translate3d(100px, 0, 0);
              margin-left: -5px;
            }`
      var gooeyTimeout;
      let menuShown = false;
      let menuVisited = false;

      // var curatebtnhover = $('#curate_button_id').is(":hover");
      // var iconmenuhover = $('#icon-menu-id').is(":hover");

      // if (!curatebtnhover && !iconmenuhover) {
      //   console.log("GEBAAAAAAAAAAAA");
      // }



      // var isHovered = !!$('#curate_button_id,#icon-menu-id').
      //   filter(function () { return $(this).is(":hover"); }).length;
      // console.log("Geba>>>>>>> ", isHovered);

      const isHover = e => e.parentElement.querySelector(':hover') === e;
      const isHoverbtn = e => e.parentElement.querySelector(':hover') === e;
      var issmallhovered = false;

      const myDiv = document.getElementById('icon-menu-id');
      document.addEventListener('mousemove', function checkHover() {
        const hovered = isHover(myDiv);
        issmallhovered = hovered;
        if (hovered !== checkHover.hovered) {
          hovered ? 'hovered' : hideadditionalbuttons();
          checkHover.hovered = hovered;
        }
      });

      const myDivs = document.getElementById('curate_button_id');
      document.addEventListener('mousemove', function checkHover() {
        const hovered = isHoverbtn(myDivs);
        if (hovered !== checkHover.hovered) {
          hovered ? 'hovered' : issmallhovered ? "hovered small" : hideadditionalbuttons();
          checkHover.hovered = hovered;
        }
      });

      // if (!isHover) {
      //   hideadditionalbuttons();
      // }
      // console.log("yidersal bakih ", isHover);

      $(".icon-menu").hover(() => { menuVisited = true; }, hideadditionalbuttons);

      // $('#curate_button_id').click(openWidget_popup);

      $("#curate_button_id").hover(function (event) {
        gooeyTimeout = setTimeout(showadditionalbuttons, 2500);
      }, () => {
        if (!menuShown) {
          console.log("menu not being shown");
          clearTimeout(gooeyTimeout);
        }
        if (!menuVisited) {
          // commenting this out.  it seems to hide the menu when the user first hovers.
          //hideadditionalbuttons();
        }
      });

      async function showadditionalbuttons() {
          if (!GOOEY_CAN_BE_SHOWN){
              //console.log('sorry additional buttons cannot be show so soon after click of C')
              hideadditionalbuttons()
              return
            }
        //console.log("showing additional buttons");

        menuShown = true;
        $(".icon-menu").css({
          "visibility": "visible",
          "opacity": 1,
          "transition-timing-function": "cubic-bezier(0.165, 0.84, 0.44, 1)",
        });

        $(".menu-item").css({
          "visibility": "visible",
          "opacity": 1,
          "transition-timing-function": "cubic-bezier(0.165, 0.84, 0.44, 1)",
        });

        $(".menu-item:nth-child(1)").css({
          "transition-duration": "380ms",
          "transform": "translate3d(80px, 0, 0)"
        });

        $(".menu-item:nth-child(2)").css({
          "transition-duration": "520ms",
          "transform": "translate3d(100px, 0, 0)",
          "margin-left": "-5px",
        });

        // $(".menu-item").css({ "visibility": "visible", "opacity": 1 });
      }

      function hideadditionalbuttons() {

        console.log("hidding additional buttons");

        $(".menu-item:nth-child(1)").css({
          "transition-duration": "380ms",
          "transform": "translate3d(0px, 0, 0)"
        });

        $(".menu-item:nth-child(2)").css({
          "transition-duration": "480ms",
          "transform": "translate3d(-13px, 0, 0)",
        });
        // $(".menu-item").css({ "visibility": "hidden", "opacity": 0 });
        // $(".icon-menu").css({ "visibility": "hidden", "opacity": 0 });
      }

      //======================================================================
      window['$']('#gear-icon-event-id').click(function (event) {
        event.preventDefault();
        openReadingListIframe();
      })
      // gooey end
      buttonAnimnation(window.location.href)
      if (isCurationClickedFromPopUp) {
        window['$']('#curate_button_id').click();
      }
    }
  })
}

function createToolTip() {
    return `<div id="c_popup_tooltip" style="${vertical.popup}">
                      <div style="line-height: 1.4rem;font-size: 13.5px;font-weight: 600; font-family: mulish, arial, san-serif, system-ui;">
                        A button from <strong>theconversation.social</strong> will always appear here on news articles.<br><br> <b>Try clicking it!</b>
                      </div>

                      <div style="${vertical.container}" id="c_tooltip">
                        <div style="${vertical.arrow}"></div>
                        <div style="${vertical.arrowDown}"></div>
                      </div>
            </div>`
}


function addFriendsReads (od) {
  let fr = document.querySelector("#fr_button_hover")
  if(!fr){
    const elFriendsReads = document.createElement('div')
    const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFMElEQVR4Xu1bXWhcRRT+zpls0k1Nk8ZYf2orQVtqjDFlk5vdBNoq/gWKSkVBBPGxPvgcEESx9KWvPtTXgg9CoaJUUkTLUom7m2ugpH9BK1UTtaU1tVZbde/MkQkbXJPd7N11b5rSGchT5syc77tnzpk5ew7hFh90i+OHI6Cnp2f1qlWrnrCWQEQiIgEz/6G1/pWZLwVBcGFiYiJ/M1pKV1dXY0tLyzpjTIdSqs0YsxpAbB6L1vpTSqVSDxhjvlkCoAC4AOAcgLMAzhDRSa31cd/3p1cCMf39/RuUUluNMd1E9CAAi6mTmdfZ71pORyLqDEPAUhjPA8gBSAM4msvlJpeDEM/zHgHwmIjsAJAsAK1663oQsHDTaRE5TEQHc7mcJcVaTz0G9/f3P8rMLxhjdjLz+nosGgUBxXrNiMgBInovl8vN1KJwIpHY2NDQsNsY80q9QBfrETUBc3sZYzQzH2LmPZlM5kQYIqyJi8ibAJ5jZhVGppY5SxLAzDuCILjGzPcQ0X0icj+ALQC6ANxbw4Y2whxk5pFsNvtdKXnP8zqJaB+A55dyXkvsbZ3yaWPMlFLqWwDfG2N+EpFWZv5soVwlAjZlMhnr9ReNRCLR0djY2GeMGQSw3ToiAI1hSDHGXFdK7c3n8/vmw2sikYjFYrERrfUbzBwPsw6AvwFkrQMWkS8BfDU+Pv5LKdlUKrXFGHOmbgQsXGhoaKgln88/TkS7ADwDYE0lECJio8dLdh4RfQDAqyQD4AqAjwAcisfjn6fT6d9DyCByAoqVSKVScRHZJSKvARiqoKAFZEdrhXlfiMj+5ubmD9Pp9J9hQC/QKVoLKKdQMpkcEJG3AAxXq3TBMg5rrd/xfd+vRX5eZlktoJSiyWTSXljeFZHuMEC01pNE9Lrv+8fCzK8054YTYBUsOLq3tdYj5UJbIWTujcfje9LpdFAJWNj/rwgC5pX1PO+pgtNrKwZgjLmslHoxm80uCldhgZabt6IIsEp6nvc+Eb1crDARHchms6/+X7Cl5B0BUd8Dqv1qzgLcEXA+wDlBFwVcGHT3AHcRcjfBIgbcVdi9BdxjyL0G3XPY5QNcQsRlhKpNroSZ71JiLiUW8W+DYcyweI7LCbqcoMsJupygywm6nKDLCbqcoMsJupzgvwy4pOhKS4oCmLB1eUR0TUSuEtEVEbksIhdt+TwR/Qxgpr29/YfR0dG/qnkP1OstMDw83DQ7O7tRRDYw890A7hSRDiJaa6tDiahFRJpFZC0RbV2oY71qhcWWozLz1yIyRUSnRGQyFosdHxsbu1qKmGoJGBgYWGOM6SWiHmZ+SGttS3Y3F0DX3PVSLwLKfXwDYMqWsRLRMWY+mslkfgxTI2QbIIjIlsdvC4JgUCllAdcMtJyCURNQat9TRPSJiNja4m0LqsTSzOxrrXcqpWzXR+TjRhAQOahqNpgjoLe3t62pqWn3vKCIMBHZGn3bXGQrt5tt8TMRtYnI7SJyB4C7iOi2ajaLeq4xxvqb80R0UUQuMbOtQ/4NwPXCX15ENBHZozk3giDYX/O5so5Ja207OjoBbBIRe067ReThCMmxkegEM5+0DldEzhLRuYaGhulyDrcS8TUTsMTC1NfXt1kp5RHRYBAE22s80za6nGTmYyIyppTyM5mMbYKoVx/SHIQoCFjETSqVWq+1fhrAswCeJKKmUgQWmimOAPhYa33E933blRbpWBYCihEkEonWWCw2aIz5Ty+QUso2bI7Vasq1srTsBNSqaFRyjoComL1Z1v0HWYG5aOVz/FIAAAAASUVORK5CYII=';
    const buttonStyles = 'font-size:14px!important; position:relative; top:60px; left:90px; background:#fff!important; outline:none; border:none; padding:5px 15px!important;border: none!important; border-radius: 15px 15px 0 0!important; box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.5)!important; transition: top 0.3s linear; cursor: pointer;';
    const imageStyles = 'margin-right:5px!important; display:inline!important; vertical-align:middle!important; width:18px!important; height:14px!important;';

    od.appendChild(elFriendsReads)
    
    elFriendsReads.outerHTML = "<div id='fr_button_hover' style='position:fixed!important;bottom:0;right:0;z-index:2147483645;width:250px!important;height:50px!important;'><button type='button' style='" + buttonStyles + "'><img width=18 height=14 src='"+ icon +"' style='"+ imageStyles +"'> Friends' Reads</button></div>"

    document.querySelector("#fr_button_hover").addEventListener("mouseover", function() {
      this.querySelector('button').style.top = '23px'
    })
    document.querySelector("#fr_button_hover").addEventListener("mouseout", function() {
      this.querySelector('button').style.top = '60px'
    })
    window['$']('#fr_button_hover button').click(openReadingListIframe);
  }
}
// function getInstancesFromPath (location, instance) {
//   return location.pathname.split('').filter(item => item === instance).length
// }

// function hasDigit (location) {
//   const firstPath = location.pathname.replace('/', '').split('/')[0]
//   return /^\d+$/.test(firstPath)
// }

// check if string has more than 2 hyphens
function checkHypen(t){
  return (t.match(/-/g) || []).length >= 2
}

// check if string has more than 2 underscores
function checkUnderscore(t){
  return (t.match(/_/g) || []).length >= 2
}

// check if string has number
function hasNumbers(t)
{
  var regex = /\d/g;
  return regex.test(t);
}

// main function for checking final string of a url after the final slash (or the second to last if no text after last)
function check_after_slash_on_url(str){
  if(str.includes("user") || str.includes("search") || str.includes("account")){
    return false
  } else {
    let last_index = str.lastIndexOf("/")
    if( last_index == -1){
      return false
    } else {
      let target_string = str.substring(last_index + 1)
	  if ((target_string == " " ) || !(target_string)){
	  target_string = str.split( '/' );
	  target_string = target_string[ target_string.length - 2 ]
	  }

      if(target_string.includes("index.html") || checkUnderscore(target_string) || checkHypen(target_string) || hasNumbers(target_string)){
        return true
      }
      return false
    }
  }
return false
}

function countHyphenCharacters (domainName) {
  const domainNameArray = domainName.split('').filter(item => item === '-')
  var count = domainNameArray.length
  return count
}

function countSlashCharacters (domainName) {
  const domainNameArray = domainName.split('').filter(item => item === '/')
  var count = domainNameArray.length
  return count
}

function addExtensionNotificationContainer() {
  const elNotification = document.createElement('div');
  elNotification.id = 'extensionNotifications';
  elNotification.style.right = 0;
  elNotification.style.width = '365px';
  elNotification.style.bottom = '70px';
  elNotification.style.setProperty('margin-right', '10px');
  document.body.appendChild(elNotification);
}

function initCurationDomain (isCurationClickedFromPopUp) {
      //console.log('initCurationDomain called')
      if (window.location.href.slice(0,40).indexOf('twitter.com') !== -1) {
        addExtensionNotificationContainer();
        clearInterval(loadTimer)
        return true
      }
      if (window.location.href.indexOf('theconversation.social') > -1) {
        clearInterval(loadTimer)
        return true
      }
  try {
    chrome.storage.local.get({'domainlist': [], 'autorun': false}, storageObj => {


      domainlist = storageObj.domainlist || []
      domainlist = domainlist.map(item => item.trim()).filter(item => item)

      // domainlist = domainlist;
      // localStorage.setItem("localStorageKey", JSON.stringify(domainlist));
      let inited = false
      // Rules below for domain matching logic:
      // - Removes http:// and https://
      // - Adds . period in front of url
      // - Adds . period in front of domain from domain list
      // - Removes / trailing url domain to get rid of domains-matching in non-domain section.
      let containsSupportedDomain = domainlist.some(domain => {
        let origin = window.location.origin;
        strippedProtocol = '.' + origin.substr(window.location.protocol.length + 2); // Strips the protocol then adds a dot infront
        return strippedProtocol.indexOf('.' + domain) > -1;
      });
	  if (isCurationClickedFromPopUp) {
		  domLoaded(storageObj.autorun)
	  }
      if(containsSupportedDomain) {
          inited = true
          if (window.location.href.indexOf('index.html') > -1) {
            domLoaded(storageObj.autorun)
          } else if (countSlashCharacters(window.location.href) >= 4 || countHyphenCharacters(window.location.href) >= 8) {
            // for nbcnews.com, cbsnews.com, msnbc.com, for foxnews.com
            let result_of_url_check = (storageObj.autorun && check_after_slash_on_url(window.location.href))
            return domLoaded(result_of_url_check)
          } 
          else if (window.location.href.indexOf('/news/') > -1 && countSlashCharacters(window.location.href) >= 3 && countHyphenCharacters (window.location.href) >= 8) {
            // for comicbook.com
            let result_of_url_check = (storageObj.autorun && check_after_slash_on_url(window.location.href))
            return domLoaded(result_of_url_check)
          } 
          // else if (window.location.href.indexOf('comicbook.com') == -1 && window.location.href.indexOf('/news/') > -1 && countSlashCharacters(window.location.href) >= 3 && countHyphenCharacters (window.location.href) >= 8) {
          //   // for comicbook.com - comment this in and the above rule out if needing domain specific
          //   let result_of_url_check = (storageObj.autorun && check_after_slash_on_url(window.location.href))
          //   return domLoaded(result_of_url_check)
          //   }
          else if (window.location.href.indexOf('.html') > -1) {
            // for nytimes.com, washingtonpost.com, latimes.com
            domLoaded(storageObj.autorun)
          } else if (window.location.href.indexOf('/story/') > -1 || window.location.href.indexOf('/article/') > -1) {
            // for usatoday.com
            domLoaded(storageObj.autorun)
          } else if (window.location.href.indexOf('/2018/') > -1 || window.location.href.indexOf('/2019/') > -1 || window.location.href.indexOf('/2020/') > -1 || window.location.href.indexOf('/2021/') > -1 || window.location.href.indexOf('/2022/') > -1 || window.location.href.indexOf('/2023/') > -1) {
            domLoaded(storageObj.autorun)
          }
        } else{
          clearInterval(loadTimer)
        }
      }
      //"comment back in if you want C icon to always appear on non domain pages without autocuration even if it doesn't pass our domainslist rules"
      /* if (!inited) {
        domLoaded(false)
      } */
    )
  } catch (e) {
    if (e.message === 'Extension context invalidated.') {
      clearInterval(loadTimer)
    }
  }
  clearInterval(loadTimer)
}

// function hasArticleTags () {
//   let hasTag = document.querySelector('meta[content="article"][property="og:type"]') ||
//               document.querySelector('meta[itemprop="headline"]') ||
//               document.querySelector('link[rel="amphtml"]') ||
//               document.querySelector('[itemtype="http://schema.org/NewsArticle"]')

//   return hasTag || [...document.querySelectorAll('[type="application/ld+json"]')].find(elem => {
//     return elem && ((elem.innerHTML || '').indexOf('NewsArticle') >= 0)
//   })
// }

function showHideCuration (newValue) {
  const overlay = document.querySelector('#overlay_Div1')
  if (!newValue) {
    if (overlay) {
      window['$'](overlay).show()
    } else {
      // initCurationDomain()
    }
  } else {
    window['$'](overlay).hide()
  }
}

function domLoaded (autorun) {
  clearInterval(loadTimer)
  const loadedDom = function () {
    if (document.body) {
      TimeLoading.DOM = Date.now()
      addCuration(autorun)
    } else {
      setTimeout(loadedDom, 100)
    }
  }
  loadedDom()
}

function createVideoIframeContainer(id) {
  const IFRAME_WIDTH = `95%`;
  const IFRAME_HEIGHT = `95%`;
  const IFRAME_ANIMATION_TIME_S = `0.8`;

  const container = document.createElement(`div`);
  container.id = id;
  container.style.cssText = important(`
    position: fixed;
    display: block;
    left: calc(50% - 20px);
    top: 50%;
    width: ${IFRAME_WIDTH};
    height: ${IFRAME_HEIGHT};
    z-index: 2147483647;
    transform: scale(0) translate(-50%, -50%);
    transform-origin: 0 0;
    transition: all ${IFRAME_ANIMATION_TIME_S}s ease;
    background: white;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
  `);

  return container;
}

function createLoader(){
  const loaderimage = `${EXT_URL + '/spinner_200.svg'}`

    return `
            <div style="text-align: center; width: 100%;margin-top: 250px; margin-left: 18px;" class="loading-fetching-content">
                <img src="${loaderimage}" style="width: 92px;height: 92px;margin: 20px auto;filter: grayscale(.75);">
            </div>
    `;
}

function createCloseButton() {
  const closeButton = document.createElement(`button`);
  closeButton.id = "close_video_link_button";
  const line1 = document.createElement(`div`);

  line1.style.cssText = important(`
    width: 40px;
    height: 2px;
    background: #000000;
    transform: translate(-50%, -50%) rotate(45deg);
    position: absolute;
    top: 50%;
    left: 50%;
  `);

  const line2 = line1.cloneNode(true);

  line2.style.setProperty(`transform`, `translate(-50%, -50%) rotate(-45deg)`, `important`);

  closeButton.style.cssText = important(`
    width: 60px;
    height: 60px;
    position: absolute;
    top: -2px;
    right: -25px;
    background: white;
    border: none;
    outline: none;
    padding: 0;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    border-radius: 50%;
  `);

  closeButton.append(line1, line2);
  return closeButton;
}

function showVideoIframe(data) {
  const iframeContainerId = `theconversation__video-iframe-container`;

  if (document.querySelector(`#${iframeContainerId}`)) {
    return;
  }

  const video_link = `https://theconversation.social/v/${data.link_id}`;
  const container = createVideoIframeContainer(iframeContainerId);
  const closeButton = createCloseButton();
  const iframe = document.createElement(`iframe`);

  iframe.src = video_link;
 
    $(iframe).load(function(){
        $(this).siblings(".loading-fetching-content").remove();
    });

  iframe.style.cssText = important(`
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  `);

  closeButton.addEventListener(`click`, () => {
    container.remove();
  });

  $(container).html(createLoader());
  container.append(iframe, closeButton);
  document.body.appendChild(container);
  container.clientWidth = container.offsetWidth;
  container.style.setProperty(`transform`, `scale(1) translate(-50%, -50%)`, `important`);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'DOM_URL_CHANGED_EVENT') {
    console.log('DOM_URL_CHANGED_EVENT', request.url); // new url is now in content scripts!

    if (request.url && request.url.endsWith('twitter.com/home')) {
      setTimeout(() => twitterShowLeftPanel(), 10);
    }

    var container = document.querySelector('#overlay_Div1');

    if (container) {
      container.remove();

      resetLoadParams();
    }
    setTimeout(() => initCurationDomain(), 10);
  }
  
  if (request.message == 'GET_METADATA') {
    page_metadata = {'title': false, 'description': false, 'pretty_url': false, 'date': false}
    var title = getMetaTag(['meta[property="og:title"]', 'meta[name="title"]', 'title', 'h1'])
    if (title) {
        var description = getMetaTag(['meta[property="og:description"]', 'meta[name="description"]', 'h1', 'title', 'meta[property="og:title"]'])
        var date = getMetaTag(['meta[name="date"]', 'meta[name="displaydate"]', 'meta[name="pdate"]', 'meta[name="embedded_data_date"]'])
        if (!date)
            date = document.querySelector('time[itemprop="datePublished"]')
            if (date)
              date = date.dateTime

        // now get content - if not null
        var title_content = encodeURI(title.content)
        var description_content = null
        var date_content = null
        if (description)
            description_content = encodeURI(description.content)
        if (date)
            date_content = encodeURI(date)
        var pretty_url = getMetaTag(['link[rel="canonical"]', 'meta[property="og:url"']) // <!> syndication_url missed
        var pretty_url_content = null
        try {
            if (pretty_url)
                try {
                    pretty_url_content = encodeURI(pretty_url.href)
                } catch (err) {
                    pretty_url_content = encodeURI(pretty_url.content)
                }
        } catch (err) {}

        page_metadata.title = title_content
        page_metadata.description = description_content
        page_metadata.date = date_content
        page_metadata.pretty_url = pretty_url_content
    }
    sendResponse({page_metadata});
  }

  if (request.message == 'ADD_CURATION') {
    isCurationClickedFromPopUp = true;
    initCurationDomain(true);
  }

  if (request.message === `CLICK_VIDEO_LINK`) {
    showVideoIframe(request.data);
  }

  if (request.message === `CLICK_CLOSE_VIDEO_LINK`) {
    closeVideoIframe();
  }
  
  if (request.message === `SHOW_TWITTER_TIMER`){
	//console.log("POST MESSAGE: " + request.message);
	showTwitterTimer(request.data);
  }

});


function getMetaTag(preff) {
    for (const item of preff) {
        i = document.querySelector(item)
        if (!i)
            continue
        return i
    }

    return null
}

function important(stylesStr) {
  return stylesStr.replaceAll(`;`, ` !important;`);
}

function checkForTweetReaction(){
  //if window.location.href
  var urlParams1 = new URLSearchParams(window.location.search);
  //console.log(urlParams1.get('tw_id')); // ["edit"]
  let reading_list_reaction_tweet_id = urlParams1.get('tw_id')
  if (reading_list_reaction_tweet_id){
  chrome.storage.local.get({ reading_list }, function (result) {
	  
    for (index = 0; index < result.reading_list.length; index++) {
      //console.log(result.reading_list[index].id);
      if (result.reading_list[index].id == reading_list_reaction_tweet_id){
        //if (result.reading_list[index].reaction_text){
          showFriendReactionAlert(result.reading_list[index])
          break
        //}
	  }  
	}  

  });
  //urlParams2.getAll({'tw_ids'}, function (result) {
  //console.log(result)
//}
}
}


function closeVideoIframe()
{
    // we use this function to close the video iframe for our simulation demo tutorial tour
    let closeButton = $('#close_video_link_button');
    closeButton.click();
}

function showTwitterTimer(timeout)
{
    // we use this function to close the video iframe for our simulation demo tutorial tour
    
    let timer = document.createElement("p");
    
    timer.id = "twitter_timer";
    timer.style.cssText = important(`
        position: fixed;
        top: 0%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        padding: 2px 5px 2px 5px;
        text-align: center;
        font-size: 20px; 
        font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background-color: rgb(235, 238, 240);
        color: rgb(15, 20, 25);
    `);
    
    timer.innerHTML = "Closing this page in: " + (timeout - 1); 
    
    document.body.appendChild(timer);
    
    let deadline = new Date();
    
    deadline.setSeconds(deadline.getSeconds() + timeout);
    deadline = deadline.getTime();
    
    let x = setInterval(function() { 
        let now = new Date().getTime(); 
        let t = deadline - now; 
        let seconds = Math.floor((t % (1000 * 60)) / 1000); 
        
        timer.innerHTML = "Closing this page in: " + seconds; 
        
        if (t < 0) { 
            clearInterval(x); 
            timer.innerHTML = "Returning you back..."; 
        } 
    }, 1000);
}

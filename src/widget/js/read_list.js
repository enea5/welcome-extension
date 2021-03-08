// const { domain } = require("process");

//chrome.storage.local.get({showontwitter: true},
var reading_list = [];
var tweets = [];

/* function getReadingList () {
  chrome.storage.local.get({reading_list: []}, function (result) {
  console.log(result.reading_list)
  tweets = result.reading_list }); //{console.log(result.reading_list) });
  console.log('Evan 0')
  console.log(tweets)
} */
/*
function getReadingList () {
chrome.storage.local.get({reading_list: []}, function (result) {
console.log(result.reading_list)
tweets = result.reading_list
console.log('Evan 0')
console.log(tweets)
});
}
 */

/* var tweets = [];

function getReadingList() {
  return new Promise((resolve, reject) => {
    setTimeout(() => { //imitation of chrome.storage.local.get method

      tweets = ['tweet1', 'tweet2', 'tweet3'];
      resolve();
    }, 1000);
  });
}





getReadingList().then(result =>{
  console.log(1, tweets)//it works
});
console.log(2, tweets)//does not work

 */

//chrome.storage.local.get(['domainlist'], function (result) { console.log(result.someData) });

//result = {}
//result.reading_list = [[48303],[944889]]var

/*
        html = ''''<div class="divTable">
                <div class="divTableBody">"""
        var i;
        for (i = 0; i < result.domainlist.length; i++) {
         html += "<div>" + request.reading_list[i] + "</div>";
        }

     */

/* <div class="divTableRow">
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
</div>
<div class="divTableRow">
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
</div>
<div class="divTableRow">
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
</div>
<div class="divTableRow">
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
</div>
</div>
</div>
 */


function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

function GenerateTable(from_refresh=false) {

  // Cut domain
  function getPath(str) {
    return str.substring(Array.from(str.matchAll('/'))[1].index, Array.from(str.matchAll('/'))[2].index);
  }



  var tweets_reformatted = [];
  // var urlParams = new URLSearchParams(window.location.search);
  // console.log(urlParams.getAll('ids')); // ["edit"]
  // var tweets = urlParams.getAll('ids')
  // urlParams.getAll({'ids'}, function (result) {
  chrome.storage.local.get({ reading_list }, function (result) {
    //var tweets = result.reading_lists.slice(0, 15);
    if (!(from_refresh) && (result.reading_list.length == 0)){
      refresh()
	}    
    tweets = result.reading_list;
    let array_v = [];

    for (index = 0; index < tweets.length; index++) {
      var row = document.createElement("div");
      //$(row).attr('class', 'row');
      row.setAttribute("class", "wrap-card");
      var thumbImage = tweets[index].image[0].url;
      let domain = getPath(tweets[index].url)
      console.log(tweets[index].url);

      if(!thumbImage){
        let domain = getPath(tweets[index].url)
        thumbImage = `https://logo.clearbit.com/${domain}?size=500`
        if(tweets[index].image[0].length>0)
        thumbImage = tweets[index].image[0][0].url
      }

      var avatar = "avatar.png";
      if (tweets[index].shared_by.avatar !== undefined) {
        avatar = tweets[index].shared_by.avatar;
      }

      var verSpan = ""
      if(tweets[index].shared_by.verified){
        verSpan = `<span style="width: 15px;
  height: 15px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAMAAADX9CSSAAAA51BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2/f/////2/f////////8atOMdyv830P840f9p2/9q3P9/4f+A4f+U5v/T9P/U9f/o+v/p+v/q+v/w+//w/P/3/f////+BUAdbAAAAO3RSTlMAAAIGBwgKCw8RFxwdIiQqMDM1ODxEjZSan6yztrm7vcDFx8rM0NHS6Ors7e7y8/X29/j5+vv8/P39/kFIJSEAAAD1SURBVHgBZdHZWsIwEAXgicpSxX1X3BV3wYKUlulYKKKmef/nMRlSvxDm6nz/5CZzoJyNVqzi1iZnIUTJ2+1phtn0Zcfx+lk3iSdoZpKo3kVt5sGbHCGl7EQ4lk8N9iuJ8/PbNF6JMs8/w2Xtuwr9UXXt+4ueVAUEN31yXppH1L+twVGRujxbFIfwns/zcKhD3gFlxWET2VlKtt7J7cLl/BWOC+KFy1QcwMr9gLPDOLiuAKzafzHbuGbu07X3+eest6Qdzv17ylNhvPEgx0jElBKO5KPtq9oMy76+oqR9Ejj97j1/635/wnWvd9i6i9THZQDW/wDAZ2BeZQ3UAQAAAABJRU5ErkJggg==);
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: middle;
"></span>`
      }
      let url_story
      if (!tweets[index].url.includes('?')){
        url_story = tweets[index].url+'?tw_id='+tweets[index].id
      } else {
        url_story = tweets[index].url+'&tw_id='+tweets[index].id
	  }
      var firstStory = `

                        <div class="firstStory" style="margin-bottom:50px;  padding: 14px; border-radius: 10px">

                        <img class="firstStory__twitter-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGUSURBVDiNpZO/a1RBFIW/O2/WhbxEAyJaGcGAiI2FIGhhCsFfhdXukiJVxNJOCzux00YL/4AtJOpCiCI2C6aOhGAhiIpgYxuE5D13N/PesdgX2Q1vddEDA8PlfmfOHWZMEv8jP06TtZIjEXZNopJrp63Gga8A9nRzv/FGVb+VPAgW31aN3l640tq+INkKMF2UukhNnB3P0LzzW9vnBLcipW9tKTm810C5NQdggCpmNxEWya66IH0vWs9HEev+eXrDWp2jAPascwxjZsRk30I9bpok/IukDVwcmhs+CTaA+fKLseuhNvHK72slp4EKoD5X5IET9FepMtx7gCJB+gU0O6q5RJuhHh8EcP24+aLB5/F5W93dOYAwNbkmrA10x6B7mbK7Qwa6QlfkH4HqX8+GR2pM/U7rdjdZffKJMzuD8foP9Hqw9P5gyQPYyo9p34tOCVsAu1zKisfB4juqxUOv1SpL6dnc5feASyXcT7ANxMPQmHhZblz8RlvuzPgsO5mjWcP1HHq3cyj+oDnCyJEGDf5VvwCmpZgonjpXdwAAAABJRU5ErkJggg==">
                          <a href="${url_story}" target="_blank" style="width: 100%;color:#000;text-decoration: none;">
                            <div class="col-sm-12">
                              <div class="row">
                                <div class="col-xs-2" style="padding-left: 0">
                                  <img src="${avatar}" style="width:50px;height:50px;border-radius: 50%;">
                                </div>
                                <div class="col-xs-10" style="margin-left: -10px" >
                                  <h5 style="padding-bottom: 0;margin-bottom: 0;text-align: left;">
                                    <strong>${tweets[index].shared_by.full_name} </strong>
                                    ${verSpan}
                                    <span style="opacity:0.5;font-size:0.8em"> @${tweets[index].shared_by.screen_name}</span>
                                  </h5>
                                  <p style="padding-top: 0;text-align: left;opacity: 0.5">Shared this story${tweets[index].shared_by.time_ago} ago</p>
                                </div>
                              </div>
                            </div>

                            <div class="firstStory__wrap-img" style="background-image: url('${thumbImage}');background-position: center;background-size: cover;background-repeat: no-repeat;">
                            </div>

                            <div class="firstStory__text row">
                                <h4>${tweets[index].title}</h4>
                                <p class="firstStory__descriptionShort">${tweets[index].description.substring(0, 175)}...</p>
                            </div>
                          </a>
                        </div>
                      `;

      $(row).append(firstStory);

      // if (tweets[index + 1].image[0].url === undefined) {
      //     thumbImage = tweets[index + 1].image[0][0].url
      // } else if (tweets[index + 1].image[0].length > 0) {
      //     thumbImage = tweets[index + 1].image[0].url
      // }

      // var avatar = 'avatar.png'
      // if (tweets[index + 1].shared_by.avatar !== undefined) {
      //     avatar = tweets[index + 1].shared_by.avatar
      // }

      // var secondStory = `
      //           <div class="col-sm-4">
      //             <a href="${tweets[index].url}" target="_blank" style="color:#000;text-decoration: none;">
      //               <div class="row">
      //                   <div class="col-sm-2" style="padding-left: 0">
      //                       <img src="${avatar}" style="width:50px;height:50px;border-radius: 50%;">
      //                   </div>
      //                   <div class="col-sm-10" style="margin-left: -10px">
      //                       <h5 style="padding-bottom: 0;margin-bottom: 0;text-align: left;">
      //                         <strong>${tweets[index ].shared_by.full_name}</strong>
      //                       </h5>
      //                       <p style="padding-top: 0;text-align: left;opacity: 0.5; font-size: 12px; padding-bottom: 5px;">Shared this story</p>
      //                   </div>
      //               </div>
      //               <br>
      //               <div class="row" >
      //                   <img src="${thumbImage}" style="width: 370px;height: 250px;border-radius: 5px">
      //               </div>
      //               <br>
      //               <div class="row">
      //                   <h4>${tweets[index ].title}</h4>
      //                   <p>${tweets[index ].description}</p>
      //               </div>
      //             </a>
      //           </div> `

      // $(row).append(secondStory)
      $("#app").append(row);
      // let html_to_add = `<blockquote class= "twitter-tweet" width=550><a href="` + `https://twitter.com/i/status/` + tweets[index].toString()
      // html_to_add = html_to_add + `"></a></blockquote><br><br>`
      // //html_to_add = html_to_add + `<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`
      // array_v.push(html_to_add);
      // tweets_reformatted.push(array_v)
    }

    //Create a HTML Table element.
    // var table = document.createElement("TABLE");
    // table.border = "0";
    // table.width = "550"

    // //Get the count of columns.
    // var columnCount = tweets_reformatted[0].length;

    // //Add the header row.
    // var row = table.insertRow(-1);
    // for (var i = 0; i < columnCount; i++) {
    //     var headerCell = document.createElement("TH");
    //     headerCell.innerHTML = tweets_reformatted[0][i];
    //     row.appendChild(headerCell);
    // }

    // //Add the data rows.
    // for (var i = 1; i < tweets_reformatted.length; i++) {
    //     row = table.insertRow(-1);
    //     for (var j = 0; j < columnCount; j++) {
    //         var cell = row.insertCell(-1);
    //         cell.innerHTML = tweets_reformatted[i][j];
    //     }
    // }

    // var dvTable = document.getElementById("dvTable");
    // if (dvTable) {
    //     dvTable.innerHTML = "";
    //     //dvTable.innerHTML =  `<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
    //     dvTable.appendChild(table);
    // }
    // var z = document.createElement('p'); // is a node
    // z.innerHTML = `<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
    // document.body.appendChild(z);
  });
}


document.addEventListener("DOMContentLoaded", function () {
  //GenerateTable()
  setTimeout(GenerateTable, 20);
});


document.getElementById("refresh").addEventListener("click", refresh);

async function refresh() {
    const ReadingListUpdateUrl =
      "https://theconversation.social/update_reading_list_metadata/?send_back_new_list=true";
    const ReadingListUpdate = await fetch(ReadingListUpdateUrl);
    const ReadingListUpdateResult = await ReadingListUpdate.json();


  if (ReadingListUpdateResult) {
    chrome.storage.local.set({ reading_list: ReadingListUpdateResult });
    $("#app").html("");
    GenerateTable(from_refresh=true);
  }
}

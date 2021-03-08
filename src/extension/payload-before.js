////////////////////////////// Methods for iframe  ////////////////////////////////////////////////////////
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.message === 'DOM_URL_CHANGED_EVENT') {
    if( window.location.href.includes('twitter.com/') ){
      if( window.location.href.match('/timelines/[(0-9)]') ){
         addCustomStylingForCollectionFix();
         console.log( 'In addCustomStylingForCollectionFix ')
      }else{
         jQuery('#style-addCustomStylingForCollectionFix').remove()
         jQuery('.gl-share-button-div').remove()
         $(window).off("scroll")
      }
    }	 
  }
});

if (window.location.href.match('/timelines/[(0-9)]')) {
  addCustomStylingForCollectionFix();
}
function addCustomStylingForCollectionFix() {
    var collection_style = document.createElement('style');
    collection_style.id = "style-addCustomStylingForCollectionFix";
    collection_style.innerHTML = `
    .social-share-btn{
          width:100%;
          display:inline-block;
          text-align:center;
          font-size: 18px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          text-decoration: none;
          margin-top: 25px;
          color: #1da1f2;

        }
        .css-901oao.r-1re7ezh.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-qvutc0{
          padding-top:2px;
        }
        main section div h1.css-4rbku5.css-901oao{
          color:#fff !important;
          height:1px !important;
        }
        main .css-1dbjc4n.r-1habvwh h2{
          display:none;
        }
        main .css-1dbjc4n section .css-1dbjc4n.r-k8qxaj.r-utggzx.r-m611by{
            opacity:0;
        } 
        main .css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu section.css-1dbjc4n::after{
            content: "";
            width:100%;
            height:100%;
            left:0;
            top:0;
            background:#fff;
            opacity:1;
            position:absolute;
        }
        main .css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu section.css-1dbjc4n.ts-loaded::after{
            opacity:1;
            width:0px;
            height:0px;
            display:none;
            position:relative;
        }
        .r-k8qxaj{
          padding-bottom:10px;
        }
    `;


    document.head.appendChild(collection_style);
}


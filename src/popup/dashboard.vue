<template>
  <div v-if="fullLoading">
    <svg
      class="lds-coolors"
      width="200px"
      height="200px"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      style="shape-rendering: auto; animation-play-state: running; animation-delay: 0s; background: none;"
    ><defs style="animation-play-state: running; animation-delay: 0s;"> <mask
      id="coolors-25658c1971f01"
      style="animation-play-state: running; animation-delay: 0s;"
    > <circle
      cx="50"
      cy="50"
      r="20"
      stroke="#fff"
      stroke-linecap="round"
      stroke-dasharray="94.24777960769379 31.41592653589793"
      stroke-width="9"
      style="animation-play-state: running; animation-delay: 0s;"
      transform="rotate(33.8955 50 50)"
    > <animateTransform
      attributeName="transform"
      type="rotate"
      values="0 50 50;360 50 50"
      times="0;1"
      dur="0.7s"
      repeatCount="indefinite"
      style="animation-play-state: running; animation-delay: 0s;"
    /> </circle> </mask> </defs> <g
      mask="url(#coolors-25658c1971f01)"
      style="animation-play-state: running; animation-delay: 0s;"
    ><rect
      x="20.5"
      y="0"
      width="20.333333333333332"
      height="100"
      style="animation-play-state: running; animation-delay: 0s;"
    > <animate
      attributeName="fill"
      values="#a4d0ef;#211f1f;#d63116"
      times="0;0.5;1"
      dur="0.7s"
      repeatCount="indefinite"
      begin="-0.6666666666666666s"
      style="animation-play-state: running; animation-delay: 0s;"
    /> </rect><rect
      x="39.83333333333333"
      y="0"
      width="20.333333333333332"
      height="100"
      style="animation-play-state: running; animation-delay: 0s;"
    > <animate
      attributeName="fill"
      values="#a4d0ef;#211f1f;#d63116"
      times="0;0.5;1"
      dur="0.7s"
      repeatCount="indefinite"
      begin="-0.3333333333333333s"
      style="animation-play-state: running; animation-delay: 0s;"
    /> </rect><rect
      x="59.166666666666664"
      y="0"
      width="20.333333333333332"
      height="100"
      style="animation-play-state: running; animation-delay: 0s;"
    > <animate
      attributeName="fill"
      values="#a4d0ef;#211f1f;#d63116"
      times="0;0.5;1"
      dur="0.7s"
      repeatCount="indefinite"
      begin="0s"
      style="animation-play-state: running; animation-delay: 0s;"
    /> </rect></g></svg>
  </div>
  <div v-else>
    <el-row>
      <el-col :span="24">
        <div class="overlay">
          <el-row class="header-contents">
            <el-col
              :span="6"
              class="text--white"
            >
              <div class="top-right-assistant">
                <div>social</div>
                <div>assistant</div>
              </div>
            </el-col>
            <el-col
              :span="12"
              class="text--center"
            >
              <el-tooltip
                content="Click to Curate on this page"
                placement="bottom"
              >
                <div class="cursor-pointer">
                  <img
                    src="../../static/images/logo-out.png"
                    class="logo-out"
                  >
                  <img
                    src="../../static/images/logo-inner.png"
                    class="logo-inner"
                    @click="curateButtonClicked"
                  >
                </div>
              </el-tooltip>
              <h2 class="text--white hello-text">
                Hello, {{ displayName() }}
              </h2>
              <h5
                class="text--white logged-in-as"
              >
                Logged in as {{ userName().toLowerCase() }}
              </h5>
            </el-col>
            <el-col :span="6">
              <img
                src="../../static/images/logout.png"
                class="logout-icon"
              >
              <div class="logout-text">
                <div @click="logout">
                  Logout
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="svg" />
        </div>
      </el-col>
    </el-row>

    <!-- Navigation -->
    <el-row class="nav-row">
      <el-col
        :span="12"
        class="text--center"
      >
        <a
          href=""
          class="curate-text"
          @click="curateButtonClicked"
        >Curate on this Page</a>
      </el-col>
      <el-col
        :span="5"
        class="text--left"
      >
        <a
          class="tutorials-text"
          href=""
          @click="goToCarousel"
        >Tutorials</a>
      </el-col>
      <el-col
        :span="6"
        class="text--center"
      >
        <a
          class="account-text"
          href=""
          @click="goToAccount"
        >My account</a>
      </el-col>
    </el-row>
    <!-- / Navigation -->

    <!-- Options -->
    <el-row class="options-row">
      <el-col :span="24">
        <div class="options-text">
          Options
        </div>
      </el-col>
      <el-col :span="24">
        <div class="css-checkbox-group">
          <input class="el-checkbox__input" type="checkbox" id="autorun" v-model="autorun" @click="saveOptions" />
          <label for="autorun" class="checkmark"></label>
          <el-tooltip
            content="Submits the query on your behalf for faster access. These queries count within your quota."
            placement="top"
          >
            <label for="autorun" class="el-checkbox__label">Automatically curate on news articles</label>
          </el-tooltip>
        </div>
        <div class="css-checkbox-group">
          <input class="el-checkbox__input" type="checkbox" id="defaulttWitTooltip" v-model="defaulttWitTooltip" @click="saveOptions" />
          <label for="defaulttWitTooltip" class="checkmark"></label>
          <el-tooltip
            content="Turning this on will show rich social bios accessible from the right corner of each Tweet on notable accounts. Available for select premium plans."
            placement="top"
          >
            <label for="defaulttWitTooltip" class="el-checkbox__label">Turn off enhanced bios on Twitter.com</label>
          </el-tooltip>
        </div>
        <div class="css-checkbox-group">
          <input class="el-checkbox__input" type="checkbox" id="official" v-model="official" @click="saveOptions" />
          <label for="official" class="checkmark"></label>
          <el-tooltip
            content="When on news pages, uses the native Twitter styling for tweets in the sidebar."
            placement="top"
          >
            <label for="official" class="el-checkbox__label">Switch news sidebar to twitter look</label>
          </el-tooltip>
        </div>
        <div class="css-checkbox-group">
          <input class="el-checkbox__input" type="checkbox" id="fullmode" v-model="fullmode" @click="saveOptions" />
          <label for="fullmode" class="checkmark"></label>
          <el-tooltip
            content="Focus only on the conversation by turning this setting off."
            placement="top"
          >
            <label for="fullmode" class="el-checkbox__label">Display images/video in news sidebar</label>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <!-- / Options -->

    <!-- Footer Upgrade -->
    <el-row class="footer-row">
      <el-col :span="24">
        <div class="button-position">
          <div class="pro-text">
            Want to be a pro?
          </div>
          <button class="upgrade-button" @click="goToUpgrade">
            UPGRADE
          </button>
        </div>
      </el-col>
    </el-row>
    <!-- / Footer Upgrade -->

    <!-- Footer -->
    <div class="footer-overlay">
      <div class="background-silk-svg" />
    </div>
    <!-- / - Footer -->
  </div>
</template>
<script>
  const background = chrome.extension.getBackgroundPage()
  export default {
    data: () => ({
      fullLoading: false,
      password: '',
      autorun: false,
      defaulttWitTooltip: false,
      official: false,
      fullmode: false,
      displayName: function () {
        console.log(background);
        return background.loggedInUser || ''
      },
      userName: () => background.userName,
      radioCheck: 3
    }),
    computed: { },
    created () { },
    mounted () {
      debugger
      // Load data from storage.
      chrome.runtime.onMessage.addListener(request => {
        if (request.method === 'updateLoginStatus') {
          window.location.hash = '#/'
        }
      })
      let self = this
      chrome.storage.local.get(['autorun', 'defaulttwittooltip', 'official', 'fullmode'], storageObject => {
        self.autorun = storageObject.autorun || false
        self.defaulttWitTooltip = storageObject.defaulttwittooltip || false
        self.official = storageObject.official || false
        self.fullmode = storageObject.fullmode || true
      })
      this.removeAutorunOption();
    },
    methods: {
      async checkForAutoload () {
        const autoLoadCheckUrl = 'https://theconversation.social/check_automated_available_for_ext_user/';
        const autoloadCheck = await fetch(autoLoadCheckUrl);
        const autoloadCheckResult = await autoloadCheck.json();

        return autoloadCheckResult.can_use_automated_option || false;
      },
      async removeAutorunOption () {
        const loadAutorun = await this.checkForAutoload();
        if (loadAutorun) {
          document.getElementById('autorun').classList.remove('hidden-default');
          document.querySelector('.css-checkbox-group label[for="autorun"]').parentElement.classList.remove('hidden-default');
          document.getElementById('autorun').addEventListener('change', saveOptions)
        }
      },
      goToUpgrade() {
        window.open('https://theconversation.social/registration/?extension=true', '_blank')
      },
      goToCarousel () {
        // window.location.hash = '#/Carousel'
        window.open('#/Carousel', '_blank')
      },
      goToAccount () {
        window.open('https://theconversation.social/manage/', '_blank')
      },
      logout () {
        this.fullLoading = true
        fetch(`http://${background['SERVER']}/logout/`)
          .then(r => r.text())
          .then(resp => {
            chrome.runtime.sendMessage({ method: 'refreshLoggedInStatus' }, _ => {
              console.log('LOGIN')
              window.location.hash = '#/login'
            })
          })
      },
      saveOptions () {
        setTimeout(_ => {
          const storageObject = {
            autorun: this.autorun,
            defaulttwittooltip: this.defaulttWitTooltip,
            official: this.official,
            fullmode: this.fullmode
          }
          chrome.storage.local.set(storageObject)
        }, 300)
      },
      curateButtonClicked () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            message: 'ADD_CURATION',
          });
        });
        window.close();
      },
    }
  }
</script>
<style lang="scss">
* {
  font-family: "Mulish";
}
.el-checkbox__label {
  cursor: pointer;
  font-family: Mulish;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 91.5%;
}
.el-checkbox__input.is-checked .el-checkbox__inner {
    border-color: #7BC6CC;
    background: #FFF;
}
.el-checkbox__input.is-checked+.el-checkbox__label {
    color: black;
}
.el-checkbox__inner:after {
  width: 11px;
  height: 11px;
  border-radius: 100%;
  background-color: #7BC6CC;
  content: "";
  position: absolute;
  left: 1px;
  top: 2px;
}
.el-checkbox__inner {
  border: 1px solid #dcdfe6;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  background-color: #fff;
  cursor: pointer;
  box-sizing: border-box;
}

.css-checkbox-group {
  display: block;
  position: relative;
  padding-left: 15px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 12px;
  line-height: 91.5%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.css-checkbox-group input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: -5px;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: white;
}

.css-checkbox-group:hover input ~ .checkmark {
  background-color: white;
}

.css-checkbox-group input:checked ~ .checkmark {
  background-color: white;
}

.css-checkbox-group:after {
  content: "";
  position: absolute;
  display: none;
}

.css-checkbox-group input:checked ~ .checkmark:after {
  display: block;
}

.css-checkbox-group .checkmark:after {
  left: 2px;
  top: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 5px solid #7bc6cc;
}

.css-checkbox-group .el-checkbox__label {
  color: #606266;
}
.css-checkbox-group input:checked ~ .el-checkbox__label {
  color: black;
}

.el-tooltip__popper.is-dark {
  font-weight: 700;
  line-height: 2em;
  max-width: 280px !important;
  margin-left: 10px;
  left: 0px !important;
}

#curate_button_id {
  margin-left: 17px !important;
  text-decoration: none !important;
  color: #fff !important;
  text-align: center !important;
  position: inherit !important;
  z-index: 9999999999999 !important;
  bottom: 30px !important;
  font-size: 17px !important;
  width: 180px !important;
  font-family: Poppins !important;
  height: 180px !important;
  border: solid 1px #555 !important;
  background-color: black !important;
  animation-duration: 0.5s !important;
  box-shadow: 10px -10px rgba(0,0,0,0.6) !important;
  -moz-box-shadow: 10px -10px rgba(0,0,0,0.6) !important;
  -webkit-box-shadow: 5px 5px 10px #D3D3D3 !important;
  -o-box-shadow: 10px -10px rgba(0,0,0,0.6) !important;
  border-radius: 100px !important;
  margin-top: 14px;
}
#curate_button_id > .first {
  margin-top: 42px !important;
  font-size: 24px !important;
  height: 28px !important;
  line-height: 30px !important;
  font-weight: 700;
}
#curate_button_id > .second {
  margin-top: 0px !important;
  font-size: 24px !important;
  height: 28px !important;
  line-height: 30px !important;
  font-weight: 700;
}
#curate_button_id > .third {
  word-wrap: break-word !important;
  margin-top: 0px !important;
  font-size: 19px !important;
  height: 14px !important;
  line-height: 14px !important;
  padding-top:8px;
}

</style>

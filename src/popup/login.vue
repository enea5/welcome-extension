<script>
import JQuery from 'jquery'
const background = chrome.extension.getBackgroundPage()
let $ = JQuery
export default {
  components: {
  },
  data: () => ({
    fullLoading: false,
    loading: false,
    username: '',
    password: '',
    showOnTwitter: false,
    showForAll: false,
    displayName: function () {
      return 'TEST'
    },
    server: '',
    serverAdmin: ''
  }),
  computed: { },
  created () { },
  mounted () {
    if (!background.loggedInUser) {
      this.server = background['SERVER']
      this.serverAdmin = `http://${background['SERVER']}/`
      fetch(`http://${background['SERVER']}/`, {
        credentials: 'include'
      })
        .then(r => r.text())
        .then(resp => {
          this.fullLoading = false
          this.loading = false
          const loggedInUser = $(resp).find(`.user-profile p`).text().trim()
          if (loggedInUser && loggedInUser !== 'Personalize') {
            background.loggedInUser = loggedInUser
            this.goToDashboard()
          } else {
            // Ignore
          }
        })
    } else {
      this.goToDashboard()
    }
  },
  methods: {
    goToDashboard () {
      window.location.hash = '#/dashboard'
    },
    twitterLogin () {
      chrome.tabs.create({ url: 'https://theconversation.social/login/twitter/?next=/twitter/after_authentication/?next=chrome_extension_livedemo_newsarticles/?from_extension=true' })
    },
    login () {
      console.log('check login status')
      this.loading = true
      fetch(`http://${background['SERVER']}/`, {
        credentials: 'include'
      })
        .then(r => r.text())
        .then(resp => {
          var csrfHidden = $(resp).find(`input[name='csrfmiddlewaretoken']`)[0]
          if (csrfHidden) {
            console.log('do login')
            const formData = new FormData()
            formData.append('csrfmiddlewaretoken', csrfHidden.value)
            formData.append('username', this.username)
            formData.append('password', this.password)
            fetch(`http://${background['SERVER']}/login/`, {
              credentials: 'include',
              method: 'POST',
              body: formData
            }).then(resp => resp.text()).then(resp => {
              const loggedInUser = $(resp).find(`.user-profile p`).text().trim()
              this.loading = false
              if (loggedInUser && loggedInUser !== 'Personalize') {
                background.loggedInUser = loggedInUser
                console.log('login successful')
                this.goToDashboard()
              } else {
                console.log('login failed')
                window.location.reload()
              }
            })
          } else {
            this.loading = false
            console.log('already logged in')
            background.loggedInUser = $(resp).find(`.user-profile p`).text().trim()
            this.goToDashboard()
          }
        })
    },
    logout () {}
  }
}
</script>
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
      style="
        shape-rendering: auto;
        animation-play-state: running;
        animation-delay: 0s;
        background: none;
      "
    >
      <defs style="animation-play-state: running; animation-delay: 0s">
        <mask
          id="coolors-25658c1971f01"
          style="animation-play-state: running; animation-delay: 0s"
        >
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="#fff"
            stroke-linecap="round"
            stroke-dasharray="94.24777960769379 31.41592653589793"
            stroke-width="9"
            style="animation-play-state: running; animation-delay: 0s"
            transform="rotate(33.8955 50 50)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 50 50;360 50 50"
              times="0;1"
              dur="0.7s"
              repeatCount="indefinite"
              style="animation-play-state: running; animation-delay: 0s"
            />
          </circle>
        </mask>
      </defs>
      <g
        mask="url(#coolors-25658c1971f01)"
        style="animation-play-state: running; animation-delay: 0s"
      >
        <rect
          x="20.5"
          y="0"
          width="20.333333333333332"
          height="100"
          style="animation-play-state: running; animation-delay: 0s"
        >
          <animate
            attributeName="fill"
            values="#a4d0ef;#211f1f;#d63116"
            times="0;0.5;1"
            dur="0.7s"
            repeatCount="indefinite"
            begin="-0.6666666666666666s"
            style="animation-play-state: running; animation-delay: 0s"
          />
        </rect>
        <rect
          x="39.83333333333333"
          y="0"
          width="20.333333333333332"
          height="100"
          style="animation-play-state: running; animation-delay: 0s"
        >
          <animate
            attributeName="fill"
            values="#a4d0ef;#211f1f;#d63116"
            times="0;0.5;1"
            dur="0.7s"
            repeatCount="indefinite"
            begin="-0.3333333333333333s"
            style="animation-play-state: running; animation-delay: 0s"
          />
        </rect>
        <rect
          x="59.166666666666664"
          y="0"
          width="20.333333333333332"
          height="100"
          style="animation-play-state: running; animation-delay: 0s"
        >
          <animate
            attributeName="fill"
            values="#a4d0ef;#211f1f;#d63116"
            times="0;0.5;1"
            dur="0.7s"
            repeatCount="indefinite"
            begin="0s"
            style="animation-play-state: running; animation-delay: 0s"
          />
        </rect>
      </g>
    </svg>
  </div>

  <div v-else>
    <el-row>
      <el-col :span="24">
        <div class="overlay">
          <el-row class="header-contents">
            <el-col :span="6" class="text--white">
              <div class="top-right-assistant">
                <div>social</div>
                <div>assistant</div>
              </div>
            </el-col>
            <el-col :span="12" class="text--center">
              <div>
                <img src="../../static/images/logo-out.png" class="logo-out" />
                <img
                  src="../../static/images/logo-inner.png"
                  class="logo-inner"
                />
              </div>
              <h2 class="text--white hello-text">Login</h2>
              <h5 class="text--white logged-in-as">Log in to continue</h5>
            </el-col>
            <el-col :span="6" />
          </el-row>
          <div class="svg" />
        </div>
      </el-col>
    </el-row>
    <!-- Show Social -->
    <el-row class="show-you-row">
      <el-col :span="24">
        <h3 class="text--center show-you-font-upper">We can't wait to</h3>
        <h3 class="text--center no-margin show-you-font-lower">
          show you social.
        </h3>
      </el-col>
    </el-row>
    <!-- / - Show Social -->

    <!-- Get  Started Twitter -->
    <el-row class="get-started-row">
      <el-col :span="24">
        <h4 class="text--center">To get started,</h4>
        <h4 class="text--center">sign in with Twitter.</h4>
      </el-col>
    </el-row>

    <!-- / - Get  Started Twitter -->

    <!-- Footer Twitter -->
    <el-row class="footer-row">
      <el-col :span="24">
        <div class="button-position-twitter-login" @click="twitterLogin">
          <img
            src="../../static/icons/twitter-16.png"
            height="16"
            width="16"
            class="twitter-icon"
          />
          Login with Twitter
          <!--
          <img
            src="../../static/images/sign-in-with-twitter.png"
            class="twitter-login-button"
            @click="twitterLogin"
          >
          -->
          <!--
          <img
            src="../../static/icons/sign-in-with-twitter-blue.png"
            class="twitter-image-button"
            @click="twitterLogin"
          >
          -->
        </div>
        <!-- / TOS and Privacy consent -->
        <div
          class="button-position-twitter-login"
          style="
            bottom: -110px;
            background: none;
            border: none;
            font-size: 9.5px;
            font-weight: 500;
            color: #fafafa;
            padding-top: 20px;
          "
        >
          By continuing you agree to
          <a
            href="https://theconversation.social/tos/tos.html"
            style="color: #fafafa; text-decoration: underline"
            target="_blank"
            >TOS</a
          >,
          <a
            href="https://theconversation.social/privacy_policy/privacy_policy.html"
            style="color: #fafafa; text-decoration: underline"
            target="_blank"
            >privacy policy</a
          >
        </div>
      </el-col>
    </el-row>
    <!-- / Footer Twitter -->

    <!-- Footer -->
    <div class="footer-overlay">
      <div class="background-silk-svg" />
    </div>
    <!-- / - Footer -->

    <!--
    <center>
    <div name="headertext" style="font-weight:700; font-family:poppins;font-size:20px;">

      <p>We can't wait to show you social.</p>
    </div>

    <div  name="description" style="font-weight:400; font-family:poppins;font-size:14px;">
      <p> To get started, please login.</p>
    </div>
    </center>


    <form class="form-horizontal" role="form" action="#">
      <div class="form-group">
        <div class="col-xs-12">
          <input name="username" type="text" class="form-control" id="username" placeholder="Username" v-model="username">
        </div>
      </div>
      <div class="form-group">
        <div class="col-xs-12">
          <input name="password" type="password" class="form-control" id="password" placeholder="Password" v-model="password">
        </div>
      </div>
      <div v-if="!loading" class="row">
        <div class="col-xs-12" style="text-align:center;">
          //- <button type="button" class="btn btn-default" @click="login">Login</button>
          <el-button @click="login" class="login_button btn btn-default" type="primary" round>Login</el-button>
        </div>
        <div class="col-xs-12" style="text-align:center; padding-top:10px; padding-bottom:10px;">
          <a href="" @click="twitterLogin" class="fa fa-twitter" style="font-family:poppins; font-weight: 600; width=250px;">Sign in with Twitter</a>
          <img src="../../static/icons/sign_in_with_twitter_ALTERED7.png" style="width=250px;">
        </div>
        <div class="col-xs-12" style="text-align:center;">
          <div class="small"><a  href="https://theconversation.social/social-discovery/"><b>I don't have an account</b></a></div>
          <div class="small"><a  href="https://theconversation.social/social-discovery/"><b>Lost password</b></a></div>
        </div>
      </div>
      <div v-if="loading" class="row">
        <el-button @click="login" :loading="loading" style="width:100%"  class="login_button btn btn-default" type="primary" round>In progress</el-button>
      </div>
    </form> -->
  </div>
</template>
<style lang="scss">
* {
  font-family: Poppins, san-serif;
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
  box-shadow: 10px -10px rgba(0, 0, 0, 0.6) !important;
  -moz-box-shadow: 10px -10px rgba(0, 0, 0, 0.6) !important;
  -webkit-box-shadow: 5px 5px 10px #d3d3d3 !important;
  -o-box-shadow: 10px -10px rgba(0, 0, 0, 0.6) !important;
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
  padding-top: 8px;
}
.el-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: black;
  border: 1px solid #dcdfe6;
  color: white;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  padding: 12px 20px !important;
  font-size: 14px;
  border-radius: 4px !important;
  border-color: unset !important;
}
.el-button--primary:focus,
.el-button--primary:hover {
  color: #222222 !important;
  background: #d5e0d6 !important;
}
.fa {
  padding-top: 8px;
  padding-left: 3px;
  font-size: 20px;
  width: 35px;
  height: 35px;
  text-align: center;
  text-decoration: none;
  border-radius: 50%;
}

/* Add a hover effect if you want */
.fa:hover {
  opacity: 0.7;
  text-decoration: none;
}

/* Twitter */
.fa-twitter {
  background: #55acee;
  color: white;
}

.loader {
  margin: 0 0 2em;
  height: 100px;
  width: 20%;
  text-align: center;
  padding: 1em;
  margin: 0 auto 1em;
  display: inline-block;
  vertical-align: top;
}
</style>

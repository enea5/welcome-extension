<template>
  <div class="wrapper">
    <div class="sidebar">
      <span class="container">
        <div
          v-for="(menu, index) in menuList"
          :key="index"
          class="menu-item"
          @click="carouselIndex=index"
        >
          <span
            v-if="index===carouselIndex"
            class="selected-menu-item"
            >{{ menu }}</span
          >
          <span v-else>{{ menu }}</span>
        </div>
      </span>
    </div>
    <div class="content">
      <carousel
        v-model="carouselIndex"
        :per-page="1"
        :autoplay="false"
        class="main-carousel"
      >
        <slide class="slide1">
          <div>
            <div class="title">Let's Get You Setup!</div>
            <img
              class="welcome-img"
              src="../../static/images/welcomesplashnews-r.png"
              alt="welcome"
            />
          </div>
        </slide>
        <slide class="slide2">
          <div>
            <span class="title"
              >Discover Related Conversation on <span>News Articles</span></span
            >
            <span v-if="carouselIndex===1" class="player">
              <lottie-player
                src="../News_v5.json"
                background="transparent"
                speed="1.20"
                renderer="svg"
                autoplay
              />
            </span>
          </div>
        </slide>
        <slide class="slide3">
          <div>
            <span class="title"
              >Discover Related Conversation on
              <span style="">Twitter.com</span></span
            >
            <span v-if="carouselIndex===2" class="player">
              <lottie-player
                src="../Twitter_v10.json"
                background="transparent"
                speed="1.45"
                renderer="svg"
                autoplay
              />
            </span>
          </div>
        </slide>
        <slide class="slide4">
          <div>
            <span class="title"
              >Now, You Can Get Started by <span>Signing-in</span></span
            >
            <span class="form">
              <a
                href="https://theconversation.social/login/twitter/?next=/twitter/after_authentication/?next=chrome_extension_livedemo_newsarticles/?from_extension=true"
              >
                <center><img
                  src="../../static/icons/sign_in_with_twitter_ALTERED7.png" width=512
                  style="padding-top: 4%"
                /></center><br /><br />
                <span class="form-substring"
                  >This allows us to gather the conversation, 
                  personalized results, & gives you additional social.</span
                >
              </a>
              <span class="agreeline">
                By continuing, you agree to our
                <a
                  href="https://theconversation.social/privacy_policy/privacy_policy.html"
                  style='
                    display: inline-block;
                    font-family: -apple-system, system-ui, BlinkMacSystemFont,
                      Inter, Alata, sans-serif;
                    text-decoration: underline;
                    color: black;
                  '
                >
                  Privacy Policy</a
                >
                and
                <a
                  href="https://theconversation.social/tos/tos.html"
                  style='
                    display: inline-block;
                    font-family: -apple-system, system-ui, BlinkMacSystemFont,
                      Inter, Alata, sans-serif;
                    text-decoration: underline;
                    color: black;
                  '
                >
                  Terms of Service</a
                ></span
              >
              <span class="notwitteraccount">
                <a
                  href="https://theconversation.social/registration/?extension=true&notw=true"
                  style='
                    font-family: -apple-system, system-ui, BlinkMacSystemFont,
                      Inter, Alata, sans-serif;
                    color: #bfbfbf;
					font-size: 13px;
                  '
                >
                  <br>Sign up without Twitter</a
                ></span
              >
            </span>

          </div>
        </slide>
        <!--<slide class="slide5">
          <div>
            <div
              id="curate_button_id"
              href="#"
            >
              <div class="first">
                the
              </div>
              <div class="second">
                conversation
              </div>
              <div class="third">
                .social
              </div>
            </div>
            <hr>
            <form
              class="form-horizontal"
              role="form"
              action="#"
            >
              <div class="form-group">
                <div class="col-xs-12">
                  <input
                    id="username"
                    v-model="username"
                    name="username"
                    type="text"
                    class="form-control"
                    placeholder="Username"
                  >
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-12">
                  <input
                    id="password"
                    v-model="password"
                    name="password"
                    type="password"
                    class="form-control"
                    placeholder="Password"
                  >
                </div>
              </div>
              <div
                v-if="!loading"
                class="row"
              >
                <div
                  class="col-xs-12"
                  style="text-align:center;"
                >
                  <button
                    type="button"
                    class="btn btn-default"
                    @click="login"
                  >
                    Login
                  </button>
                  <el-button
                    class="login_button btn btn-default"
                    type="primary"
                    round
                    @click="login"
                  >
                    Login
                  </el-button>
                </div>
                <div
                  class="col-xs-12"
                  style="text-align:center; padding-top:10px; padding-bottom:10px;"
                >
                  <a
                    href=""
                    class="fa fa-twitter"
                    @click="twitterLogin"
                  />
                </div>
                <div
                  class="col-xs-12"
                  style="text-align:center;"
                >
                  <div class="small">
                    <a
                      target="_blank"
                      :href="serverAdmin"
                    ><b>I don't have an account</b></a>
                  </div>
                  <div class="small">
                    <a
                      target="_blank"
                      :href="serverAdmin"
                    ><b>Lost password</b></a>
                  </div>
                </div>
              </div>
              <div
                v-if="loading"
                class="row"
              >
                <el-button
                  style="width:100%"
                  :loading="loading"
                  class="login_button btn btn-default"
                  type="primary"
                  round
                >
                  In progress
                </el-button>
              </div>
            </form>
          </div>
        </slide>-->
      </carousel>
    </div>
    <div class="bg" />
  </div>
</template>
<script>
import {Carousel, Slide} from "vue-carousel";
import JQuery from "jquery";
import {CAROUSEL_TIMEOUTS} from "./constants";

const background = chrome.extension.getBackgroundPage();
const $ = JQuery;

export default {
  components: {
    Carousel,
    Slide,
  },
  data: () => ({
    fullLoading: false,
    loading: false,
    username: "",
    password: "",
    showOnTwitter: false,
    showForAll: false,
    carouselsTimeouts: CAROUSEL_TIMEOUTS,
    nextSlideTimeout: null,
    displayName: function () {
      return "TEST";
    },
    server: "",
    serverAdmin: "",
    menuList: [
      "01 Welcome",
      "02 News Articles",
      "03 Twitter.com",
      "04 Get Started",
    ],
    carouselIndex: 0,
  }),
  computed: {
  },
  watch: {
    carouselIndex(next) {
      if (next < 5) {
        this.runTimeout(this.carouselsTimeouts[next]);
      }
    },
  },
  created() {
  },
  mounted() {
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
        "src",
        "../lottie-player.js"
    );
    document.head.appendChild(recaptchaScript);
    this.runTimeout(this.carouselsTimeouts[0]);
  },
  methods: {
    runTimeout(time) {
      console.log('runTimeout', time, this.nextSlideTimeout, this.carouselIndex);

      if (this.nextSlideTimeout) {
        clearTimeout(this.nextSlideTimeout);
      }

      this.nextSlideTimeout = setTimeout(() => this.carouselIndex = this.carouselIndex + 1, time);
    },
    goToDashboard() {
      window.location.hash = "#/dashboard";
    },
    twitterLogin() {
      chrome.tabs.create({
        url:
            "https://theconversation.social/login/twitter/?next=/twitter/after_authentication/?next=chrome_extension_livedemo_newsarticles/?from_extension=true",
      });
    },
    login() {
      console.log("check login status");
      this.loading = true;
      fetch(`http://${background["SERVER"]}/`, {
        credentials: "include",
      })
          .then((r) => r.text())
          .then((resp) => {
            var csrfHidden = $(resp).find(`input[name='csrfmiddlewaretoken']`)[0];
            if (csrfHidden) {
              console.log("do login");
              const formData = new FormData();
              formData.append("csrfmiddlewaretoken", csrfHidden.value);
              formData.append("username", this.username);
              formData.append("password", this.password);
              fetch(`http://${background["SERVER"]}/login/`, {
                credentials: "include",
                method: "POST",
                body: formData,
              })
                  .then((resp) => resp.text())
                  .then((resp) => {
                    const loggedInUser = $(resp)
                        .find(`.user-profile p`)
                        .text()
                        .trim();
                    this.loading = false;
                    if (loggedInUser && loggedInUser !== "Personalize") {
                      background.loggedInUser = loggedInUser;
                      console.log("login successful");
                      chrome.tabs.getSelected(null, function (tab) {
                        chrome.tabs.remove(tab.id, function () {
                        });
                      });
                      // this.goToDashboard()
                    } else {
                      alert("login failed");
                      window.location.reload();
                    }
                  });
            } else {
              this.loading = false;
              console.log("already logged in");
              background.loggedInUser = $(resp)
                  .find(`.user-profile p`)
                  .text()
                  .trim();
              this.goToDashboard();
            }
          });
    },
  },
};
</script>
<style lang="css">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap");
* {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Inter";
}

body {
  padding: 0px !important;
  width: 100%;
}

.VueCarousel {
  text-align: center;
  width: 100%;
  margin: 0 auto;
}

.VueCarousel-dot-container {
  margin-top: -1px !important;
  margin-left: -16% !important;
}

#curate_button_id {
  text-decoration: none;
  color: #fff;
  text-align: center;
  position: inherit;
  z-index: 9999999999999;
  bottom: 30px;
  font-size: 17px;
  width: 180px;
  font-family: Poppins, sans-serif;
  height: 180px;
  border: solid 1px #555;
  background-color: black;
  animation-duration: 0.5s;
  box-shadow: 10px -10px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 10px -10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 5px 5px 10px #d3d3d3;
  -o-box-shadow: 10px -10px rgba(0, 0, 0, 0.6);
  border-radius: 100px;
  margin: 14px auto 3rem;
}

#curate_button_id > .first {
  margin-top: 42px;
  font-size: 24px;
  height: 28px;
  line-height: 30px;
  font-weight: 700;
}

#curate_button_id > .second {
  margin-top: 0px;
  font-size: 24px;
  height: 28px;
  line-height: 30px;
  font-weight: 700;
}

#curate_button_id > .third {
  word-wrap: break-word;
  margin-top: 0px;
  font-size: 19px;
  height: 14px;
  line-height: 14px;
  padding-top: 8px;
}

.el-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: poAlata;
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
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  border-color: unset;
}

.el-button--primary:focus,
.el-button--primary:hover {
  color: #222222;
  background: #d5e0d6;
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

/* @media (max-width: 1000px) {
  .sidebar {
    display: none;
  }
  .content {
    width: 100%;
  }
} */
</style>

<style lang="scss">
$mainFontFamily: "Inter", sans-serif;
$secondFontFamily: "Alata", sans-serif;

@mixin playerStyle {
  transition: 700ms ease;
  float: left;
  width: 62%;
  min-height: 280px;
  margin: 3rem 4% 2rem;
  border: 0px solid #ffffff;
  box-shadow: rgb(205, 205, 205) 0px 0px 15px 7px;
  border-radius: 9px;

  lottie-player {
    width: 100%;
    transition: 700ms ease;
    min-height: 280px;
    height: 100%;
  }
}

.wrapper {
  padding: 20px;
  //display: flex;
  transition: 200ms ease;

  .bg {
    width: 100%;
    height: 100%;
  }

  .sidebar {
    width: 18.5%;
    float: left;

    .container {
      width: 100%;
      border: 1px solid rgb(255, 255, 255);
      text-align: left;
      color: silver;
      font-size: 13px;
      font-family: $mainFontFamily;
      font-weight: 400;
      margin-top: 3rem;
      line-height: 3rem;

      .menu-item {
        font-family: $mainFontFamily;
        cursor: pointer;
        margin-bottom: 10px;
        font-size: 14px;
        padding-left: 10%;

        .selected-menu-item {
          font-family: $mainFontFamily;
          font-weight: 700;
          color: black;
          text-decoration: underline;
        }
      }
    }
  }

  .content {
    width: 80%;
    float: left;

    .main-carousel {
      width: 100%;
      margin-top: 1rem;
    }

    .slide1 > div {
      position: relative;
      top: 50%;
      left: 43.5%;
      transform: translate(-50%, -50%);
      animation: fadeInAnimation ease 1s;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
    }
    @keyframes fadeInAnimation {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    .slide1 {
      .title {
        margin-top: 1.5rem;
        font-size: 48px;
        font-weight: 300;
        font-family: $mainFontFamily;
      }

      .welcome-img {
        width: 62%;
        height: 100%;
        margin: 10px auto 20px;
      }

      .player {
        width: 60%;
        height: 60%;
        //@include playerStyle;
        lottie-player {
          width: 100%;
          height: 100%;
        }
      }
    }

    .slide2 {
      .title {
        transition: 200ms ease;
        font-size: 36px;
        font-weight: 400;
        font-family: $mainFontFamily;
        width: 30%;
        text-align: left;
        border: 1px solid rgb(255, 255, 255);
        float: left;
        margin-top: 3rem;
        padding-right: 25px;

        span {
          font-family: $mainFontFamily;
          color: #ca000c;
          font-weight: 700;
        }
      }

      .player {
        @include playerStyle;
      }
    }

    .slide3 {
      .title {
        transition: 200ms ease;
        font-size: 36px;
        font-weight: 400;
        font-family: $mainFontFamily;
        width: 30%;
        text-align: left;
        border: 1px solid rgb(255, 255, 255);
        float: left;
        margin-top: 3rem;
        padding-right: 25px;

        span {
          font-family: $mainFontFamily;
          color: #6291e0;
          font-weight: 700;
        }
      }

      .player {
        background-image: url("../../static/images/backgroundtwitteranimation.png");
        background-repeat: no-repeat;
        background-size: cover;
        @include playerStyle;
      }
    }

    .slide4 {
      > div {
        display: flex;
        //position: relative;
        //top: 50%;
        //transform: translate(0, -50%);
      }

      .agreeline {
        font-weight: 400;
        font-size: 14px;
        line-height: 2em;
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Inter",
          "Alata", sans-serif;
        color: #000000;
        }
		  
      .form {
        display: inline-block;
        width: 65%;
        border: 1px solid #ffffff;
        border-radius: 9px;

        a {
          display: flex;
          flex-direction: column;
          text-decoration: none;

          img {
            object-fit: contain;
          }
          .form-substring {
            font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Inter",
              "Alata", sans-serif;
            color: #6291e0;
            font-weight: 600;
            line-height: 2.5rem;
            font-size: 16px;
          }
        }
      }

      .title {
        font-size: 36px;
        font-weight: 400;
        font-family: $mainFontFamily;
        width: 25%;
        text-align: left;
        border: 1px solid rgb(255, 255, 255);
        display: block;
        float: left;
        padding-right: 10px;
        margin-top: 3rem;

        span {
          font-family: $mainFontFamily;
          color: #6291e0;
          font-weight: 700;
        }
      }
    }

    .slide5 {
      > div {
        max-width: 700px;
        position: relative;
        left: 50%;
        transform: translate(-50%);
        top: 20%;
      }
    }
  }
}

@media (max-width: 767px) {
  .wrapper {
    .sidebar {
      display: none;
    }

    .content {
      width: 100%;

      .slide2 {
        div {
          display: flex;
          flex-direction: column;

          .title {
            width: 100%;
            text-align: center;
            float: none;
            padding: 0;
            margin: 0;
          }

          .player {
            width: auto;

            lottie-player {
              width: 100%;
              margin: auto;
            }
          }
        }
      }

      .slide3 {
        div {
          display: flex;
          flex-direction: column;

          .title {
            width: 100%;
            text-align: center;
            float: none;
            padding: 0;
            margin: 0;
          }

          .player {
            width: auto;

            lottie-player {
              width: 100%;
              margin: auto;
            }
          }
        }
      }

      .slide4 > div {
        flex-direction: column;
      }

      .slide4 {
        .title {
          width: 100%;
          text-align: center;
          float: none;
          padding: 0;
          margin: 0;
        }

        .form {
          float: none;
          width: 100%;

          img {
            width: 100%;
          }
        }
      }
    }
  }
}
@media (max-width: 900px) {
  .wrapper {
    .content {
      .slide2 {
        .title {
          font-size: 30px;
        }
      }

      .slide3 {
        .title {
          font-size: 30px;
        }
      }

      .slide1 {
        .title {
          font-size: 30px;
        }
      }

      .slide4 {
        .title {
          font-size: 30px;
        }
      }
    }
  }
}
@media (min-width: 1200px) {
  .player {
    min-height: 470px !important;
  }
}
</style>

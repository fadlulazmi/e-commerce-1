<template>
  <div id="app">
    <div>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a @click="$router.push('/')" class="navbar-item">
            <img
              src="https://clipground.com/images/wedding-logo-clipart-4.jpg"
              width="50"
              height="28"
            />
            bridezilla
          </a>
        </div>
        <div id="navbarBasicExample" class="navbar navbar-end">
          <div class="navbar-end">
            <div class="navbar-item" v-if="!isLogin">
              <!-- gsign in -->
              <g-signin-button
                :params="googleSignInParams"
                @success="onSignInSuccess"
                @error="onSignInError"
              ><img src="https://image.flaticon.com/icons/svg/281/281781.svg" alt="" style="height:30px">
              </g-signin-button>
              <!-- gsign in -->
              <div class="buttons">
                <a class="button is-danger" @click="goSignUp">
                  <strong>Sign up</strong>
                </a>
                <a class="button is-light" @click="goSignIn">Sign in</a>
              </div>
            </div>
            <div class="navbar-item" v-if="isLogin">
              <div class="buttons">
                <b-field>
                  <b-input
                    v-model="search"
                    placeholder="Search Products..."
                    type="search"
                    icon-pack="fas"
                    icon="search"
                    style="margin-right:30px; margin-bottom:-4px;"
                    rounded
                  ></b-input>
                </b-field>
                <button
                  v-if="!isAdmin"
                  class="button has-badge-primary has-badge-rounded"
                  @click="getCart"
                  :data-badge="myCart.length"
                >
                  <i class="fas fa-shopping-cart"></i>
                </button>
                <a v-if="isAdmin" class="button is-light" @click="addProducts">
                  <strong>+Product</strong>
                </a>
                <a class="button is-danger" @click.prevent="$store.dispatch('logout')">
                  <strong>Log Out</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <!-- <modal></modal> -->
      <section class="hero is-fullheight-with-navbar" v-if="!isLogin">
        <div class="hero-body">
          <!-- <hooper class="carousel">
            <slide id="slide1"></slide>
            <slide id="slide2"></slide>
            <slide id="slide3"></slide>
            <slide id="slide4"></slide>
          </hooper>-->
        </div>
      </section>
    </div>
    <b-modal :active.sync="isComponentModalActive" has-modal-card>
      <modal
        @isAddProduct="isComponentModalActive = $event"
        @isLoggedIn="isComponentModalActive = $event"
        @edited="isComponentModalActive = $event"
        :isFormProducts="isFormProducts"
        :isFormSignIn="isFormSignIn"
        :isFormSignUp="isFormSignUp"
        :product="{data: editProduct, onEdit: true}"
      >
        <p v-if="isError" style="color:red">{{isError}}</p>
      </modal>
    </b-modal>
    <router-view
      @onEdit="onEdit"
      v-if="isLogin"
      :search="search"
      :isComponentModalActive="isComponentModalActive"
    />
  </div>
</template>

<script>
import modal from "./components/Modal.vue";
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";
import { mapState } from "vuex";

export default {
  components: {
    Hooper,
    Slide,
    modal
  },
  created() {},
  computed: {
    ...mapState(["isLogin", "isAdmin", "isError", "myCart"])
  },
  data() {
    return {
      googleSignInParams: {
        client_id: '379982264831-felr8s22ploj5a6ggprv9v2gh6edf7p0.apps.googleusercontent.com'
      },
      editProduct: {},
      search: "",
      form: {
        username: "",
        email: "",
        password: ""
      },
      isComponentModalActive: false,
      isFormSignIn: false,
      isFormSignUp: false,
      isFormProducts: false
    };
  },

  methods: {
     onSignInSuccess (googleUser) {
      // `googleUser` is the GoogleUser object that represents the just-signed-in user.
      // See https://developers.google.com/identity/sign-in/web/reference#users
      console.log('triggered');
      const profile = googleUser.getBasicProfile() // etc etc
      var id_token = googleUser.getAuthResponse().id_token;
      this.$store.dispatch('signInGoogle', id_token)
        .then(data => {
          console.log("data: ", data);
          this.$toast.open('success login')
        })
        .catch(err => {});

    },
    onSignInError (error) {
      // `error` contains any error occurred.
      console.log('OH NOES', error)
    },
    onEdit(value) {
      this.editProduct = value;
      this.$store.commit("getError", "");
      this.isFormSignIn = false;
      this.isFormSignUp = false;
      this.isFormProducts = false;
      this.isComponentModalActive = true;
    },
    goSignIn() {
      console.log("sigin");
      this.$store.commit("getError", "");
      this.isComponentModalActive = true;
      this.isFormSignIn = true;
      this.isFormSignUp = false;
      this.isFormProducts = false;
    },
    goSignUp() {
      console.log("sigup");
      this.$store.commit("getError", "");
      this.isError = "";
      this.isComponentModalActive = true;
      this.isFormSignIn = false;
      this.isFormSignUp = true;
      this.isFormProducts = false;
    },
    addProducts() {
      this.$store.commit("getError", "");
      this.isError = "";
      this.isComponentModalActive = true;
      this.isFormSignIn = false;
      this.isFormSignUp = false;
      this.isFormProducts = true;
    },
    getCart() {
      this.$router.push("/myCart");
    }
  }
};
</script>


<style>
* {
  padding: 0;
  margin: 0;
}
#app {
  /* font-family: "Rochester", cursive; */
  font-family: "Overlock", cursive;
  /* font-family: "Mada", sans-serif; */
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  width: 100vw;
  margin-top: 5px;
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}
.navbar-brand {
  font-size: 24px;
  font-family: "Rochester", cursive;
  font-weight: bold;
}
.navbar-brand .navbar-item {
  margin-left: 20px;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
#app .hero-body {
  padding: 0;
  margin: 0;
  background-image: url("https://i.pinimg.com/originals/ec/af/f1/ecaff1f358fe2988c17a6c5b3acb5989.jpg");
  background-position-y: 70%;
  background-size: cover;
  /* border: 1px green solid; */
}
#app .hero {
  padding: 0;
  margin: 0;
  /* border: 1px blue solid; */
}
.carousel {
  /* border:1px black solid;  */
  height: 100%;
}
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: flex;
  /* padding: 4px 8px; */
  padding: 2px;;
  border-radius: 3px;
  background-color: #353941;
  color: #fff;
  box-shadow: 0 3px 0 #2f3541;
  margin-right: 8px;
  margin-top: -3px;
  cursor: pointer;
}
</style>

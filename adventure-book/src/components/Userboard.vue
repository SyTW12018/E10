<template>
  <div>
    <h1>Bienvenido al dashboard</h1>
    <h2>{{user_data}}</h2>

    <form @submit.prevent="sendFiles" enctype="multipart/form-data">
      <div>
        <label for="title">Upload Files</label>
        <input type="file" ref="file" @change="selectFile">
      </div>
      <div>
        <button @onclick="sendFiles">Send</button>
      </div>
    </form>

    <div>
      <button @click="log_out"> Log Out</button>
    </div>
  </div>  
</template>

<script>
export default {
  data: function() {
    return {
      user_: JSON.parse(localStorage.getItem("user")),
      b_creat_alb: false,
      file: ""
    };
  },
  methods: {
    log_out() {
      window.localStorage.clear();
      this.$router.push("/");
    },

    create_album() {},

    async sendFiles() {
      /*
          Initialize the form data
        */
      console.log(this.file)
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        await this.$http.post('http://localhost:8081/upload', formData);
      } catch (err) {
        console.log(err);
      }
    },

    selectFile() {
      this.file = this.$refs.file.files[0];
    }
  },

  mounted() {
    console.log("mounted in dashboard: ");
    console.log(localStorage.getItem("jwt"));
    if (
      localStorage.getItem("jwt") == null ||
      localStorage.getItem("jwt") == "undefined"
    ) {
      this.$router.push("/");
    }
    this.$http
      .post("http://localhost:8081/dashboard", {
        user_: JSON.parse(localStorage.getItem("user"))._id
      })
      .then(response => {
        this.user_data = response.data;
      });
  }
};
</script>


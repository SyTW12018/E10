<template>
  <div>
    <h1>Bienvenido al dashboard</h1>
    <h2>{{user_data}}</h2>
    <button @click="!b_creat_alb">Crea tu album</button>
    <div>
      <form enctype="multipart/form-data" novalidate >
        <h1>Upload images</h1>
        <div class="dropbox">
          <input
            type="file"
            multiple
            :name="uploadFieldName"
            :disabled="isSaving"
            @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
            accept="image/*"
            class="input-file"
          >
          <p v-if="isInitial">Drag your file(s) here to begin
            <br>or click to browse
          </p>
          <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
        </div>
      </form>
    </div>
    <button @click="log_out">LOG OUT</button>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      user_: JSON.parse(localStorage.getItem("user")),
      b_creat_alb: false
    };
  },
  methods: {
    log_out() {
      window.localStorage.clear();
      this.$router.push("/");
    },

    create_album() {}
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
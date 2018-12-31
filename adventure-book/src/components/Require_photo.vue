<template></template>

<script>
export default {
  data: function() {
    return {
      fotos_: []
    };
  },

  async mounted() {
    try {
      await this.$http
        .get("http://localhost:8081/userboard/" + this.name)
        .then(response => {
          this.fotos_ = response.data[1];
        });
    } catch (err) {};
  }
};
</script>
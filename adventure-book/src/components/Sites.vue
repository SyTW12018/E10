<style>
body {
  background-color: white !important;
}
.main {
  padding: 100px;
  background-color: white;
}

.card {
  position:relative;
  margin: 0px 8px 8px 0px;
  background-color: #54c2c3;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  text-align: center;
  border-radius: 0px;
  width: 16rem !important;
}

.card:hover {
  background-color: white;
  color: #54c2c3;
}

.card-body {
  padding: 5px 20px 5px 20px;
  height: 55px;
}

.fav {
  position: absolute;
  left: 90%;
}

.c {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  text-align: left;
}

@media (max-width: 720px) {
  .card {
    width: 9.5rem !important;
  }
  .item{
    font-size: 12px !important;
  }
  .main {
    padding: 30px;
  }
  .fav{
    left: 80%;
  }
}

</style>

<template>
  <div class="main">
    <div class="container">
      <b-row>
        <b-col cols="12" id="sitios">
          <b-row>
            <router-view></router-view>
          </b-row>
          <b-row>
            <h2>{{ nombre }}</h2>
          </b-row>
          <b-row>
            <p>{{ descripcion}}</p>
          </b-row>

          <b-row>
            <div v-for="(sitio,index) in comunidades_autonomas" :key="index">
              <div class="card">
                <img
                  @click="route(sitio.cod)"
                  class="card-img-top"
                  :src="comunidades_autonomas[index].photo"
                  alt="Card image"
                >
                <div class="card-body c">
                  <img
                    v-bind:id="sitio.cod"
                    class="fav"
                    @click="fav(sitio.cod)"
                    src="../assets/unfav.png"
                    alt="cerrar"
                  >
                  <p class="item">{{ sitio.nombre }}</p>
                </div>
              </div>
            </div>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      nombre: "Todos los sitios",
      descripcion:
        "Descubre todas las comunidades y ciudades autónomas españolas.",
      place_data: [],
      comunidades_autonomas: [
        {
          cod: "0",
          nombre: "Andalucía",
          photo: ""
        },
        {
          cod: "1",
          nombre: "Aragón",
          photo: ""
        },
        {
          cod: "2",
          nombre: "Cantabria",
          photo: ""
        },
        {
          cod: "3",
          nombre: "Castilla la Mancha",
          photo: ""
        },
        {
          cod: "4",
          nombre: "Castilla y León",
          photo: ""
        },
        {
          cod: "5",
          nombre: "Cataluña",
          photo: ""
        },
        {
          cod: "6",
          nombre: "Ceuta",
          photo: ""
        },
        {
          cod: "7",
          nombre: "Comunidad de Madrid",
          photo: ""
        },
        {
          cod: "8",
          nombre: "Comunidad Foral de Navarra",
          photo: ""
        },
        {
          cod: "9",
          nombre: "Comunidad Valenciana",
          photo: ""
        },
        {
          cod: "10",
          nombre: "Extremadura",
          photo: ""
        },
        {
          cod: "11",
          nombre: "Galicia",
          photo: ""
        },
        {
          cod: "12",
          nombre: "Islas Baleares",
          photo: ""
        },
        {
          cod: "13",
          nombre: "Islas Canarias",
          photo: ""
        },
        {
          cod: "14",
          nombre: "La Rioja",
          photo: ""
        },
        {
          cod: "15",
          nombre: "Melilla",
          photo: ""
        },
        {
          cod: "16",
          nombre: "Pais Vasco",
          photo: ""
        },
        {
          cod: "17",
          nombre: "Principado de Asturias",
          photo: ""
        },
        {
          cod: "18",
          nombre: "Región de Murcia",
          photo: ""
        }
      ]
    };
  },
  sitios_deseados: [""],
  methods: {
    route(lugar) {
      this.$router.push("/sitios/" + lugar);
    },

    fav(cod) {
      if (document.getElementById(cod).src == require("../assets/fav.png")) {
        // Quitar el sitio con codigo cod de sitios deseados
        var index = this.sitios_deseados.indexOf(cod);
        if (index !== -1) this.sitios_deseados.splice(index, 1);
        document.getElementById(cod).src = require("../assets/unfav.png");
      } else if (
        document.getElementById(cod).src == require("../assets/unfav.png")
      ) {
        // Poner el sitio con codigo cod en sitios deseados
        this.sitios_deseados.push(cod);
        document.getElementById(cod).src = require("../assets/fav.png");
      }
    }
  },

  async beforeDestroy() {
    console.log("me van a cerrar D:");
    console.log(this.sitios_deseados);

    // BACKEND:
    try {
      console.log(this.sitios_deseados.length)
        if(this.sitios_deseados.length > 0){
          console.log("Entra en el if del userboard")
          await this.$http
          .post(
            "http://localhost:8081/update_wished_place/" +
              JSON.parse(localStorage.getItem("user")).mail + "/" + this.sitios_deseados
          )
        }
        else{
          console.log("Entra en el else del userboard")
          await this.$http
          .post(
            "http://localhost:8081/update_wished_place/" +
              JSON.parse(localStorage.getItem("user")).mail + "/" + "empty"
          )
        }
    }catch(err){}
  },

  async mounted() {
    if (
      localStorage.getItem("jwt") == null ||
      localStorage.getItem("jwt") == "undefined"
    ) {
      this.$router.push("/");
    }
    // BACKEND:
    this.sitios_deseados = []

    try {
      await this.$http
        .get(
          "http://localhost:8081/get_wished_place/" +
            JSON.parse(localStorage.getItem("user")).mail
        )
        .then(response => {
          if(response.data[0] == undefined){
            this.sitios_deseados = []
          }
          else{
            this.sitios_deseados = response.data[0].split(',');
          }

          for (var i = 0; i < this.sitios_deseados.length; i++) {
            this.sitios_deseados[i] = this.sitios_deseados[i].toString();
            document.getElementById(
              this.sitios_deseados[i]
            ).src = require("../assets/fav.png");
          }
        });
    } catch (err) {}


    // En este bucle

    for (var i = 0; i < this.comunidades_autonomas.length; i++) {
      try {
        await this.$http
          .get(
            "http://localhost:8081/sites/" + this.comunidades_autonomas[i].cod
          )
          .then(response => {
            this.comunidades_autonomas[
              i
            ].photo = response.data[1].photo[0].split("adventure-book")[1];
          });
      } catch (err) {}
    }
  },
  components: {}
};
</script>

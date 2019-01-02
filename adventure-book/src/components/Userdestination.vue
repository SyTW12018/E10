<style scope>
.main {
  padding: 30px;
  background-color: white;
}

.contenido {
  background-color: white;
  color: #54c2c3;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  border-width: 2px;
  border: solid white;
  margin-top: 20px;
}

.Fecha {
  font-size: 12px;
}
.Plus {
  height: 20px;
  width: 20px;
}

.Echis {
  height: 17px;
  width: 17px;
}

.contenido:hover {
  border-width: 2px;
  border: solid rgb(84, 194, 195, 0.7);
  border-radius: 5px;
}

.contenido2 {
  margin: 8px;
  margin-left: 0px;
}

.personas {
  border-width: 2px;
  border: solid rgb(84, 194, 195);
}

.card {
  width: 1.5rem;
}

.img {
  width: 12rem;
}

.boton {
  color:white ;
  background-color:#54C2C3;
  border-radius: 6px;
  border: 2px solid rgb(84, 194, 195,.3);
  margin-top:10px;
}

.boton:hover {
  background-color: rgb(84, 194, 195,.7);
  border: 2px solid rgb(84, 194, 195,.3);
}

.contenido3{
  text-align:center;
  background-color: white;
  color: #54c2c3;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  border-width: 2px;
  border: solid white;
  margin-top: 20px;
}

.fondo {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0,.7);
  display: table;
}

.cuadrado {
  display: table-cell;
  vertical-align: middle;
}

.contenedor {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
}

.form{
  margin:12px;
  border: 2px solid rgb(84, 194, 195);
}

</style>



<template>
  <div class="main">
    <transition v-if="cuestionario">
      <div class="fondo">
        <div class="cuadrado">
          <div class="contenedor">
            <div class="contenido3">
              <h4> Añadir lugar </h4>
              <b-form-input class= "form" type="text" placeholder="Nombre lugar" v-model="lugar_"></b-form-input>
              <b-form-input class= "form" type="text" placeholder="Fecha viaje" v-model="fecha_"></b-form-input>
              <b-button type="submit" class="boton" v-on:click= "nuevoviaje">
                Añadir
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </transition>


    <div class="container">
      <b-row>
        <b-col cols="6" id="sitio_deseados">
          <b-row>
            <h2>Destinos deseados</h2>
          </b-row>
          <div v-for="sitio in destinos_deseados" :key="sitio" class="contenido">
            <b-row class="contenido2" v-if="sitio.base">
              <b-col>
                <div class="img">
                  <img class="card-img-top" src="../C.jpg">
                </div>
              </b-col>
              <b-col>
                <b-row @click="cambiarEstado(sitio)">
                  <h3>{{sitio.lugar}}</h3>
                </b-row>
                <b-row>
                  <b-col>
                    <b-row>{{sitio.pais}}</b-row>
                  </b-col>
                  <b-col cols="4" class="personas">
                    <b-row>
                      <b-col cols="1">{{sitio.personas}}</b-col>
                      <b-col cols="1">
                        <div class="card">
                          <img class="card-img-top" src="../person.jpg" alt="Card image">
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-row class="Fecha">
                  <b-col cols="10">
                    <b-row>{{sitio.fecha}}</b-row>
                  </b-col>
                  <b-col v-if="sitio.mostrar" cols="1">
                    <img
                      @click="personaapuntada(sitio)"
                      class="card-img-top Plus"
                      src="../assets/add.png"
                      alt="Card image"
                    >
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </div>
          <b-row class="mb-3">
            <h2>Este mes</h2>
          </b-row>
          <div v-for="sitio in este_mes" :key="sitio" class="contenido">
            <b-row class="contenido2" v-if="sitio.base">
              <b-col>
                <div class="img">
                  <img class="card-img-top" src="../C.jpg">
                </div>
              </b-col>
              <b-col>
                <b-row @click="cambiarEstado(sitio)">
                  <h3>{{sitio.lugar}}</h3>
                </b-row>
                <b-row>
                  <b-col>
                    <b-row>{{sitio.pais}}</b-row>
                  </b-col>
                  <b-col cols="4" class="personas">
                    <b-row>
                      <b-col cols="1">{{sitio.personas}}</b-col>
                      <b-col cols="1">
                        <div class="card">
                          <img class="card-img-top" src="../person.jpg" alt="Card image">
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-row class="Fecha">
                  <b-col cols="10">
                    <b-row>{{sitio.fecha}}</b-row>
                  </b-col>
                  <b-col v-if="sitio.mostrar" cols="1">
                    <img
                      @click="personaapuntada(sitio)"
                      class="card-img-top Plus"
                      src="../assets/add.png"
                      alt="Card image"
                    >
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </div>
          <b-row>
            <h2>Todos los viajes organizados</h2>
          </b-row>
          <div v-for="sitio in todo_organizado" :key="sitio" class="contenido">
            <b-row class="contenido2" v-if="sitio.base">
              <b-col>
                <div class="img">
                  <img class="card-img-top" src="../C.jpg">
                </div>
              </b-col>
              <b-col>
                <b-row @click="cambiarEstado(sitio)">
                  <h3>{{sitio.lugar}}</h3>
                </b-row>
                <b-row>
                  <b-col>
                    <b-row>{{sitio.pais}}</b-row>
                  </b-col>
                  <b-col cols="4" class="personas">
                    <b-row>
                      <b-col cols="1">{{sitio.personas}}</b-col>
                      <b-col cols="1">
                        <div class="card">
                          <img class="card-img-top" src="../person.jpg" alt="Card image">
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-row class="Fecha">
                  <b-col cols="10">
                    <b-row>{{sitio.fecha}}</b-row>
                  </b-col>
                  <b-col v-if="sitio.mostrar" cols="1">
                    <img
                      @click="personaapuntada(sitio)"
                      class="card-img-top Plus"
                      src="../assets/add.png"
                      alt="Card image"
                    >
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </div>
        </b-col>
        <b-col cols="6" id="proximos_viajes" class="w-100">
          <b-row>
            <h2>Tus proximos viajes</h2>
          </b-row>
          <b-row>
            <div class="contenido" @click="cuestionario=true">
              <img  class="card-img-top Plus" src="../assets/add.png">
              Añade un viaje
            </div>
          </b-row>
          <div v-for="sitio in futuros_viajes" :key="sitio" class="contenido">
            <b-row v-if="sitio.base" class="contenido2">
              <b-col>
                <div class="img">
                  <img  class="card-img-top" src="../C.jpg">
                </div>
              </b-col>
              <b-col>
                <b-row @click="cambiarEstado(sitio)">
                  <h3>{{sitio.lugar}}</h3>
                </b-row>
                <b-row>
                  <b-col>
                    <b-row>{{sitio.pais}}</b-row>
                  </b-col>
                  <b-col cols="4" class="personas">
                    <b-row>
                      <b-col cols="1">{{sitio.personas}}</b-col>
                      <b-col cols="1">
                        <div class="card">
                          <img
                            class="card-img-top"
                            src="../person.jpg"
                            alt="Card image"
                          >
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-row class="Fecha">
                  <b-col cols="10">
                    <b-row>{{sitio.fecha}}</b-row>
                  </b-col>
                  <b-col v-if="sitio.mostrar" cols="1">
                    <img
                      @click="personadesapuntada(sitio)"
                      class="card-img-top Echis"
                      src="../assets/echis.png"
                      alt="Card image"
                    >
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>



	export default {

	  data(){

      return{
        cuestionario:false,
				destinos_deseados: [
							{lugar: 'Venecia', pais: 'Italia',fecha:'Marzo 2016', personas:3,codigo:'3',mostrar:false,base:true},
              {lugar: 'Oporto' ,pais: 'Portugal',fecha:'Mayo 2016', personas:4,codigo:'4',mostrar:false,base:true},

        ],

        futuros_viajes: [
                                                        {lugar: 'Venecia', pais: 'Italia',fecha:'Marzo 2016', personas:8,codigo:'5',mostrar:false,base:true},
                                                        {lugar: 'Oporto' ,pais: 'Portugal',fecha:'Mayo 2016', personas:4,codigo:'6',mostrar:false,base:true},
        ],

				este_mes: [
                                                        {lugar: 'Venecia', pais: 'Italia',fecha:'Marzo 2016', personas:3,codigo:'7',mostrar:false,base:true},
                                                        {lugar: 'Oporto' ,pais: 'Portugal',fecha:'Mayo 2016', personas:4,codigo:'8',mostrar:false,base:true},

        ],

				todo_organizado: [

                                                        {lugar: 'Madrid', pais: 'España',fecha:'Marzo 2017', personas:12, codigo:'1',mostrar:false,base:true},
                                                        {lugar: 'Oporto' ,pais: 'Portugal',fecha:'Mayo 2016', personas:4,codigo:'2',mostrar:false,base:true},
        ]
      }
    },

    mounted(){
    },

		methods: {

			personaapuntada: function(object){
				object.personas = object.personas+1;
				object.base = !object.base;
				this.futuros_viajes.push({lugar:object.lugar,pais: object.pais,fecha:object.fecha, personas:object.personas,codigo:object.codigo,mostrar:false,base:true});
      },

			personadesapuntada: function(object){
				object.personas = object.personas-1;
				object.base = !object.base;
				this.todo_organizado.push({lugar:object.lugar,pais: object.pais,fecha:object.fecha, personas:object.personas,codigo:object.codigo,mostrar:false,base:true});
			},

			cambiarEstado: function(object) {
            			object.mostrar = !object.mostrar;
      },

      nuevoviaje: function(){
        if ((this.lugar_!= undefined) && (this.fecha_!= undefined)){
          this.cuestionario=!this.cuestionario;
          this.futuros_viajes.push({lugar:this.lugar_,pais: 'España',fecha:this.fecha_, personas:1,codigo:'9',mostrar:false,base:true});
          this.todo_organizado.push({lugar:this.lugar_,pais: 'España',fecha:this.fecha_, personas:1,codigo:'9',mostrar:false,base:true});
        }else{
          alert("Existe un campo vacío");
        }
      },
		},

    components: {
    }

  }
</script>

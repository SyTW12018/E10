<style>
body {
  background-color: white !important;
}
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

.contenido2 {
  background-color: white;
  color: #54c2c3;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  border-width: 2px;
  border: solid white;
}

.contenido:hover {
  border-width: 2px;
  border: solid rgb(84, 194, 195, 0.7);
  border-radius: 5px;
}

.contenido2:hover {
  background-color: rgb(84, 194, 195, 0.1);
}

.Fecha {
  font-size: 12px;
  margin-left: 8px;
}

.Plus {
  height: 20px;
  width: 20px;
}

.Echis {
  height: 17px;
  width: 17px;
}

.avion{
  margin:2px;
}

.contenido:hover {
  border-width: 2px;
  border: solid rgb(84, 194, 195, 0.7);
  border-radius: 5px;
}

.contenido2:hover {
  background-color:rgb(84, 194, 195, 0.2);
}

.card {
  width: 1.5rem;
}

.img {
  width: 9.5rem;
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

.margin{
  margin-right:-18px;
}

.Foto{
  margin:8px;
}

.Titulo{
  margin-top:8px;
}

.participante{
  color: rgb(84, 194, 195,0.7);
  font-weight: bold;
  text-transform: uppercase;
  margin-left: 40px;
  margin-bottom: 20px;
}

.Equis{
  margin-left:230px;
  margin-top:-10px;
}

.Titulo2{
  text-align: center;
  margin-bottom: 20px;
}

</style>

<template>
  <div class="main">
    <transition v-if="cuestionario">
      <div class="fondo">
        <div class="cuadrado">
          <div class="contenedor">
            <b-row><b-col class="Equis">
              <img
                @click="cuestionario=false"
                class="card-img-top Plus"
                src="../assets/echis.png"
                alt="Card image"
              >
            </b-col></b-row>
            <div class="contenido3">
              <h4> Añadir lugar </h4>
              <b-form-input class= "form" type="text" placeholder="Nombre lugar" v-model="place_"></b-form-input>
              <b-form-input class= "form" type="date" placeholder="Fecha viaje" v-model="fecha_"></b-form-input>
              <b-form-input class= "form" type="date" placeholder="Fecha final viaje" v-model="fechaf_"></b-form-input>
              <b-button type="submit" class="boton" v-on:click= "nuevoviaje">
                Añadir
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition v-if="miembros">
      <div class="fondo">
        <div class="cuadrado">
          <div class="contenedor">
            <div class="contenido3">
              <h4 class="Titulo2"> Participantes </h4>
              <b-row>
                <b-col cols="4"> <h5> Chat </h5> </b-col>
                <div v-for="sitio in aux2" :key="sitio">
                  <div v-for="fech in aux" :key="sitio">
                    <div v-for="i in fech.members" :key="sitio" >
                      <b-row>
                        <b-col class="participante" cols="8">{{i}}</b-col>
                      </b-row>
                    </div>
                  </div>
                </div>
              </b-row>
              <b-button type="submit" class="boton" v-on:click= "cambiar_estado(fech)">
                Aceptar
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
          <div v-for="sitio in destinos_deseados" :key="sitio" class="contenido" v-if="sitio.base">
            <b-row>
              <div @click="mostrarfechas(sitio)">
                <b-col>
                  <div class="img">
                    <img class="card-img-top Foto" src="../C.jpg">
                  </div>
                </b-col>
              </div>
              <b-col>
                <div @click="mostrarfechas(sitio)">
                  <b-row>
                    <h3 class="Titulo">{{sitio.place}}</h3>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-row>{{sitio.pais}}</b-row>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>
            <div v-for="fech in sitio.date" :key="date" class="contenido2" v-if="sitio.fecham">
              <b-row  v-if="fech.camuflado">
                <b-col cols="4" class="Fecha"> {{fech.fecha}} </b-col>
                <b-col cols="1"> - </b-col>
                <b-col cols="4" class="Fecha"> {{fech.fecha_f}} </b-col>
                <b-col>
                  <b-row>
                    <b-col cols="1" class="margin"> {{fech.personas}} </b-col>
                    <b-col cols="1">
                      <div class="card">
                        <img class="card-img-top" src="../assets/person.png" alt="Card image">
                      </div>
                    </b-col>
                    <b-col>
                      <img
                        @click="personaapuntada(sitio,fech,destinos_deseados)"
                        class="card-img-top Plus"
                        src="../assets/add.png"
                        alt="Card image"
                      >
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
          </div>
          <b-row class="mb-3">
            <h2 class="Titulo">Este mes</h2>
          </b-row>
          <div v-for="sitio in este_mes" :key="sitio" class="contenido" v-if="sitio.base">
            <b-row>
              <div @click="mostrarfechas(sitio)">
                <b-col>
                  <div class="img">
                    <img class="card-img-top Foto" src="../C.jpg">
                  </div>
                </b-col>
              </div>
              <b-col>
                <div @click="mostrarfechas(sitio)">
                  <b-row>
                    <h3 class="Titulo">{{sitio.place}}</h3>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-row>{{sitio.pais}}</b-row>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>
            <div v-for="fech in sitio.date" :key="date" class="contenido2" v-if="sitio.fecham">
              <b-row  v-if="fech.camuflado">
                <b-col cols="4" class="Fecha"> {{fech.fecha}} </b-col>
                <b-col cols="1"> - </b-col>
                <b-col cols="4" class="Fecha"> {{fech.fecha_f}} </b-col>
                <b-col>
                  <b-row>
                    <b-col cols="1" class="margin"> {{fech.personas}} </b-col>
                    <b-col cols="1">
                      <div class="card">
                        <img class="card-img-top" src="../assets/person.png" alt="Card image">
                      </div>
                    </b-col>
                    <b-col>
                      <img
                        @click="personaapuntada(sitio,fech)"
                        class="card-img-top Plus"
                        src="../assets/add.png"
                        alt="Card image"
                      >
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
          </div>
          <b-row>
            <h2>Todos los viajes organizados</h2>
          </b-row>
          <div v-for="sitio in todo_organizado" :key="sitio" class="contenido" v-if="sitio.base">
            <b-row>
              <div @click="mostrarfechas(sitio)">
                <b-col>
                  <div class="img">
                    <img class="card-img-top Foto" src="../C.jpg">
                  </div>
                </b-col>
              </div>
              <b-col>
                <div @click="mostrarfechas(sitio)">
                  <b-row>
                    <h3 class="Titulo">{{sitio.place}}</h3>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-row>{{sitio.pais}}</b-row>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>
            <div v-for="fech in sitio.date" :key="date" class="contenido2" v-if="sitio.fecham">
              <b-row  v-if="fech.camuflado">
                <b-col cols="4" class="Fecha"> {{fech.fecha}} </b-col>
                <b-col cols="1"> - </b-col>
                <b-col cols="4" class="Fecha"> {{fech.fecha_f}} </b-col>
                <b-col>
                  <b-row>
                    <b-col cols="1" class="margin"> {{fech.personas}} </b-col>
                    <b-col cols="1">
                      <div class="card">
                        <img class="card-img-top" src="../assets/person.png" alt="Card image">
                      </div>
                    </b-col>
                    <b-col>
                      <img
                        @click="personaapuntada(sitio,fech)"
                        class="card-img-top Plus"
                        src="../assets/add.png"
                        alt="Card image"
                      >
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
        <b-col cols="6" id="proximos_viajes" class="w-100">
          <b-row>
            <h2 class="Titulo">Tus proximos viajes</h2>
          </b-row>
          <b-row>
            <div class="contenido" @click="cuestionario=true">
              <img  class="card-img-top Plus" src="../assets/add.png">
              Añade un viaje
            </div>
          </b-row>
          <div v-for="sitio in futuros_viajes" :key="sitio" class="contenido" v-if="sitio.base">
            <b-row>
              <div @click="mostrarfechas(sitio)">
                <b-col>
                  <div class="img">
                    <img class="card-img-top Foto" src="../C.jpg">
                  </div>
                </b-col>
              </div>
              <b-col>
                <div @click="mostrarfechas(sitio)">
                  <b-row>
                    <h3 class="Titulo">{{sitio.place}}</h3>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-row>{{sitio.pais}}</b-row>
                    </b-col>
                  </b-row>
                  <b-row>
                    <col>
                      <div class="card">
                        <img class="card-img-top" src="../assets/vije.png" alt="Card image">
                      </div>
                    </col>
                    <col class="avion">
                      {{sitio.numero_fechas}}
                    <col>
                  </b-row>
                </div>
              </b-col>
            </b-row>
            <div v-for="fech in sitio.date" :key="date" class="contenido2" v-if="sitio.fecham">
              <b-row  v-if="fech.camuflado">
                <b-col cols="4" class="Fecha"> {{fech.fecha}} </b-col>
                <b-col cols="1"> - </b-col>
                <b-col cols="4" class="Fecha"> {{fech.fecha_f}} </b-col>
                <b-col>
                  <b-row>
                    <b-col cols="1" class="margin"> {{fech.personas}} </b-col>
                    <b-col cols="1">
                      <div class="card">
                        <img class="card-img-top" src="../assets/person.png" alt="Card image">
                      </div>
                    </b-col>
                    <b-col>
                      <img
                        @click="personadesapuntada(sitio,fech)"
                        class="card-img-top Plus"
                        src="../assets/echis.png"
                        alt="Card image"
                      >
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
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
        aux: [

        ],

        aux2:[

        ],

        cuestionario:false,
        miembros:false,

        destinos_deseados: [],
        /*
				destinos_deseados: [
					{place: 'Andalucia', pais: 'España',numero_fechas:2,codigo:'3',base:true,fecham:false,date:[{añadir:false,members:["juan@g.com","david@g.com"],fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:5},{añadir:false,members:["julian@g.com","roman@g.com"],cantidad:true,camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:3}]},
          {place: 'Cantabria', pais: 'España',numero_fechas:2,codigo:'3',base:true,fecham:false,date:[{añadir:false,members:["juan@g.com","david@g.com"],fecha:' 3 de Marzo de 2019',fecha_f: '28 de Marzo de 2019', personas:3},{añadir:false,members:["juan@g.com","david@g.com"],cantidad:true,camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:3}]},
        ],*/

				este_mes: [
          {place: 'Andalucia', pais: 'España',numero_fechas:2,codigo:'3',base:true,fecham:false,date:[{añadir:false,members:["juan@g.com","david@g.com"],cantidad:true,camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:5},{añadir:false,members:["juan@g.com","david@g.com"],cantidad:true,camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:3}]},
          {place: 'Cantabria', pais: 'España',numero_fechas:2,codigo:'3',base:true,fecham:false,date:[{añadir:false,members:["juan@g.com","david@g.com"],cantidad:true,camuflado:false,fecha:' 3 de Marzo de 2019',fecha_f: '28 de Marzo de 2019', personas:3},{añadir:false,members:["juan@g.com","david@g.com"],cantidad:true,camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:3}]},
        ],

				todo_organizado: [
          {correcto:false,place: 'Venecia', pais: 'Italia',numero_fechas:2,fecham:false,base:true,codigo:'5',date:[{añadir:false,members:["juan@g.com","david@g.com"],camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:5},{añadir:false,members:["juan@g.com","david@g.com"],fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:3}]},
          {correcto:false,place: 'Oporto' ,pais: 'Portugal',numero_fechas:2,fecham:false,base:true,codigo:'6',date:[{añadir:false,members:["juan@g.com","david@g.com"],camuflado:false,fecha:' 3 de Marzo de 2019',fecha_f: '28 de Marzo de 2019', personas:3},{añadir:false,members:["juan@g.com","david@g.com"],fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:3}]},
        ],

        futuros_viajes: []
        /*
        futuros_viajes: [
          {place: 'Venecia', numero_fechas:2, fecham:false, base:true, date:[{camuflado:false,fecha:'27 de Marzo de 2019', fecha_f: '5 de Abril de 2019', personas:5}, {camuflado:false,fecha:' 27 de Marzo de 2019', fecha_f: '5 de Abril de 2019', personas:3}]},
          {place: 'Oporto' ,pais: 'Portugal',numero_fechas:2,fecham:false,base:true,codigo:'6',date:[{camuflado:false,fecha:' 3 de Marzo de 2019',fecha_f: '28 de Marzo de 2019', personas:3},{camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:3}]},
          {place: 'Andalucia', pais: 'España',numero_fechas:2,fecham:false,codigo:'3',base:true,date:[{camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:5},{cantidad:true,camuflado:false,fecha:' 27 de Marzo de 2019',fecha_f: '5 de Abril de 2019', personas:3}]},
        ]
        */
      }
    },

	methods: {

      cambiar_estado: function(objecto,vector){
        this.miembros=false;
      },

			personaapuntada: function(object,vector){
        this.aux2 =[];
        this.aux = [];
        this.aux2.push(object);
        this.aux.push(vector);
        this.miembros=true;
				vector.personas = vector.personas+1;
        var cont=0;
        object.numero_fechas = object.numero_fechas-1;
        vector.camuflado = !vector.camuflado;
				if (object.numero_fechas==0){
          object.base=!object.base;
          object.fecham=!object.fecham;
        }
        for(var i=0;i<this.futuros_viajes.length;i++){
          if(this.futuros_viajes[i].place==object.place){
            this.futuros_viajes[i].date.push({camuflado:false,fecha:vector.fecha,fecha_f:vector.fecha_f, personas:vector.personas});
            this.futuros_viajes[i].numero_fechas=this.futuros_viajes[i].numero_fechas+1;
            i=this.futuros_viajes.length;
          }else{
            cont++;
          }
        }
        if(cont==this.futuros_viajes.length){
           this.futuros_viajes.push({place:object.place,pais:'España',numero_fechas:1,fecham:false,base:true,codigo:object.codigo,date:[{camuflado:false,fecha:vector.fecha,fecha_f:vector.fecha_f, personas:vector.personas}]});
        }
      },

			personadesapuntada: function(object,vector){
        vector.personas = vector.personas-1;
        var cont=0;
        vector.camuflado = !vector.camuflado
        object.numero_fechas = object.numero_fechas-1;
        if (object.numero_fechas==0){
          object.base=!object.base;
          object.fecham=!object.fecham;
        }
        for(var i=0;i<this.todo_organizado.length;i++){
          if(this.todo_organizado[i].place==object.place){
            this.todo_organizado[i].date.push({camuflado:false,fecha:vector.fecha,fecha_f:vector.fecha_f, personas:vector.personas});
            this.todo_organizado[i].numero_fechas=this.todo_organizado[i].numero_fechas+1;
            i=this.todo_organizado.length;
          }else{
            cont++;
          }
        }
        if(cont==this.todo_organizado.length){
           this.todo_organizado.push({place:object.place,pais:'España',numero_fechas:1,fecham:false,base:true,codigo:object.codigo,date:[{camuflado:false,fecha:vector.fecha,fecha_f:vector.fecha_f, personas:vector.personas}]});
        }
      },

      nuevoviaje: async function(){
        var cont = 0;
        if ((this.place_!= undefined) && (this.fecha_!= undefined) && (this.fechaf_!= undefined)){
          this.cuestionario=!this.cuestionario;
          for(var i=0;i<this.futuros_viajes.length;i++){
            if(this.futuros_viajes[i].place==this.place_){
              this.futuros_viajes[i].date.push({camuflado:false,fecha:this.fecha_,fecha_f:this.fechaf_, personas:1});
              this.futuros_viajes[i].numero_fechas=this.futuros_viajes[i].numero_fechas+1;
              i=this.futuros_viajes.length;
            }else{
              cont++;
            }
          }
          if(cont==this.futuros_viajes.length){
            this.futuros_viajes.push({place:this.place_, numero_fechas:1, mostrar:false, base:true, camuflado:false, date:[{fecha:this.fecha_,fecha_f:this.fechaf_,personas:1}]});
          }
          //this.todo_organizado.push({place:this.place_,pais: 'España',numero_fechas:1,mostrar:false,base:true,camuflado:false,codigo:'9',date:[{fecha:this.fecha_,fecha_f:this.fechaf_, personas:1}]});
          //Creo que no deberia salir aqui, osea deberia añadise a todo organizado menos asi mismo no?
        }else{
          cont++;
        }
        try {
          var usermail = JSON.parse(localStorage.getItem("user")).mail
          await this.$http.post("http://localhost:8081/add_group/" + usermail +"/"+  this.place_ +"/"+ this.fecha_ +"/"+ this.fechaf_)
          .then(response => {
            console.log(response.data);
          });
        } catch(err) {}
      },
      
    

    mostrarfechas: function(object){
      object.fecham=!object.fecham;
      for (var i=0;i<object.date.length;i++){
        object.date[i].camuflado=!object.date[i].camuflado;
      }
    }
  },
  
  async mounted(){
    //if (localStorage.getItem("jwt") == null || localStorage.getItem("jwt") == "undefined"){
      //this.$router.push("/");
    //}

    try {
      await this.$http
        .get("http://localhost:8081/wished_groups/" + JSON.parse(localStorage.getItem("user")).mail )
        .then(response => {
          console.log(response.data);
          this.destinos_deseados = response.data;
        });

        await this.$http
        .get("http://localhost:8081/future_trips/" + JSON.parse(localStorage.getItem("user")).mail )
        .then(response => {
          console.log(response.data);
          this.futuros_viajes = response.data;
        });

        console.log("futuros viajes")
        console.log(this.futuros_viajes)
    } catch (err) {}
  },

  components: {}
};
</script>

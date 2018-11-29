<template>
	<b-row align-h="center"> 
		    <h2> Crear una cuenta </h2>
		    <b-form-input type="text" placeholder="Nombre" v-model="name"></b-form-input>
		    <b-form-input type="text" placeholder="E-mail" v-model="mail"></b-form-input>
		    <b-form-input type="text" placeholder="Contraseña" v-model="pass"></b-form-input>
            <b-form-input type="text" placeholder="Repita contraseña" v-model="pass_rep"></b-form-input>
		    <button type="submit" value="Crear" @click="get_credentials(name, mail, pass)" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Crear </button>

	</b-row>
</template>

        
<script>

    export default {
        
        data: function(){
            return {
                name_: "",
                mail_: "",
                pass_: "",
                pass_rep:""    
            };
        },
        
        
        methods: {
            get_credentials: function(name, mail, pass){
                this.name_ = name,
                this.mail_ = mail,
                this.pass_ = pass,
                this.pass_rep = pass_rep,
                
                alert(JSON.stringify(this.$data, null, 2));
            }
        }
    };
    
    
</script>

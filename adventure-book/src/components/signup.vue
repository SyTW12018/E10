<template>
    <span>
        <h2> Crear una cuenta </h2>
        <input type="text" placeholder="Nombre" v-model="name">
        <br>
        <input type="text" placeholder="E-mail" v-model="mail">
        <br>
        <input type="text" placeholder="Contraseña" v-model="pass">
        <br>
        <br>
        <input type="submit" value="Crear" @click="get_credentials(name, mail, pass)">
    </span>
</template>

        
<script>

    export default {
        
        data: function(){
            return {
                name_: "",
                mail_: "",
                pass_: "",    
            };
        },
        
        
        methods: {
            get_credentials: function(name, mail, pass){
                this.name_ = name,
                this.mail_ = mail,
                this.pass_ = pass,
                
                alert(JSON.stringify(this.$data, null, 2));
            }
        }
    };
    
    
</script>

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
        <button type="submit" class="btn btn-primary btn-block" style="margin-bottom:10px;" @click(name,mail,pass)> Crear </button>
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

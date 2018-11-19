<template>
    <span>
        <h2> Crear una cuenta </h2>
        <input type="text" placeholder="Nombre" v-model="name_">
        <br>
        <input type="text" placeholder="E-mail" v-model="mail_">
        <br>
        <input type="text" placeholder="Contraseña" v-model="pass_">
        <br>
        <input type="text" placeholder="Repita contraseña" v-model="pass_rep">
        <br>
        <br>
        <input type="submit" value="Iniciar Sesión" @click="handleSubmit">
    </span>
</template>

        
<script>

    export default {
        props: ["nextUrl"],
        data: function(){
            return {
                name_: "",
                mail_: "",
                pass_: "",
                pass_rep: ""    
            };
        },
        
        
        methods: {
            handleSubmit(e){
                e.preventDefault()
                if(this.pass_ == this.pass_rep && this.pass_.length > 0){
                    let url = "http://localhost:8081/registrar"
                    this.$http.post(url, {
                        name_: this.name_,
                        mail_: this.mail_,
                        pass_: this.pass_
                    })
                    .then(response => {
                        localStorage.setItem('user', JSON.stringify(response.data.user))
                        localStorage.setItem('jwt', response.data.token)

                        if(localStorage.getItem('jwt') != null){
                            this.$emit('loggedIn')
                            if(this.$route.params.nextUrl != null){
                                this.$router.push(this.$route.params.nextUrl)
                            }
                            else{
                                this.$router.push('/')
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }
                else{
                    this.pass_ = ""
                    this.pass_rep = ""

                    return alert("Las contraseñas no coinciden")
                }
            }
            
        }
    };
    
    
</script>

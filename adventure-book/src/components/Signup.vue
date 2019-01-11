<template>
	<b-row align-h="center">
		    <h2> Crear una cuenta </h2>
		    <b-form-input type="text" placeholder="e-mail" v-model="mail_"></b-form-input>
		    <b-form-input type="password" placeholder="contraseña" v-model="pass_"></b-form-input>
        <b-form-input type="password" placeholder="repite la contraseña" v-model="pass_rep"></b-form-input>
		    <button type="submit" value="Crear" @click="handleSubmit" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Crear </button>

	</b-row>
</template>


<script>

    export default {
        props: ["nextUrl"],
        data: function(){
            return {
                mail_: "",
                pass_: "",
                pass_rep: ""
            };
        },


        methods: {
            handleSubmit(e){
                e.preventDefault()
                if(this.pass_ == this.pass_rep && this.pass_.length > 0){
                    let url = "http://localhost:8081/signup";
                    this.$http.post(url, {
                        name: this.name_,
                        mail: this.mail_,
                        pass: this.pass_
                    })
                    .then(response => {
                        localStorage.setItem('user', JSON.stringify(response.data.user))

                        localStorage.setItem('jwt', response.data.token)

                        if(localStorage.getItem('jwt') != null){
                            this.$emit('loggedIn')
                            if(this.$route.params.nextUrl != null){
                                this.$router.push(this.$route.params.nextUrl);
                            }
                            else{
                                this.$router.push('/userboard');
                            }
                        }
                    })
                    .catch(err => {
                        console.error(err);
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

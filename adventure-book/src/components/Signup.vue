<style>
	.error{
		color: red;
	}
</style>

<template>
	<b-row align-h="center">
		    <h2> Crear una cuenta </h2>
		    <b-form-input type="text" placeholder="e-mail" v-model="mail_"></b-form-input>
		    <b-form-input type="password" placeholder="contraseña" v-model="pass_"></b-form-input>
        <b-form-input type="password" placeholder="repite la contraseña" v-model="pass_rep"></b-form-input>
		    <button type="submit" value="Crear" @click="handleSubmit" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Crear </button>
				<p class="error"> {{ error_ }} </p>
	</b-row>
</template>


<script>

    export default {
        props: ["nextUrl"],
        data: function(){
            return {
                name_: "",
                mail_: "",
                pass_: "",
                pass_rep: "",
								error_: "",
            };
        },

        methods: {
						validateEmail(email) {
						    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						    return re.test(String(email).toLowerCase());
						},

            handleSubmit(e){
                e.preventDefault();
								if(this.mail_ == "")
								{
									this.error_ = "Escribe un e-mail";
								}
								else if (!this.validateEmail(this.mail_))
								{
									this.error_ = "Formato de e-mail inválido";
								}
								else if (this.pass_ == "")
								{
									this.error_ = "Escribe una contraseña";
								}
								else if (this.pass_rep == "")
								{
									this.error_ = "Repite la contraseña";
								}
								else if (this.pass_rep != this.pass_)
								{
									this.error_ = "Las contraseñas no coinciden";
								}
                else{
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

            }

        }
    };


</script>

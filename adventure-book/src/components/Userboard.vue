<template>
    <div>
        <h1>Bienvenido al dashboard</h1>
        <h2>{{msg}}</h2>
    </div>
</template>

<script>
    export default{
        data: function(){
            return{
                msg: "mensajito",
                auth_: true
            }
        },
        mounted(){
            console.log("mounted: ")
            console.log(localStorage.getItem('jwt'))
            this.$http.post('http://localhost:8081/dashboard',{
                auth_: this.auth_,
                token_: localStorage.getItem('jwt')
            })
            .then( response => {
                var path = response.data.path
                this.$router.push(path)
            }
            )
        }

    }
</script>
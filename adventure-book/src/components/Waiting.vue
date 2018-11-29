<template>
    <div>
        <h1>WAITING</h1>
        <h2>{{msg}}</h2>
    </div>
</template>

<script>
    export default{
        data: function(){
            return{
                msg: "Estamos cargando el contenido"
            }
        },
        mounted(){
            console.log("mounted: ")
            console.log(localStorage.getItem('jwt'))
            this.$http.post('http://localhost:8081/waiting',{
                token: localStorage.getItem('jwt')
            })
            .then( response => {
                var path = response.data.path
                this.$router.push(path)
            }
            )
        }

    }
</script>
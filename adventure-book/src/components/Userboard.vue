<template>
    <div>
        <h1>Bienvenido al dashboard</h1>
        <h2>{{msg}}</h2>
        <button @click="log_out">LOG OUT</button>
    </div>
</template>

<script>
    export default{
        data: function(){
            return{
                msg: "mensajito"
            }
        },
        methods:{
            log_out(){
                window.localStorage.clear()
                this.$router.push('/')
            }
        },

        mounted(){
            if((localStorage.getItem('jwt') == null) || (localStorage.getItem('jwt') == 'undefined')){
                this.$router.push('/')
            }
        }


    }
</script>
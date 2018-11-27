<template>
    <div>
        <h1>Bienvenido al dashboard</h1>
        <h2>{{user_data}}</h2>
        <button @click="log_out">LOG OUT</button>
    </div>
</template>

<script>
    export default{
        data: function(){
            return{
                user_data: JSON.parse(localStorage.getItem('user')).name
            }
        },
        methods:{
            log_out(){
                window.localStorage.clear()
                this.$router.push('/')
            }
        },

        mounted(){
            console.log("mounted in dashboard: ")
            console.log(localStorage.getItem('jwt'))
            if((localStorage.getItem('jwt') == null) || (localStorage.getItem('jwt') == 'undefined')){
                this.$router.push('/')
            }
            this.$http.post('http://localhost:8081/dashboard',{
                user_: JSON.parse(localStorage.getItem('user'))._id
            })
            .then( response => {
                this.user_data = response.data
            }
            )
        }


    }
</script>
import {shallowMount} from '@vue/test-utils'
import Login from '../src/components/Login.vue'

describe("Login.vue", () => {
    it('testing message of iniciar sesión', () => {
        const wrapper = shallowMount(Login)
        //find busca por etiqueta html o css
        const msg = wrapper.find('h2').text();
        //debugger;
        expect(msg).toBe('Iniciar Sesión');
    })

    it('testing the instance', () => {
        const wrapper = shallowMount(Login)
        //con vm accedemos a la instancia de vue, es decir, podemos acceder al "data, method, etc." del componente
        expect(wrapper.vm.mail_).toBe("pepe@gmail.com")

        wrapper.vm.change_mail("jc@gmail.com") //cambiamos el mail usando el método del componente utilizado para ello
        expect(wrapper.vm.mail_).toBe("jc@gmail.com")
        //debugger;
    })
})
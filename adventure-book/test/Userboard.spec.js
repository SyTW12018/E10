import {shallowMount} from '@vue/test-utils'
import {mount} from '@vue/test-utils'
import Userboard from '../src/components/Userboard.vue'


describe("Userboard.vue", () => {
    
    it('testing the username', () => {        
        const wrapper = mount(Userboard, {sync: false});
        wrapper.setData({user_:"jc"})
        expect(wrapper.vm.user_).toBe("jc")        
    })

    it('testing the sitios_visitados', () => {        
        const wrapper = mount(Userboard, {sync: false});
        wrapper.setData({sitios_visitados:
            [
                {nombre:"ANDALUCIA", descripcion:"La tierra del sur", sitios:[] },
                {nombre:"CANARIAS", descripcion:"Las islas afortunadas", sitios:[] }
            ]
        })    
        expect(wrapper.vm.sitios_visitados[1].nombre).toBe("CANARIAS")        
    })

    it('testing the logout', () => {        
        const wrapper = shallowMount(Userboard);
        wrapper.setData({mail:"jc@gmail.com", user_:"jc", name:"juanca"})
        expect(wrapper.vm.mail).toBe("jc@gmail.com")
        expect(wrapper.vm.user_).toBe("jc")
        expect(wrapper.vm.name).toBe("juanca")
        debugger;
        wrapper.vm.log_out();        
        expect(wrapper.vm.mail).toBe("")
        expect(wrapper.vm.user_).toBe("")
        expect(wrapper.vm.name).toBe("hola")
    })
})
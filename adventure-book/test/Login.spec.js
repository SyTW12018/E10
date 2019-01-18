import {shallowMount} from '@vue/test-utils'
import Login from '../src/components/Login.vue'

describe("Login", () => {
    it('testing login', () => {
        const wrapper = shallowMount(Login)
        const msg = wrapper.find('h2').text();
        debugger;
        expect(msg).toBe('Iniciar Sesión');
    })
})
import { describe, it, expect } from "vitest"
import { mount } from '@vue/test-utils'
import Ball from './Ball.vue'

describe('Ball', () => {
    it('renders the number', () => {
        const wrapper = mount(Ball, {
            props: { number: 42 }
        })

        expect(wrapper.text()).toContain('42')
    })

    it('has "drawn" class when drawn prop si true', () => {
        const wrapper = mount(Ball, {
            props: { number: 42, drawn: true }
        })

        expect(wrapper.classes()).toContain('drawn')
    })

    it('has "not-drawn" class when drawn prop is false', () => {
        const wrapper = mount(Ball, {
            props: { number: 42 }
        })
        expect(wrapper.classes()).toContain('not-drawn')
    })

    it('emits "click" when clicked and not drawn', async () => {
        const wrapper = mount(Ball, {
            props: { number: 42, drawn: false }
        })

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('does not emit "click" when clicked and already drawned', async () => {
        const wrapper = mount(Ball, {
            props: { number: 42, drawn: true }
        })

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')).toBeUndefined()
    })
})

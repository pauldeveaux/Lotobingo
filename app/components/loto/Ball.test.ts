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

    it('has "is-drawn" class when drawn prop is true', () => {
        const wrapper = mount(Ball, {
            props: { number: 42, drawn: true }
        })

        expect(wrapper.classes()).toContain('is-drawn')
    })

    it('has "is-active" class when drawn prop is false', () => {
        const wrapper = mount(Ball, {
            props: { number: 42 }
        })
        expect(wrapper.classes()).toContain('is-active')
    })

    it('does not have "is-active" when drawn', () => {
        const wrapper = mount(Ball, {
            props: { number: 42, drawn: true }
        })
        expect(wrapper.classes()).not.toContain('is-active')
    })

    it('does not have "is-drawn" when not drawn', () => {
        const wrapper = mount(Ball, {
            props: { number: 42, drawn: false }
        })
        expect(wrapper.classes()).not.toContain('is-drawn')
    })

    it('emits "click" when clicked and not drawn', async () => {
        const wrapper = mount(Ball, {
            props: { number: 42, drawn: false }
        })

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('emits the number value on click', async () => {
        const wrapper = mount(Ball, {
            props: { number: 7, drawn: false }
        })

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')![0]).toEqual([7])
    })

    it('does not emit "click" when clicked and already drawn', async () => {
        const wrapper = mount(Ball, {
            props: { number: 42, drawn: true }
        })

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')).toBeUndefined()
    })

    describe('config prop', () => {
        it('has "is-hoverable" and "is-clickable" by default', () => {
            const wrapper = mount(Ball, {
                props: { number: 1 }
            })

            expect(wrapper.classes()).toContain('is-hoverable')
            expect(wrapper.classes()).toContain('is-clickable')
        })

        it('does not have "is-hoverable" when config.hoverable is false', () => {
            const wrapper = mount(Ball, {
                props: { number: 1, config: { hoverable: false, clickable: true } }
            })

            expect(wrapper.classes()).not.toContain('is-hoverable')
        })

        it('does not have "is-clickable" when config.clickable is false', () => {
            const wrapper = mount(Ball, {
                props: { number: 1, config: { hoverable: true, clickable: false } }
            })

            expect(wrapper.classes()).not.toContain('is-clickable')
        })

        it('does not emit click when config.clickable is false', async () => {
            const wrapper = mount(Ball, {
                props: { number: 1, config: { hoverable: true, clickable: false } }
            })

            await wrapper.trigger('click')

            expect(wrapper.emitted('click')).toBeUndefined()
        })
    })

    describe('volume prop', () => {
        it('has "has-volume" class when volume is true', () => {
            const wrapper = mount(Ball, {
                props: { number: 1, volume: true }
            })

            expect(wrapper.classes()).toContain('has-volume')
        })

        it('does not have "has-volume" class by default', () => {
            const wrapper = mount(Ball, {
                props: { number: 1 }
            })

            expect(wrapper.classes()).not.toContain('has-volume')
        })

        it('renders shine element when volume is true', () => {
            const wrapper = mount(Ball, {
                props: { number: 1, volume: true }
            })

            expect(wrapper.find('.shine').exists()).toBe(true)
        })

        it('does not render shine element when volume is false', () => {
            const wrapper = mount(Ball, {
                props: { number: 1, volume: false }
            })

            expect(wrapper.find('.shine').exists()).toBe(false)
        })
    })

    describe('accessibility', () => {
        it('has role="button" when clickable', () => {
            const wrapper = mount(Ball, {
                props: { number: 1 }
            })

            expect(wrapper.attributes('role')).toBe('button')
        })

        it('has role="img" when not clickable', () => {
            const wrapper = mount(Ball, {
                props: { number: 1, config: { hoverable: false, clickable: false } }
            })

            expect(wrapper.attributes('role')).toBe('img')
        })

        it('has tabindex=0 when clickable and not drawn', () => {
            const wrapper = mount(Ball, {
                props: { number: 1, drawn: false }
            })

            expect(wrapper.attributes('tabindex')).toBe('0')
        })

        it('has tabindex=-1 when drawn', () => {
            const wrapper = mount(Ball, {
                props: { number: 1, drawn: true }
            })

            expect(wrapper.attributes('tabindex')).toBe('-1')
        })

        it('has aria-label with the number', () => {
            const wrapper = mount(Ball, {
                props: { number: 55 }
            })

            expect(wrapper.attributes('aria-label')).toBe('Bingo ball number 55')
        })

        it('emits click on Enter key when not drawn', async () => {
            const wrapper = mount(Ball, {
                props: { number: 10, drawn: false }
            })

            await wrapper.trigger('keydown.enter')

            expect(wrapper.emitted('click')).toHaveLength(1)
        })

        it('emits click on Space key when not drawn', async () => {
            const wrapper = mount(Ball, {
                props: { number: 10, drawn: false }
            })

            await wrapper.trigger('keydown.space')

            expect(wrapper.emitted('click')).toHaveLength(1)
        })

        it('does not emit click on Enter key when drawn', async () => {
            const wrapper = mount(Ball, {
                props: { number: 10, drawn: true }
            })

            await wrapper.trigger('keydown.enter')

            expect(wrapper.emitted('click')).toBeUndefined()
        })
    })

    it('sets data-number attribute', () => {
        const wrapper = mount(Ball, {
            props: { number: 33 }
        })

        expect(wrapper.attributes('data-number')).toBe('33')
    })
})

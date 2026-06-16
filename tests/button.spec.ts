import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { BzButton } from '../packages/components'

describe('BzButton', () => {
  it('renders label text', () => {
    const wrapper = mount(BzButton, {
      props: {
        label: 'Hello'
      }
    })

    expect(wrapper.text()).toContain('Hello')
  })

  it('emits click event when enabled', async () => {
    const wrapper = mount(BzButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(BzButton, {
      props: {
        disabled: true
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('installs component on app', () => {
    const app = {
      component: vi.fn()
    }

    BzButton.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('BzButton', BzButton)
  })
})

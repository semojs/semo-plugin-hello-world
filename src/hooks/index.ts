import { Utils } from '@semo/core'
import { getInspiration } from '../common/inspiration'

export const hook_hook = new Utils.Hook('semo', {
  hi: 'Set how to say hi.',
  greeting: 'Set your own hello world greeting.',
  inspirations: 'Set your own inspiration.'
})

// Other modules can hook this plugin to change everything.
// export const hook_hello_world_hi = false
// export const hook_hello_world_greeting = false
// export const hook_hello_world_inspirations = false

export const hook_repl = new Utils.Hook('semo', () => {
  return {
    hello_world: { getInspiration }
  }
})
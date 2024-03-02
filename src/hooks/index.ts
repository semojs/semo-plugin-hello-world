import { UtilsType } from '@semo/core'
import { getInspiration } from '../common/inspiration'

export default (Utils: UtilsType) => {
  const hook_hook = new Utils.Hook('semo', {
    hi: 'Set how to say hi.',
    greeting: 'Set your own hello world greeting.',
    inspirations: 'Set your own inspiration.',
  })

  // Other modules can hook this plugin to change everything.
  // const hook_hello_world_hi = new Utils.Hook('semo-plugin-hello-world', {})
  // const hook_hello_world_greeting = new Utils.Hook('semo-plugin-hello-world', {})
  // const hook_hello_world_inspirations = new Utils.Hook('semo-plugin-hello-world', {})

  const hook_repl = new Utils.Hook('semo', () => {
    return {
      hello_world: { getInspiration },
    }
  })

  return {
    hook_hook,
    hook_repl,
  }
}

import { getInspiration } from '../common/inspiration.js'

export const hook_hook = {
  semo: () => {
    return {
      hi: 'Set how to say hi.',
      greeting: 'Set your own hello world greeting.',
      inspirations: 'Set your own inspiration.',
    }
  },
}

export const hook_repl = {
  semo: () => {
    return {
      hello_world: { getInspiration },
    }
  },
}

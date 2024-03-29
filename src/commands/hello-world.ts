import boxen from 'boxen'
import path from 'path'

import { getInspiration } from '../common/inspiration'

export const plugin = 'hello-world'
export const disabled = false // Set to true to disable this command temporarily
export const command = 'hello-world'
export const desc = 'Say something to the world and yourself everyday.'
export const aliases = 'hi'
// export const middleware = (argv) => {}

export const builder = function (yargs: any) {
  yargs.option('lang', {
    describe: 'Set language for this hello world.',
    choices: ['en_US', 'zh_CN'],
  })
  yargs.option('inspiration-type', {
    describe: 'Set inpiration type.',
    choices: ['cn', 'en', 'it', 'poison', 'rule'],
  })
  yargs.option('clean', { describe: 'No box, no color.' })
  yargs.option('simple', { describe: 'Just include inspiration' })
  // yargs.commandDir('hello-world')
}

export const handler = async function (argv: any) {
  const { Utils } = argv.$semo
  const lang = Utils.pluginConfig('lang', Utils.yargs.locale() || 'en_US')
  const inspirationType = Utils.pluginConfig(
    'inspirationType',
    lang === 'en_US' ? 'en' : 'cn'
  )
  const clean = Utils.pluginConfig('clean', false)

  // Prepare data
  const vars: any = {}
  const currentUser = Utils.shell.exec('whoami', { silent: true }).stdout.trim()

  const greeting = await Utils.invokeHook('semo-plugin-hello-world:greeting', {
    mode: 'replace',
  })
  const hi = await Utils.invokeHook('semp-plugin-hello-world:hi', {
    mode: 'replace',
  })
  let date, time
  switch (lang) {
    case 'en_US':
      date = Utils.day().format('YYYY-MM-DD')
      time = Utils.day().format('hh:mm, a')

      vars.hi = Boolean(hi) ? `Hi ${currentUser},` : ''
      vars.greeting = Boolean(greeting)
        ? '\n' +
          (greeting ||
            `Today is ${date}, Now is ${time}. I wish you have a happy day today! Here is an inspiration for you:`)
        : ''
      break
    case 'zh_CN':
      date = Utils.day().format('YYYY年M月D日')
      time = Utils.day()
        .format('ah点m分')
        .replace('am', '上午')
        .replace('pm', '下午')

      vars.hi = Boolean(hi) ? `你好，${currentUser} 同学：` : ''
      vars.greeting = Boolean(greeting)
        ? '\n' +
          (greeting ||
            `今天是${date}, 现在是${time}, 祝你今天一天都有好心情！看看下面一句话是否对你有所启发：`)
        : ''
      break
    default:
      Utils.error(`${argv.lang} language not supported`)
      return
  }

  vars.inspiration = await getInspiration(inspirationType)
  vars.inspiration =
    vars.inspiration && vars.inspiration.said
      ? `\n${vars.inspiration.who ? vars.inspiration.who + ': ' : ''}${
          vars.inspiration.said
        }`
      : ''

  if (!vars.hi && !vars.greeting && !vars.inspiration) {
    Utils.warn(
      'This command is disabled by you, you can enable one of the three hooks to re-enable this command.'
    )
    return
  }

  if (!clean) {
    // Add color
    Object.keys(vars).forEach(key => {
      if (Utils._.isString(vars[key])) {
        vars[key] = Utils.chalk.cyan.bold(vars[key])
      } else if (Utils._.isObject(vars[key])) {
        Object.keys(vars[key]).forEach(childKey => {
          vars[key][childKey] = Utils.chalk.cyan.bold(vars[key][childKey])
        })
      }
    })
  }

  if (argv.simple) {
    console.log(vars.inspiration)
  } else {
    const template = Utils.fs.readFileSync(
      path.resolve(__dirname, '../../resources/templates', lang + '.tpl')
    )

    Utils._.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const compiled = Utils._.template(template)
    const result = compiled(vars).trim()
    console.log(clean ? result : boxen(result, { padding: 1 }))
  }
}

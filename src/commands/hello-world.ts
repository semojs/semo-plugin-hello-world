import boxen from 'boxen'
import path from 'path'
import shell from 'shelljs'
import dayjs from 'dayjs'
import { Argv, ArgvExtraOptions, error, warn } from '@semo/core'
import _ from 'lodash'
import chalk from 'chalk'

import { getInspiration } from '../common/inspiration.js'
import { readFileSync } from 'fs'

import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const plugin = 'hello-world'
export const disabled = false // Set to true to disable this command temporarily
export const command = 'hello-world'
export const desc = 'Say something to the world and yourself everyday.'
export const aliases = 'hi'

export const builder = function (yargs: Argv) {
  yargs.option('lang', {
    describe: 'Set language for this hello world.',
    choices: ['en_US', 'zh_CN'],
  })
  yargs.option('inspiration-type', {
    describe: 'Set inpiration type.',
    choices: ['cn', 'en', 'it', 'poison', 'rule'],
    alias: 'type',
  })
  yargs.option('clean', { describe: 'No box, no color.' })
  yargs.option('simple', { describe: 'Just include inspiration' })
}

export const handler = async function (
  argv: Required<ArgvExtraOptions> & { [key: string]: any }
) {
  const supportedLangs = ['en_US', 'zh_CN']
  const detectedLocale = argv.$yargs.locale()
  const lang = argv.$core.getPluginConfig(
    'lang',
    supportedLangs.includes(detectedLocale) ? detectedLocale : 'en_US'
  )
  const inspirationType = argv.$core.getPluginConfig(
    'inspirationType',
    lang === 'en_US' ? 'en' : 'cn'
  )
  const clean = argv.$core.getPluginConfig('clean', false)

  // Prepare data
  const vars: any = {}
  const currentUser = shell.exec('whoami', { silent: true }).stdout.trim()
  const greeting = await argv.$core.invokeHook(
    'semo-plugin-hello-world:greeting',
    {
      mode: 'replace',
    }
  )
  const hi = await argv.$core.invokeHook('semp-plugin-hello-world:hi', {
    mode: 'replace',
  })
  let date: string, time: string
  switch (lang) {
    case 'en_US':
      date = dayjs().format('YYYY-MM-DD')
      time = dayjs().format('hh:mm, a')

      vars.hi = Boolean(hi ?? true) ? `Hi ${currentUser},` : ''
      vars.greeting = Boolean(greeting ?? true)
        ? '\n' +
          (greeting ||
            `Today is ${date}, Now is ${time}. I wish you have a happy day today! Here is an inspiration for you:`)
        : ''
      break
    case 'zh_CN':
      date = dayjs().format('YYYY年M月D日')
      time = dayjs()
        .format('ah点m分')
        .replace('am', '上午')
        .replace('pm', '下午')

      vars.hi = Boolean(hi ?? true) ? `你好，${currentUser} 同学：` : ''
      vars.greeting = Boolean(greeting ?? true)
        ? '\n' +
          (greeting ||
            `今天是${date}, 现在是${time}, 祝你今天一天都有好心情！看看下面一句话是否对你有所启发：`)
        : ''
      break
    default:
      error(`${lang} language not supported`)
      return
  }

  vars.inspiration = await getInspiration(argv, inspirationType)
  vars.inspiration =
    vars.inspiration && vars.inspiration.said
      ? `\n${vars.inspiration.who ? vars.inspiration.who + ': ' : ''}${
          vars.inspiration.said
        }`
      : ''

  if (!vars.hi && !vars.greeting && !vars.inspiration) {
    warn(
      'This command is disabled by you, you can enable one of the three hooks to re-enable this command.'
    )
    return
  }
  if (!clean) {
    // Add color
    Object.keys(vars).forEach((key) => {
      if (_.isString(vars[key])) {
        vars[key] = chalk.cyan.bold(vars[key])
      } else if (_.isObject(vars[key])) {
        Object.keys(vars[key]).forEach((childKey) => {
          vars[key][childKey] = chalk.cyan.bold(vars[key][childKey])
        })
      }
    })
  }

  if (argv.simple) {
    console.log(vars.inspiration)
  } else {
    const template = readFileSync(
      path.resolve(__dirname, '../../resources/templates', lang + '.tpl'),
      'utf8'
    )

    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const compiled = _.template(template)
    const result = compiled(vars).trim()
    console.log(clean ? result : boxen(result, { padding: 1 }))
  }
}

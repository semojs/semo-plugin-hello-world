import { readFileSync } from 'fs'
import path from 'path'
import yaml from 'yaml'
import _ from 'lodash'
import { ArgvExtraOptions } from '@semo/core'

import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getInspiration = async (
  argv: Required<ArgvExtraOptions> & { [key: string]: any },
  inspirationType = 'cn'
) => {
  let inspirations = await argv.$core.invokeHook(
    'semo-plugin-hello-world:inspirations',
    { mode: 'replace' }
  )
  if (
    !inspirations &&
    (!inspirations || (inspirations as string[]).length === 0)
  ) {
    const insprationFileRead = readFileSync(
      path.resolve(
        __dirname,
        '../../resources/inspirations',
        inspirationType + '.yml'
      ),
      'utf8'
    )
    inspirations = yaml.parse(insprationFileRead)
  }

  const inspiration =
    inspirations && (inspirations as string[]).length > 0
      ? inspirations[
          Math.floor(Math.random() * (inspirations as string[]).length)
        ]
      : ''
  const ret =
    inspiration && _.isString(inspiration) ? { said: inspiration } : inspiration

  return ret
}

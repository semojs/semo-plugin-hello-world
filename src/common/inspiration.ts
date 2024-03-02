import { Utils } from '@semo/core'
import path from 'path'

export const getInspiration = async (inspirationType = 'cn') => {
  let inspirations = await Utils.invokeHook<string[] | undefined>(
    'semo-plugin-hello-world:inspirations',
    { mode: 'replace' }
  )
  if (
    !inspirations &&
    (!inspirations || (inspirations as string[]).length === 0)
  ) {
    const insprationFileRead = Utils.fs.readFileSync(
      path.resolve(
        __dirname,
        '../../resources/inspirations',
        inspirationType + '.yml'
      ),
      'utf8'
    )
    inspirations = Utils.yaml.parse(insprationFileRead)
  }

  let inspiration =
    inspirations && inspirations.length > 0
      ? inspirations[Math.floor(Math.random() * inspirations.length)]
      : ''
  let ret =
    inspiration && Utils._.isString(inspiration)
      ? { said: inspiration }
      : inspiration

  return ret
}

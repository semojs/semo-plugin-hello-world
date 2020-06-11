semo-plugin-hello-world
------------------------

This is the hello world plugin for [Semo](https://semo.js.org), it is just for fun, and is the showcase of what Semo plugin looks like.

## Usage

```sh
npm install -g @semo/cli
semo run hello-world
```

You don't need to download the plugin by using `npm install`, but `semo run` helps you to do that.

OK, you can download the plugin by using `npm install`

```sh
npm install -g semo-plugin-hello-world
semo hello-world
```

## Options

**--lang**: For now, it only support `en_US` and `zh_CN`.
**--inspiration-type**, For now, it only support `en`, `cn`, `it`, `poison`, and `rule`.

## Extension

Change and set default behavior of the command

```
semo config semo-plugin-hello-world.lang cn
semo config semo-plugin-hello-world.lang it
```

You can use hooks to change the command output. The template is:

```html
{{ hi }}
{{ greeting }}
{{ inspiration }}
```

You can change then using these hooks in your global Semo plugins.

```js
exports.hook_hello_world_hi = async () => {}
exports.hook_hello_world_greeting = async () => {}
exports.hook_hello_world_inspirations = async () => {}
```

The last inspirations hook need to return an Array of sentences, and than output randomly by the command core.

## The inspirations format

In core, we use yml to define inspriation and there are 2 format supported:

```yml
- who: somebody
  said: something
```

or

```yml
- something --somebody
```

The first format may provide more formated output, but now, the last format is easy to use, so if you hook inspirations, you can just return sentences array.

## Contribution

There must be typos need to be fixed, and we need more inspiration types and more good inspirations.

If you have any ideas about this plugin, please create issues or push PR to us.

## License

MIT

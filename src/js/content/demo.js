content.demo = (() => {
  const registry = {}

  return {
    all: () => ({...registry}),
    register: function (demo) {
      demo = content.demo.base.extend(demo)
      registry[demo.id] = demo
      return demo
    },
  }
})()

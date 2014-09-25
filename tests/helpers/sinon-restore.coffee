sinonRestore = (methods...) ->
	for method in methods
		if method && method.restore
			method.restore()

`export default sinonRestore;`

build: node_modules

node_modules: package.json
	npm install

distclean:
	rm -rf node_modules

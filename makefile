build: node_modules src/*
	npm run-script build

node_modules: package.json
	npm install

package: clean node_modules
	npm run-script package

clean:
	rm -rf build js

distclean: clean
	rm -rf node_modules tools

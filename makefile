build: node_modules src/*
	npm run-script build

node_modules: package.json
	npm install

package: node_modules
	npm run-script package

clean:
	rm -rf build js

distclean:
	rm -rf build js node_modules

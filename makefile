build: node_modules src/*
	babel src/ -d js/

watch: node_modules
	babel --watch src/ -d js/

node_modules: package.json
	npm install

dev: node_modules
	npm install -g asar, babel

package: node_modules
	npm run-script package

clean:
	rm -rf build js

distclean:
	rm -rf build js node_modules tools

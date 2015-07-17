build: node_modules src/*
	jsx src/ build/

watch: node_modules
	jsx --watch src/ build/

node_modules: package.json
	npm install

dev:
	npm install -g react-tools

clean:
	rm -rf build

distclean:
	rm -rf build node_modules

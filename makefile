build:
	python setup.py build

dev:
	python setup.py develop

upload:
	python setup.py sdist upload

lint:
	flake8 --max-complexity 14 --show-source apollo

bundle:
	pyinstaller apollo.spec

clean:
	rm -rf build dist README MANIFEST apollo.egg-info

hooks:
	cp -r .hooks/* .git/hooks/

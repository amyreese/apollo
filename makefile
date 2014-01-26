build:
	python setup.py build

dev:
	python setup.py develop

upload:
	python setup.py sdist upload

lint:
	flake8 --max-complexity 10 --show-source spacedock

bundle: clean
	pyinstaller spacedock.spec

clean:
	rm -rf build dist README MANIFEST spacedock.egg-info

hooks:
	cp -r .hooks/* .git/hooks/

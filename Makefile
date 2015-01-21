.PHONY: all deploy run freeze

SRC=mgweb

VENV=./venv
BINUTILS=$(VENV)/bin

PIP=$(BINUTILS)/pip

PROD_REMOTE=prod
PROD_BRANCH=master

all: run

deps: $(VENV)
	$(BINUTILS)/pip install -r requirements.txt

freeze: $(VENV)
	$(PIP) freeze >| requirements.txt

deploy: stylecheck
	git push $(PROD_REMOTE) $(PROD_BRANCH)

run:
	$(BINUTILS)/gunicorn app:app

stylecheck: *.py deps
	$(BINUTILS)/pep8 *.py $(SRC)

$(VENV):
	virtualenv $@

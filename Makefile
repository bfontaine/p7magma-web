.PHONY: all deploy run freeze

SRC=mgweb

VENV=./venv
BINUTILS=$(VENV)/bin

PIP=$(BINUTILS)/pip

STAGE_BRANCH=staging

PROD_REMOTE=prod
PROD_REMOTE_BRANCH=master

all: run

deps: $(VENV)
	$(BINUTILS)/pip install -r requirements.txt

freeze: $(VENV)
	$(PIP) freeze >| requirements.txt

stage:
	git checkout $(STAGE_BRANCH) && \
	git rebase master && \
	git checkout @{-1}

deploy: stylecheck
	git checkout $(STAGE_BRANCH) && \
	git push $(PROD_REMOTE) $(PROD_REMOTE_BRANCH) && \
	git checkout @{-1}

run:
	$(BINUTILS)/gunicorn app:app

stylecheck: *.py deps
	$(BINUTILS)/pep8 *.py $(SRC)

$(VENV):
	virtualenv $@

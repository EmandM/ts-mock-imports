test:
	npm test

build:
	npm run build

check-next-version:
	npm version --no-commit-hooks --no-git-tag-version patch
	git reset --hard

test-next-version:
	npm pack

pack: test-next-version

RED := $(shell tput setaf 196)
RESET := $(shell tput setaf 15)

release: build test-next-version check-next-version
	echo "${RED}!! Run Release and Publish Github Action !!${RESET}"

publish: release

#!/bin/bash

# Simple script to check that TypesScript and Flow type definitions work as expected.

# Run in the root folder, paths will be relative to it
script_dir=$(dirname "$0")
cd "$script_dir/.." 

should_update=0

while getopts "u" opt; do
  case "$opt" in
    u)  should_update=1
      ;;
  esac
done

# Check TypeScript types
typescript_new=$(npx tsc --project "$script_dir/tsconfig.json")
echo "Changes to the TypeScript output:"
diff -u ./typings-test/typescript.test-output.txt <(echo "$typescript_new")
typescript_result=$?

# Check Flow types
flow_new=$(cd typings-test && npx flow check)
echo "Changes to the Flow output:"
diff -u ./typings-test/flowtype.test-output.txt <(echo "$flow_new")
flow_result=$?

set -e

if [ $typescript_result -ne 0 ] || [ $flow_result -ne 0 ]; then
	if [ $should_update -eq 1 ]; then
		echo "Updating test output files"
		echo "$typescript_new" > ./typings-test/typescript.test-output.txt
		echo "$flow_new" > ./typings-test/flowtype.test-output.txt
		echo "See git diff to inspect changes, and commit them once ready."
		exit 0
  fi

	echo "TypeScript or Flow definitions, or their tests, have diverged."
	echo "Either fix the definitions or tests to match current saved test output, or"
	echo "run $0 -u to update the saved test output."
	exit 1
else
	echo "TypeScript and Flow definitions are OK."
	exit 0
fi

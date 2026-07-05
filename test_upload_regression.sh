#!/bin/bash
echo "Testing cleanup regression..."

rm -f uploads/*.doc
rm -f uploads/regression_dummy.doc

echo "dummy" > regression_dummy.doc

node server.js > /dev/null 2>&1 &
SERVER_PID=$!

sleep 3

curl -s -F "documents=@regression_dummy.doc" http://localhost:3001/api/upload > /dev/null

DOC_COUNT=$(ls -1 uploads/*.doc 2>/dev/null | wc -l)

if [ "$DOC_COUNT" -gt 0 ]; then
    echo "❌ REGRESSION TEST FAILED: Temporary .doc file was not cleaned up!"
else
    echo "✅ REGRESSION TEST PASSED: Temporary .doc file was successfully cleaned up."
fi

kill $SERVER_PID
rm -f regression_dummy.doc

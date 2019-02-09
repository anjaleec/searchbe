# SEARCHBE

# Testcase Around Result Ranking Criteria

The testcases for the result ranking criteria is stored in the xlsx file "testcasesForInstantSearch.xlsx"

# Steps for Deployment
1. git clone the project
2. cd to the project directory
3. run the command: forever start index.js (need npm forever installed for this) OR node index.js
4. Fire up Postman & hit "localhost:3213/search" with method get & header "searchterm:nin" where nin is the search term (search term can be of your wish).


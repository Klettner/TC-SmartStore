import * as shell from "shelljs"

// Copy all the assets files
shell.mkdir("-p", "dist/graphQL/")
shell.cp("-R", "src/graphQL/schema", "dist/graphQL/schema")
import { execSync } from 'child_process'
import { sync } from 'glob'

const files = sync('src/**/*.spec.ts')

if (!files.length) process.exit(1)

execSync(`node --loader ts-node/esm --test ${files.join(' ')}`, { stdio: 'inherit' })

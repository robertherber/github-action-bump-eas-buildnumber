import * as core from '@actions/core'
import fs from 'fs'
import detectIndent from 'detect-indent'
import {bumpAndroid, bumpIOS} from './utils'
import {Config} from './types'

async function run(): Promise<void> {
  try {
    const filepath: string = core.getInput('filepath')
    const platformsStr: string = core.getInput('platforms')

    core.debug(`Looking for app.json at '${filepath}'`)

    const jsonStr = fs.readFileSync(filepath, 'utf-8')

    const indentInfo = detectIndent(jsonStr)
    const indent = indentInfo.indent || '    '

    core.debug(`Detected indent: ${indentInfo.amount} ${indentInfo.type}`)

    const json = JSON.parse(jsonStr) as Config

    core.debug(jsonStr)

    const platforms = platformsStr.toLowerCase().split(',') as (
      | 'android'
      | 'ios'
    )[]

    core.debug(`Platforms to process: ${platforms.join(',')}`)

    if (platforms.includes('android')) {
      const versionCode = bumpAndroid(json)
      core.debug(`Bump android versionCode to ${versionCode}`)
      core.setOutput('versioncode', versionCode)
    }

    if (platforms.includes('ios')) {
      const nextBuildNumber = bumpIOS(json)
      core.debug(`Bumping android versionCode to ${nextBuildNumber}`)
      core.setOutput('buildnumber', nextBuildNumber)
    }

    const output = JSON.stringify(json, null, indent)

    core.debug(`Saving app.json`)
    core.debug(output)

    fs.writeFileSync(filepath, output)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

import * as core from '@actions/core'
import fs from 'fs'
import {wait} from './wait'
import detectIndent from 'detect-indent'

async function run(): Promise<void> {
  try {
    const filepath: string = core.getInput('filepath')
    const platformsStr: string = core.getInput('platforms')

    const platforms = platformsStr.toLowerCase().split(',') as (
      | 'android'
      | 'ios'
    )[]

    const jsonStr = fs.readFileSync(filepath, 'utf-8')

    const indent = detectIndent(jsonStr).indent || '    '

    const json = JSON.parse(jsonStr)

    if (platforms.includes('android')) {
      const versionCode = json.expo.android.versionCode as number
      json.expo.android.versionCode = versionCode + 1
    }

    if (platforms.includes('ios')) {
      const buildNumberStr = json.expo.ios.buildNumber as string
      const buildNumber = parseInt(buildNumberStr)
      json.expo.ios.buildNumber = buildNumber + 1
    }

    fs.writeFileSync(filepath, JSON.stringify(json, null, indent))

    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

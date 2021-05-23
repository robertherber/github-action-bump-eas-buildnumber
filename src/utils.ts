import {Config} from './types'

export const bumpAndroid = (json: Config): number => {
  const android = json?.expo?.android
  const versionCode = json?.expo?.android?.versionCode
  if (!android) {
    throw new Error(
      'Android config missing in app.json, for more info see https://docs.expo.io/workflow/configuration/'
    )
  }
  if (versionCode === undefined || !Number.isInteger(versionCode)) {
    throw new Error(
      `Expected expo.android.versionCode to be an integer (found ${versionCode}), for more info see https://docs.expo.io/workflow/configuration/`
    )
  }
  const nextVersionCode = versionCode + 1
  android.versionCode = nextVersionCode
  return nextVersionCode
}

export const bumpIOS = (json: Config): string => {
  const ios = json?.expo?.ios
  const buildNumberStr = ios?.buildNumber
  if (!ios) {
    throw new Error(
      'iOS config missing in app.json, for more info see https://docs.expo.io/workflow/configuration/'
    )
  }
  const buildNumber = parseFloat(buildNumberStr || '')
  if (
    buildNumberStr === undefined ||
    isNaN(buildNumber) ||
    !Number.isInteger(buildNumber)
  ) {
    throw new Error(
      `Expected stringified integer at path expo.ios.buildNumber (found ${buildNumberStr}), for more info see https://docs.expo.io/workflow/configuration/`
    )
  }

  const nextBuildNumber = (buildNumber + 1).toString()
  ios.buildNumber = nextBuildNumber
  return nextBuildNumber
}

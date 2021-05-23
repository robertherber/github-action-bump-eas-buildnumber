import {bumpAndroid, bumpIOS} from '../src/utils'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import { readFileSync } from 'fs'
import { Config } from '../src/types'

test('throws when android config missing', async () => {
  expect(() => bumpAndroid({})).toThrow('Android config missing in app.json, for more info see https://docs.expo.io/workflow/configuration/')
})

test('throws when ios config missing', async () => {
  expect(() => bumpIOS({})).toThrow('iOS config missing in app.json, for more info see https://docs.expo.io/workflow/configuration/')
})

test('throws when android config missing', async () => {
  expect(() => bumpAndroid({
    expo: {
      android: {
        // @ts-ignore
        versionCode: '5'
      }
    }
  })).toThrow('Expected expo.android.versionCode to be an integer (found 5), for more info see https://docs.expo.io/workflow/configuration/')
})

test('throws when ios config missing', async () => {
  expect(() => bumpIOS({
    expo: {
      ios: {
        // @ts-ignore
        buildNumber: '5.1'
      }
    }
  })).toThrow('Expected stringified integer at path expo.ios.buildNumber (found 5.1), for more info see https://docs.expo.io/workflow/configuration/')
})

test('should get bumped ios version', async () => {
  const buildNumber = bumpIOS({
    expo: {
      ios: {
        buildNumber: '5'
      }
    }
  });
  expect(buildNumber).toEqual('6')
})


test('should get bumped android version', async () => {
  const buildNumber = bumpAndroid({
    expo: {
      android: {
        versionCode: 5
      }
    }
  });
  expect(buildNumber).toEqual(6)
})


test('should modify config ios', async () => {
  const config = {
    expo: {
      ios: {
        buildNumber: '5'
      }
    }
  }
  bumpIOS(config);
  expect(config.expo.ios.buildNumber).toEqual('6')
})


test('should get bumped android version', async () => {
  const buildNumber = bumpAndroid({
    expo: {
      android: {
        versionCode: 5
      }
    }
  });
  expect(buildNumber).toEqual(6)
})


// shows how the runner will run a javascript action with env / stdout protocol
test('test bumps app.json', () => {
  const filepath = './__tests__/app.json';
  process.env['INPUT_FILEPATH'] = filepath
  process.env['INPUT_PLATFORMS'] = 'ios,android'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  const prefileStr = readFileSync(filepath, 'utf-8')
  const prefile = JSON.parse(prefileStr) as Config

  console.log(cp.execFileSync(np, [ip], options).toString())

  
  const afterFileStr = readFileSync(filepath, 'utf-8');
  const afterfile = JSON.parse(afterFileStr) as Config;

  expect(afterfile.expo.android.versionCode).toEqual(prefile.expo.android.versionCode + 1)
  expect(afterfile.expo.ios.buildNumber).toEqual((parseInt(prefile.expo.ios.buildNumber) + 1).toString())
})

test('test bumps app.json for only android', () => {
  const filepath = './__tests__/app.json';
  process.env['INPUT_FILEPATH'] = filepath
  process.env['INPUT_PLATFORMS'] = 'android'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  const prefileStr = readFileSync(filepath, 'utf-8')
  const prefile = JSON.parse(prefileStr) as Config

  console.log(cp.execFileSync(np, [ip], options).toString())

  
  const afterFileStr = readFileSync(filepath, 'utf-8');
  const afterfile = JSON.parse(afterFileStr) as Config;

  expect(afterfile.expo.android.versionCode).toEqual(prefile.expo.android.versionCode + 1)
  expect(afterfile.expo.ios.buildNumber).toEqual(afterfile.expo.ios.buildNumber)
})


test('test bumps app.json for only ios', () => {
  const filepath = './__tests__/app.json';
  process.env['INPUT_FILEPATH'] = filepath
  process.env['INPUT_PLATFORMS'] = 'ios'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  const prefileStr = readFileSync(filepath, 'utf-8')
  const prefile = JSON.parse(prefileStr) as Config

  console.log(cp.execFileSync(np, [ip], options).toString())

  
  const afterFileStr = readFileSync(filepath, 'utf-8');
  const afterfile = JSON.parse(afterFileStr) as Config;

  expect(afterfile.expo.android.versionCode).toEqual(prefile.expo.android.versionCode)
  expect(afterfile.expo.ios.buildNumber).toEqual((parseInt(prefile.expo.ios.buildNumber) + 1).toString())
})

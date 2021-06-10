const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const util = require('util');

var clArgs = ["/analyze:quiet", "/analyze:log:format:sarif"];
const relativeRulesetPath = "..\\..\\..\\..\\..\\..\\..\\Team Tools\\Static Analysis Tools\\Rule Sets";

function quoteCompilerArg(arg) {
  // find number of consecutive trailing backslashes
  var i = 0;
  while (i < arg.length && arg[arg.length - 1 - i] == '\\') {
    i++;
  }

  // escape all trailing backslashes
  if (i > 0) {
    arg += new Array(i + 1).join('\\');
  }

  return '"' + arg + '"';
}

function prepareOutputDir() {
  var outputDir = core.getInput('sarif-output');
  if (outputDir == '') {
    throw new Error('sarif-output folder not set');
  }

  // make relative path relative to the repo root
  if (!path.isAbsolute(outputDir)) {
    outputDir = path.join(process.env.GITHUB_WORKSPACE, outputDir);
  }

  // ensure output folder has trailing slash for use in MSVC arguments
  if (!outputDir.endsWith('\\') && !outputDir.endsWith('/')) {
    outputDir = outputDir + '\\';
  }

  // create output folder if it doesn't already exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // delete existing Sarif files
  files = fs.readdirSync(outputDir, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile() && path.extname(file.name).toLowerCase() == '.sarif') {
      fs.unlinkSync(path.join(outputDir, file.name));
    }
  });

  return outputDir;
}

function findMSVC() {
  var paths = process.cwd() + ';' + process.env.PATH;
  for (const pathDir of paths.split(';')) {
    const clPath = path.join(pathDir, 'cl.exe');
    if (fs.existsSync(clPath) == true) {
      return clPath;
    }
  }

  throw new Error('cl.exe is not accessible on the PATH');
}

// EspXEngine.dll only exists in host/target bin for MSVC Visual Studio release
function getEspXEngine(clPath) {
  var clDir = path.dirname(clPath);

  // check if we already have the correct host/target pair
  var dllPath = path.join(clDir, 'EspXEngine.dll');
  if (fs.existsSync(dllPath)) {
    return dllPath;
  }

  var targetName = '';
  var hostDir = path.dirname(clDir);
  switch (path.basename(hostDir)) {
    case 'HostX86':
      targetName = 'x86';
      break;
    case 'HostX64':
      targetName = 'x64';
      break;
    default:
      throw new Error('Unknown MSVC toolset layout');
  }

  dllPath = path.join(hostDir, targetName, 'EspXEngine.dll');
  if (fs.existsSync(dllPath)) {
    return dllPath;
  }

  throw new Error('Unable to find EspXEngine.dll');
}

function configureRuleset(clArgs, clPath) {
  var rulesetPath = core.getInput('ruleset');
  if (rulesetPath == '') {
    return rulesetPath;
  }

  var finalizedPath = undefined;
  if (path.isAbsolute(rulesetPath) && fs.existsSync(rulesetPath)) {
    finalizedPath = rulesetPath
  } else {
    // check if ruleset specified can be found in the repo
    const relativeRulesetPath = path.join(process.env.GITHUB_WORKSPACE, rulesetPath);
    if (fs.existsSync(relativeRulesetPath)) {
      finalizedPath = relativeRulesetPath;
    }
  }

  const rulesetDirectory = path.normalize(path.join(path.dirname(clPath), relativeRulesetPath));
  if (fs.existsSync(rulesetDirectory)) {
    // add official ruleset directory to resolve ruleset includes
    clArgs.push(quoteCompilerArg(util.format('/analyze:rulesetdirectory%s', rulesetDirectory)));

    // check if ruleset specified can be found in official rulesets in VS
    const officialRulesetPath = path.join(rulesetDirectory, rulesetPath);
    if (fs.existsSync(officialRulesetPath)) {
      finalizedPath = officialRulesetPath;
    }

  } else if (finalizedPath == undefined) {
    core.warning('Unable to find official rulesets shipped with Visual Studio');
  }

  if (finalizedPath == undefined || !fs.existsSync(finalizedPath)) {
    throw new Error('Unable to find ruleset file: ' + rulesetPath);
  }

  clArgs.push(quoteCompilerArg(util.format('/analyze:rulesety%s', finalizedPath)));
}

try { 
    var clPath = findMSVC();
    // TODO: version check MSVC compiler
    clArgs.push(quoteCompilerArg(util.format('/analyze:plugin%s', getEspXEngine(clPath))));

    var outputDir = prepareOutputDir();
    clArgs.push(quoteCompilerArg(util.format('/analyze:log%s', outputDir)));

    configureRuleset(clArgs, clPath);

    // add analysis arguments to _CL_ env variable
    core.exportVariable('_CL_', clArgs.join(' '));
} catch (error) {
  core.info("Failed to execute with error: " + error.message);
  core.setFailed(error.message);
}
import { createFile, mkdirSync, readFileSync } from "../file-operation/index";
import { baseAttrsMap, builtInValue } from "../core/styleAttrsMap";
const findPackageJson = require("find-package-json");
// 类名前缀
let classPrefix = "ecss";
let attrDecollator = "--";
let attrValueDecollator = "__";
// 获取项目根目录
function getRootPath() {
  const rootPath = findPackageJson().next().filename;
  return rootPath.replace("package.json", "");
}
// 创建vscode配置
export function createVscodeTips(
  prefix: string,
  decollator: string,
  valueDecollator: string
) {
  classPrefix = prefix;
  attrDecollator = decollator;
  attrValueDecollator = valueDecollator;
  let rootPath = getRootPath();
  mkdirSync(rootPath + ".vscode").then(() => {
    createSetting(rootPath + ".vscode/settings.json");
    let codeSnippet = getCodeSnippet();
    createCodeTips(
      rootPath + ".vscode/ecss.code-snippets",
      JSON.stringify(codeSnippet, null, 2)
    );
  });
}
// 创建代码片段
function createCodeTips(path, content) {
  createFile(path, content);
}
// 创建vscodetips配置
function createSetting(path) {
  let content = "";
  let setKey = '"editor.quickSuggestions"';
  try {
    let fileData = readFileSync(path);
    const fileContent = JSON.parse(fileData);
    let strings = fileContent[setKey].strings;
    if (!strings) {
      fileContent[setKey].strings = true;
      content = JSON.stringify(fileContent, null, 2);
    }
  } catch (error) {
    content = `{
    ${setKey}: {
      "strings": true
    }
  }`;
  }
  content && createFile(path, content);
}

// 获取代码提示片段
function getCodeSnippet() {
  let codeSnippet = {};
  Object.keys(baseAttrsMap).forEach((key) => {
    let prefix = classPrefix + attrDecollator;
    const content = prefix + key + attrValueDecollator;
    const attrName = baseAttrsMap[key];
    codeSnippet[attrName] = {
      prefix: prefix + attrName,
      body: [content],
    };
    let builtInValues = builtInValue[attrName];
    if (builtInValues) {
      builtInValues.forEach((val) => {
        let value = val.replaceAll(" ", attrValueDecollator);
        let valueTips = attrName + attrValueDecollator + value;
        codeSnippet[valueTips] = {
          prefix: prefix + valueTips,
          body: [content + value],
        };
      });
    }
  });
  return codeSnippet;
}

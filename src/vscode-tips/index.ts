import { createFile, mkdirSync, readFileSync } from "../file-operation/index";
import { baseAttrsMap } from "../core/styleAttrsMap";
const findPackageJson = require("find-package-json");
// 类名前缀
let classPrefix = "ecss";
// 获取项目根目录
function getRootPath() {
  const rootPath = findPackageJson().next().filename;
  return rootPath.replace("package.json", "");
}
// 创建vscode配置
export function createVscodeTips(prefix: string) {
  classPrefix = prefix;
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
    // 解析为 JavaScript 对象
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
    let prefix = classPrefix + "--";
    const content = prefix + key + "-";
    codeSnippet[baseAttrsMap[key]] = {
      prefix: prefix + baseAttrsMap[key],
      body: [content],
    };
  });
  return codeSnippet;
}

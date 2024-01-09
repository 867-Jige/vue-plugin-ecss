import { baseAttrsMap } from "../core/styleAttrsMap";
import { createVscodeTips } from "../vscode-tips";
import {
  createFile,
  appendFileSync,
  readFileSync,
} from "../file-operation/index";
type anyKey = {
  [key: string]: string;
};
// 已应用的类名
let appClass: Array<string> = [];
// 提取模板字符串中的class属性值
const classRegex = /class="([^"]*)"/g;
// 提取class属性值上的每个类名
const classValueRegex = /['"]?([\w-#]+)['"]?/g;
// 缓存.vue文件template模板字符串
let templateMap: anyKey = {};
// 路径正则
let pathRegExp =
  /(^[a-zA-Z]:[\\\S|*\S]?.+(\.css|\.scss|\.less|\.sass)$)|(^(.\/|\/|~\/|..\/)([^/\0]+\/)*[^/\0]*((\.css)|(\.scss)|(\.less)|(\.sass))$)/;
// 属性值的分隔符
let attrValueDecollator: string = "-";
// 排除指定的分割符
let excludeattrDecollators: Array<string> = [attrValueDecollator];
// 模板字符串正则
const templateRegex = /<template>([\s\S]+)<\/template>/;
// 16进制的颜色值正则
const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
/**
 * 配置项
 * */
export type Tconfig = {
  fileName?: string;
  prefix?: string;
  // attrMapExtension?: anyKey;
  outputPath?: string;
  attrDecollator?: string;
};
// 输出文件名
let fileName: string = "ecss.css";
// 类名前缀
let prefix: string = "ecss";
// 输出文件的位置
let outputPath: string = "";
// 属性间的分割符
let attrDecollator = "--";
/**
 * 初始化配置
 * @param config
 * */
export function initConfig(config?: Tconfig) {
  fileName = config?.fileName || fileName;
  // 刷新输出路径
  outputPath = "./" + fileName;
  prefix = config?.prefix || prefix;

  if (config?.attrDecollator) {
    if (
      !excludeattrDecollators.includes(config.attrDecollator.replace(/\s/g, ""))
    ) {
      attrDecollator = config.attrDecollator;
    }
  }

  if (config?.outputPath && pathRegExp.test(config?.outputPath)) {
    outputPath = config.outputPath;
    fileName = outputPath.replace(/\\|\//g, "/").split("/").pop() || fileName;
  }
  // 先创建样式文件
  createFile(outputPath);
  createVscodeTips(prefix);
}

/**
 * 生成样式
 * @param path 模块路径
 * @param fileConetn 文件内容
 * */
export function createStyle(path: string, fileConetn: string) {
  // 截取模板
  let templateString = cutOutTemplate(fileConetn);
  if (!templateString) {
    // vite5版本
    const fileContent = readFileSync(path);
    templateString = cutOutTemplate(fileContent);
  }
  // 比较模板是否有修改
  let isEdit = templateIsEdit(path, templateString);
  if (isEdit) {
    // 缓存模板字符串
    templateMap[path] = templateString;
    // 获取带有前缀的类名
    let classNames = getPrefixClass(templateString);
    // 匹配样式
    matchStyle(classNames);
  }
}
// 截取模板字符串
function cutOutTemplate(source: string) {
  const match = source.match(templateRegex);
  let templateString = "";
  if (match) {
    templateString = match[1].trim();
  } else {
    console.log("No template found in the file.");
  }
  return templateString;
}
// 判断模板字符串是否有修改
function templateIsEdit(id: string, newTemplateString: string) {
  return !(templateMap[id] === newTemplateString);
}

//获取具有前缀的类名
function getPrefixClass(templateString: string) {
  const matches = templateString.match(classRegex);
  const classNames: string[] = [];
  if (matches) {
    const classValues = matches.map((match) =>
      match.replace('class="', "").replace('"', "")
    );
    classValues.forEach((className) => {
      // 使用正则表达式匹配类名的部分
      const classValueArr: Array<string> = className.match(classValueRegex) || [
        "",
      ];
      let prefixClass = classValueArr
        .map((className) => {
          // 去除多层字符串
          return className.replace(/(['"])(.*?)\1/g, "$2");
        })
        .filter((className: string) => {
          return className.startsWith(prefix + attrDecollator);
        });
      classNames.push(...prefixClass);
    });
  }
  return classNames;
}

// 匹配样式
function matchStyle(classNames: string[]) {
  // 单个vue文件的样式内容
  let cssFileContent = "";
  // 遍历带有前缀的类名
  classNames.forEach((name: string) => {
    // 判断类名是否已经存在
    if (!appClass.includes(name)) {
      appClass.push(name);
      let attrs: Array<string> = name
        ?.replace(prefix, "")
        .split(attrDecollator)
        .filter((item) => item);
      // 样式内容
      let classContent = "";
      attrs.forEach((item) => {
        let attrNameAndValue = item
          .split(attrValueDecollator)
          .filter((item) => item);
        let attr: string = attrNameAndValue[0] || "";
        let value: string = attrNameAndValue.slice(1).join(" ") || "";
        let attrName = baseAttrsMap[attr];
        if (attrName && value) {
          if (attrName === "color") {
            value = colorRegex.test("#" + value) ? "#" + value : value;
          }
          classContent += `    ${attrName}: ${value} !important;\n`;
        }
      });
      cssFileContent += `.${name} {\n${classContent}}\n`;
    }
  });
  if (cssFileContent) {
    appendFileSync(outputPath, cssFileContent);
  }
}

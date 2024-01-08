const fs = require("fs");
// 添加内容
export function appendFileSync(path, content = "") {
  fs.appendFileSync(path, content, fileCallback("appending"));
}
// 创建文件
export function createFile(path, content = "") {
  fs.writeFile(path, content, fileCallback("writeFile"));
}
// 文件回调
function fileCallback(type) {
  return (err) => {
    if (err) {
      console.error(`Error ${type} content to file:`, err);
    } else {
      console.log(`Content ${type} to file successfully.`);
    }
  };
}
// 获取文件内容
export function readFileSync(path) {
  const fileContent = fs.readFileSync(path, "utf-8");
  return fileContent;
}
// 创建文件夹
export function mkdirSync(path) {
  return new Promise((resolve, rejct) => {
    if (fs.existsSync(path)) {
      resolve(true);
    } else {
      console.log("Folder does not exist.");
      try {
        fs.mkdirSync(path);
        resolve(true);
        console.log("New folder created successfully.");
      } catch (err) {
        console.error("Error creating folder:", err);
        rejct(err);
      }
    }
  });
}

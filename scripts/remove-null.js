const fs = require('fs');
const path = require('path');

// 目标目录（别用绝对路径，否则会被解析为：C:\public\routes\plus\ui-blocks）
const targetDir = './public/routes/plus/ui-blocks';

// 递归遍历这个目录下的所有 json 文件
function traverseDirectory(dir) {
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stats = fs.statSync(filePath);

		if (stats.isFile() && file.endsWith('.json')) {
			// console.log(filePath);
			// 如果文件名中包含 -null，那就重命名，把 -null 移除
			if (file.includes('-null')) {
				fs.renameSync(filePath, filePath.replace('-null', ''));
				console.log(`重命名：${file} -> ${file.replace('-null', '')}`);
			}
		} else if (stats.isDirectory()) {
			traverseDirectory(filePath);
		}
	});
}

traverseDirectory(targetDir);

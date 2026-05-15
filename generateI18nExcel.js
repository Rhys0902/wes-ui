/**
 * 将国际化文件转换为Excel表格
 * 按照对象结构组织数据，生成中英文对照表
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 文件路径
const zhFilePath = path.join(__dirname, 'src/lang/zh.js');
const enFilePath = path.join(__dirname, 'src/lang/en.js');
const outputPath = path.join(__dirname, 'i18n-translation-table.xlsx');

/**
 * 读取并解析国际化文件
 */
function parseI18nFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // 移除export default和最后的分号，获取纯对象内容
    const objectContent = content
      .replace(/export\s+default\s*/, '')
      .replace(/;\s*$/, '')
      .trim();
    
    // 使用eval来解析对象（注意：这里假设文件格式正确）
    const obj = eval(`(${objectContent})`);
    return obj;
  } catch (error) {
    console.error(`解析文件失败: ${filePath}`, error);
    return null;
  }
}

/**
 * 将嵌套对象扁平化为带路径的键值对
 */
function flattenObject(obj, prefix = '', result = []) {
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // 递归处理嵌套对象
      flattenObject(value, fullKey, result);
    } else {
      // 叶子节点，添加到结果中
      result.push({
        module: prefix || 'root',
        key: key,
        fullPath: fullKey,
        value: value
      });
    }
  });
  
  return result;
}

/**
 * 按模块组织数据
 */
function organizeByModule(flatData) {
  const moduleData = {};
  
  flatData.forEach(item => {
    const moduleName = item.module;
    
    if (!moduleData[moduleName]) {
      moduleData[moduleName] = [];
    }
    
    moduleData[moduleName].push({
      key: item.key,
      fullPath: item.fullPath,
      value: item.value
    });
  });
  
  return moduleData;
}

/**
 * 创建对照表数据
 */
function createComparisonData(zhData, enData) {
  const zhFlat = flattenObject(zhData);
  const enFlat = flattenObject(enData);
  
  // 创建英文数据的映射，便于查找
  const enMap = new Map();
  enFlat.forEach(item => {
    enMap.set(item.fullPath, item.value);
  });
  
  // 合并中英文数据
  const comparisonData = [];
  zhFlat.forEach(zhItem => {
    const enValue = enMap.get(zhItem.fullPath) || '缺失翻译';
    
    comparisonData.push({
      模块: zhItem.module,
      键名: zhItem.key,
      完整路径: zhItem.fullPath,
      中文: zhItem.value,
      英文: enValue,
      状态: enMap.has(zhItem.fullPath) ? '已翻译' : '缺失翻译'
    });
  });
  
  // 检查英文中存在但中文中不存在的键
  enFlat.forEach(enItem => {
    const zhExists = zhFlat.some(zh => zh.fullPath === enItem.fullPath);
    if (!zhExists) {
      comparisonData.push({
        模块: enItem.module,
        键名: enItem.key,
        完整路径: enItem.fullPath,
        中文: '缺失中文',
        英文: enItem.value,
        状态: '仅英文存在'
      });
    }
  });
  
  return comparisonData;
}

/**
 * 按模块分组数据
 */
function groupByModule(comparisonData) {
  const moduleGroups = {};
  
  comparisonData.forEach(item => {
    const moduleName = item.模块;
    
    if (!moduleGroups[moduleName]) {
      moduleGroups[moduleName] = [];
    }
    
    moduleGroups[moduleName].push(item);
  });
  
  return moduleGroups;
}

/**
 * 创建Excel工作簿
 */
function createExcelWorkbook(zhData, enData, comparisonData) {
  const workbook = XLSX.utils.book_new();
  
  // 1. 创建对照表工作表
  console.log('创建对照表工作表...');
  const comparisonWS = XLSX.utils.json_to_sheet(comparisonData);
  
  // 设置列宽
  comparisonWS['!cols'] = [
    { width: 15 }, // 模块
    { width: 25 }, // 键名
    { width: 35 }, // 完整路径
    { width: 30 }, // 中文
    { width: 30 }, // 英文
    { width: 12 }  // 状态
  ];
  
  XLSX.utils.book_append_sheet(workbook, comparisonWS, '中英文对照表');
  
  // 2. 按模块创建工作表
  const moduleGroups = groupByModule(comparisonData);
  const moduleNames = Object.keys(moduleGroups).sort();
  
  console.log(`创建 ${moduleNames.length} 个模块工作表...`);
  
  moduleNames.forEach(moduleName => {
    const moduleData = moduleGroups[moduleName];
    
    // 创建模块工作表
    const moduleWS = XLSX.utils.json_to_sheet(moduleData);
    
    // 设置列宽
    moduleWS['!cols'] = [
      { width: 15 }, // 模块
      { width: 25 }, // 键名
      { width: 35 }, // 完整路径
      { width: 30 }, // 中文
      { width: 30 }, // 英文
      { width: 12 }  // 状态
    ];
    
    // 工作表名称长度限制（Excel限制31个字符）
    let sheetName = moduleName;
    if (sheetName.length > 31) {
      sheetName = sheetName.substring(0, 28) + '...';
    }
    
    XLSX.utils.book_append_sheet(workbook, moduleWS, sheetName);
    console.log(`  创建模块工作表: ${sheetName} (${moduleData.length} 条记录)`);
  });
  
  // 3. 创建统计信息工作表
  console.log('创建统计信息工作表...');
  const stats = [];
  
  moduleNames.forEach(moduleName => {
    const moduleData = moduleGroups[moduleName];
    const translated = moduleData.filter(item => item.状态 === '已翻译').length;
    const missing = moduleData.filter(item => item.状态 === '缺失翻译').length;
    const englishOnly = moduleData.filter(item => item.状态 === '仅英文存在').length;
    
    stats.push({
      模块名称: moduleName,
      总计: moduleData.length,
      已翻译: translated,
      缺失翻译: missing,
      仅英文存在: englishOnly,
      翻译完成率: `${((translated / moduleData.length) * 100).toFixed(1)}%`
    });
  });
  
  // 添加总计行
  const totalItems = comparisonData.length;
  const totalTranslated = comparisonData.filter(item => item.状态 === '已翻译').length;
  const totalMissing = comparisonData.filter(item => item.状态 === '缺失翻译').length;
  const totalEnglishOnly = comparisonData.filter(item => item.状态 === '仅英文存在').length;
  
  stats.push({
    模块名称: '总计',
    总计: totalItems,
    已翻译: totalTranslated,
    缺失翻译: totalMissing,
    仅英文存在: totalEnglishOnly,
    翻译完成率: `${((totalTranslated / totalItems) * 100).toFixed(1)}%`
  });
  
  const statsWS = XLSX.utils.json_to_sheet(stats);
  statsWS['!cols'] = [
    { width: 20 }, // 模块名称
    { width: 10 }, // 总计
    { width: 10 }, // 已翻译
    { width: 12 }, // 缺失翻译
    { width: 12 }, // 仅英文存在
    { width: 15 }  // 翻译完成率
  ];
  
  XLSX.utils.book_append_sheet(workbook, statsWS, '统计信息');
  
  return workbook;
}

/**
 * 主函数
 */
function main() {
  console.log('开始生成国际化Excel表格...');
  
  // 1. 解析国际化文件
  console.log('\n1. 解析国际化文件...');
  const zhData = parseI18nFile(zhFilePath);
  const enData = parseI18nFile(enFilePath);
  
  if (!zhData || !enData) {
    console.error('解析国际化文件失败');
    return;
  }
  
  console.log(`zh.js 模块数量: ${Object.keys(zhData).length}`);
  console.log(`en.js 模块数量: ${Object.keys(enData).length}`);
  
  // 2. 创建对照数据
  console.log('\n2. 创建中英文对照数据...');
  const comparisonData = createComparisonData(zhData, enData);
  console.log(`总计 ${comparisonData.length} 个翻译项`);
  
  // 统计信息
  const translated = comparisonData.filter(item => item.状态 === '已翻译').length;
  const missing = comparisonData.filter(item => item.状态 === '缺失翻译').length;
  const englishOnly = comparisonData.filter(item => item.状态 === '仅英文存在').length;
  
  console.log(`  已翻译: ${translated}`);
  console.log(`  缺失翻译: ${missing}`);
  console.log(`  仅英文存在: ${englishOnly}`);
  console.log(`  翻译完成率: ${((translated / comparisonData.length) * 100).toFixed(1)}%`);
  
  // 3. 创建Excel工作簿
  console.log('\n3. 创建Excel工作簿...');
  const workbook = createExcelWorkbook(zhData, enData, comparisonData);
  
  // 4. 保存Excel文件
  console.log('\n4. 保存Excel文件...');
  try {
    XLSX.writeFile(workbook, outputPath);
    console.log(`Excel文件已保存到: ${outputPath}`);
  } catch (error) {
    console.error('保存Excel文件失败:', error);
    return;
  }
  
  // 5. 生成报告
  const report = {
    timestamp: new Date().toISOString(),
    sourceFiles: {
      zh: zhFilePath,
      en: enFilePath
    },
    outputFile: outputPath,
    statistics: {
      totalItems: comparisonData.length,
      translated: translated,
      missing: missing,
      englishOnly: englishOnly,
      completionRate: `${((translated / comparisonData.length) * 100).toFixed(1)}%`
    },
    modules: Object.keys(zhData).length,
    worksheets: Object.keys(zhData).length + 2 // 模块工作表 + 对照表 + 统计信息
  };
  
  fs.writeFileSync('i18n-excel-generation-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n✅ Excel生成完成！');
  console.log(`- 生成了 ${Object.keys(zhData).length + 2} 个工作表`);
  console.log(`- 包含 ${comparisonData.length} 个翻译项`);
  console.log(`- 翻译完成率: ${((translated / comparisonData.length) * 100).toFixed(1)}%`);
  console.log('- 详细报告已保存到 i18n-excel-generation-report.json');
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  parseI18nFile,
  flattenObject,
  createComparisonData,
  createExcelWorkbook
};
const articleCategoryToString = (category) => {
  const categories = [
    '前端',
    '后端',
    '数据库',
    '运维',
    '算法',
    '人工智能',
    '网络安全',
    '开发工具',
    '码农职场',
    '人生随笔',
  ];
  return categories[category];
};
export default articleCategoryToString;

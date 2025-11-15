/**
 * 验证工具函数
 * 包括邮箱、手机号、密码等验证
 */

/**
 * 邮箱验证
 * @param email 邮箱地址
 * @returns 是否有效
 */
export const isEmail = (email: string): boolean => {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(email);
};

/**
 * 手机号验证（中国大陆）
 * @param phone 手机号
 * @returns 是否有效
 */
export const isPhone = (phone: string): boolean => {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
};

/**
 * 身份证号验证（中国大陆）
 * @param idCard 身份证号
 * @returns 是否有效
 */
export const isIdCard = (idCard: string): boolean => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(idCard);
};

/**
 * URL 验证
 * @param url URL 地址
 * @returns 是否有效
 */
export const isUrl = (url: string): boolean => {
  const reg = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return reg.test(url);
};

/**
 * 密码强度验证
 * @param password 密码
 * @returns 强度等级（0-4）
 * 0: 空密码
 * 1: 弱（纯数字或纯字母）
 * 2: 中（数字+字母）
 * 3: 强（数字+字母+特殊字符）
 * 4: 很强（数字+大小写字母+特殊字符）
 */
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // 长度检查
  if (password.length >= 8) strength++;
  
  // 包含数字
  if (/\d/.test(password)) strength++;
  
  // 包含小写字母
  if (/[a-z]/.test(password)) strength++;
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++;
  
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  // 根据满足的条件数量返回强度
  if (strength <= 1) return 1;
  if (strength === 2) return 2;
  if (strength === 3) return 3;
  return 4;
};

/**
 * 密码验证（至少8位，包含数字和字母）
 * @param password 密码
 * @returns 是否有效
 */
export const isValidPassword = (password: string): boolean => {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return reg.test(password);
};

/**
 * 用户名验证（4-16位，字母、数字、下划线）
 * @param username 用户名
 * @returns 是否有效
 */
export const isUsername = (username: string): boolean => {
  const reg = /^[a-zA-Z0-9_]{4,16}$/;
  return reg.test(username);
};

/**
 * 整数验证
 * @param value 值
 * @returns 是否为整数
 */
export const isInteger = (value: string | number): boolean => {
  const reg = /^-?\d+$/;
  return reg.test(String(value));
};

/**
 * 正整数验证
 * @param value 值
 * @returns 是否为正整数
 */
export const isPositiveInteger = (value: string | number): boolean => {
  const reg = /^\d+$/;
  return reg.test(String(value));
};

/**
 * 数字验证（包括小数）
 * @param value 值
 * @returns 是否为数字
 */
export const isNumber = (value: string | number): boolean => {
  const reg = /^-?\d+(\.\d+)?$/;
  return reg.test(String(value));
};

/**
 * 中文验证
 * @param value 值
 * @returns 是否为中文
 */
export const isChinese = (value: string): boolean => {
  const reg = /^[\u4e00-\u9fa5]+$/;
  return reg.test(value);
};

/**
 * 邮政编码验证（中国大陆）
 * @param code 邮政编码
 * @returns 是否有效
 */
export const isPostalCode = (code: string): boolean => {
  const reg = /^[1-9]\d{5}$/;
  return reg.test(code);
};

/**
 * IP 地址验证
 * @param ip IP 地址
 * @returns 是否有效
 */
export const isIP = (ip: string): boolean => {
  const reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  return reg.test(ip);
};


/**
 * 格式化工具函数
 * 包括日期、金额、文件大小等格式化
 */

import dayjs from 'dayjs';

/**
 * 日期格式化
 * @param date 日期（字符串、时间戳或 Date 对象）
 * @param format 格式（默认：YYYY-MM-DD HH:mm:ss）
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: string | number | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * 相对时间格式化
 * @param date 日期
 * @returns 相对时间（如：3 天前）
 */
export const formatRelativeTime = (date: string | number | Date): string => {
  if (!date) return '';
  
  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target, 'second');
  
  if (diff < 60) {
    return '刚刚';
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)} 分钟前`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)} 小时前`;
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)} 天前`;
  } else if (diff < 31536000) {
    return `${Math.floor(diff / 2592000)} 个月前`;
  } else {
    return `${Math.floor(diff / 31536000)} 年前`;
  }
};

/**
 * 金额格式化
 * @param amount 金额
 * @param decimals 小数位数（默认：2）
 * @param currency 货币符号（默认：¥）
 * @returns 格式化后的金额字符串
 */
export const formatMoney = (
  amount: number | string,
  decimals: number = 2,
  currency: string = '¥'
): string => {
  if (amount === null || amount === undefined) return '';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '';
  
  // 格式化为千分位
  const formatted = num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${currency}${formatted}`;
};

/**
 * 文件大小格式化
 * @param bytes 字节数
 * @param decimals 小数位数（默认：2）
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * 数字格式化（千分位）
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (num: number | string, decimals?: number): string => {
  if (num === null || num === undefined) return '';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return '';
  
  const formatted = decimals !== undefined 
    ? number.toFixed(decimals) 
    : number.toString();
  
  return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 百分比格式化
 * @param value 值
 * @param total 总数
 * @param decimals 小数位数（默认：2）
 * @returns 格式化后的百分比字符串
 */
export const formatPercent = (
  value: number,
  total: number,
  decimals: number = 2
): string => {
  if (total === 0) return '0%';
  
  const percent = (value / total) * 100;
  return `${percent.toFixed(decimals)}%`;
};

/**
 * 手机号格式化（隐藏中间4位）
 * @param phone 手机号
 * @returns 格式化后的手机号
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 身份证号格式化（隐藏中间部分）
 * @param idCard 身份证号
 * @returns 格式化后的身份证号
 */
export const formatIdCard = (idCard: string): string => {
  if (!idCard) return '';
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
};


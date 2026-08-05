/**
 * 基础接口，所有文档类型都应继承此接口
 * 定义了文档的基本属性，包括ID和时间戳
 * @interface IBase
 */
export interface IBase {
  /**
   * 文档唯一标识符
   * @type {string|number}
   */
  id?: string | number;

  /**
   * 文档创建时间
   * @type {Date}
   */
  createTime?: Date;

  /**
   * 文档最后更新时间
   * @type {Date}
   */
  updateTime?: Date;
}
export interface IBaseHistory extends IBase {
  /**
   * 文档历史版本
   * @type {number}
   */
  version?: number;
}
/**
 * 查询条件接口
 * @interface IQueryCondition
 */
export interface IQueryCondition<T extends IBase = any> {
  /** 查询条件 */
  where?: Partial<T>;
  /** 排序规则 */
  sort?: Record<string, 'asc' | 'desc'>;
  /** 分页页码（从 1 开始） */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 字段选择 */
  fields?: Partial<Record<keyof T, 1>>;
}
/**
 * 查询条件值类型，支持简单值和复杂操作符
 */
export type QueryValue<T = any> =
  | T
  | {
      $eq?: T;
      $neq?: T; // 不等于 (not equal)
      $gt?: T; // 大于
      $gte?: T; // 大于等于
      $lt?: T; // 小于
      $lte?: T; // 小于等于
      $in?: T[]; // 在数组中
      $nin?: T[]; // 不在数组中
      $like?: string; // 包含字符串
      $likeIgnoreCase?: string; // 包含字符串（忽略大小写）
      $startsWith?: string; // 以指定字符串开头
      $startsWithIgnoreCase?: string; // 以指定字符串开头（忽略大小写）
      $regexp?: string | RegExp; // 正则表达式匹配
    };

/**
 * 分页结果接口
 * @interface IPaginationResult
 */
export interface IPage<T extends IBase = any> {
  /** 数据列表 */
  list: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  size: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * EasyStore 接口，提供基础的 CRUD 操作
 * @interface IEasyStore
 */
export interface IEasyStore<T extends IBase = any> {
  /**
   * 保存或更新单条数据
   * @param data 要保存的数据
   * @returns Promise 返回保存后的数据
   */
  save(data: Omit<T, 'id'> | T): Promise<T>;

  /**
   * 批量保存或更新数据
   * @param dataList 要保存的数据列表
   * @returns Promise 返回保存后的数据列表
   */
  saveList(dataList: Array<Omit<T, 'id'> | T>): Promise<T[]>;

  /**
   * 根据条件获取列表
   * @param condition 查询条件
   * @returns Promise 返回数据列表
   */
  getList(condition?: IQueryCondition<T>): Promise<T[]>;

  /**
   * 根据条件删除数据
   * @param condition 删除条件
   * @returns Promise 返回删除的数量
   */
  delete(condition: Partial<T>): Promise<number>;

  /**
   * 根据条件获取单条信息
   * @param condition 查询条件
   * @returns Promise 返回单条数据，不存在则返回 null
   */
  getInfo(condition: Partial<T>): Promise<T | null>;

  /**
   * 根据条件更新信息
   * @param condition 查询条件
   * @param updates 要更新的字段
   * @returns Promise 返回更新后的数据
   */
  update(data: Record<string, any>, condition: Partial<T>): Promise<T | null>;

  /**
   * 根据条件统计数量
   * @param condition 统计条件
   * @returns Promise 返回符合条件的记录数
   */
  count(condition: Partial<T>): Promise<number>;

  /**
   * 清空所有数据
   * @returns Promise
   */
  clear(): Promise<void>;

  /**
   * 根据条件分页获取列表
   * @param condition 查询条件和分页参数
   * @returns Promise 返回分页结果
   */
  getPage(condition: IQueryCondition<T>): Promise<IPage<T>>;
}

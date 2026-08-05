import Dexie, { Table, Collection } from 'dexie';
import { IBase, IEasyStore, IQueryCondition, IPage, QueryValue } from './types.js';

/**
 * 生成唯一 ID（UUID v4 格式）
 * @returns UUID 字符串
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function toPlainObject<T = any>(value: any): T {
  if (value === null || value === undefined) return value as T;
  if (typeof structuredClone === 'function') {
    return structuredClone(value) as T;
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

// ========================
// 统一的单例数据库
// ========================

/**
 * 统一的本地数据库管理类
 */
export class PPTBoardDatabase extends Dexie {
  // 使用复合主键隔离不同 table 的数据: [__tableName+id] 作为主键
  // 额外索引 [__tableName+updateTime] 用于按表查询并按更新时间排序
  // 额外索引 [__tableName+createTime] 用于按表查询并按创建时间排序
  public records!: Table<any, [string, string | number]>;

  constructor(dbName = 'ppt-board-db') {
    super(dbName);
    this.version(1).stores({
      records: '[__tableName+id], __tableName, [__tableName+updateTime], [__tableName+createTime]',
    });
  }
}

/**
 * 全局共享的统一数据库实例
 */
export const unifiedDB = new PPTBoardDatabase();

/**
 * 提供一个通用的 hook 来获取 store 实例
 * 让插件开发者更容易操纵数据
 * @param tableName 表名称（用于数据隔离的逻辑表）
 */
export function useEasyStore<T extends IBase = any>(tableName: string): IEasyStore<T> {
  return new EasyDexieStore<T>(tableName);
}

/**
 * EasyDexieStore 类，基于 Dexie 实现 IEasyStore 接口
 * 提供 IndexedDB 的 CRUD 操作封装，使用统一的 PPTBoardDatabase 实例
 * @template T 数据类型，必须继承 IBase 接口
 */
export class EasyDexieStore<T extends IBase = any> implements IEasyStore<T> {
  private tableName: string;

  /**
   * 构造函数
   * @param tableName 表名称（逻辑表，用于数据隔离）
   */
  constructor(tableName: string = 'store') {
    this.tableName = tableName;
  }

  /**
   * 获取数据表
   * @returns 统一数据表实例
   */
  private getTable(): Table<any, [string, string | number]> {
    return unifiedDB.records;
  }

  /**
   * 保存或更新单条数据
   * @param data 要保存的数据
   * @returns Promise 返回保存后的数据
   */
  async save(data: Record<string | number, any>): Promise<T> {
    const table = this.getTable();
    const now = new Date();
    const plain = toPlainObject<Record<string | number, any>>(data);

    let id = plain.id;
    if (id === undefined || id === null || id === '') {
      id = generateId();
    }

    const newData = {
      ...plain,
      __tableName: this.tableName,
      id,
      createTime: plain.createTime || now,
      updateTime: now,
    };

    await table.put(newData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __tableName, ...rest } = newData;
    return rest as unknown as T;
  }

  /**
   * 批量保存或更新数据
   * @param dataList 要保存的数据列表
   * @returns Promise 返回保存后的数据列表
   */
  async saveList(dataList: Array<Record<string | number, any>>): Promise<T[]> {
    const table = this.getTable();
    const now = new Date();

    const items = dataList.map(data => {
      const plain = toPlainObject<Record<string | number, any>>(data);
      const id =
        plain.id !== undefined && plain.id !== null && plain.id !== '' ? plain.id : generateId();
      return {
        ...plain,
        __tableName: this.tableName,
        id,
        createTime: plain.createTime || now,
        updateTime: now,
      };
    });

    await table.bulkPut(items);

    return items.map(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __tableName, ...rest } = item;
      return rest;
    }) as unknown as T[];
  }

  /**
   * 根据条件获取列表
   * @param condition 查询条件
   * @returns Promise 返回数据列表
   */
  async getList(condition?: IQueryCondition<T>): Promise<T[]> {
    const table = this.getTable();
    let collection: Collection<any, any>;

    // 解析排序字段
    let sortKey = 'updateTime';
    let sortOrder = 'desc';
    if (condition?.sort) {
      const entries = Object.entries(condition.sort);
      if (entries.length > 0) {
        sortKey = entries[0][0];
        sortOrder = entries[0][1].toLowerCase();
      }
    }

    if (sortKey === 'updateTime' || sortKey === 'createTime') {
      // 优先使用复合索引进行高效排序和查询
      collection = table
        .where(`[__tableName+${sortKey}]`)
        .between([this.tableName, Dexie.minKey], [this.tableName, Dexie.maxKey]);

      if (sortOrder === 'desc') {
        collection = collection.reverse();
      }
    } else {
      // 对非复合索引字段，只能做基本表名过滤，然后在JS中排序
      collection = table.where('__tableName').equals(this.tableName);
    }

    if (condition?.where) {
      collection = this.applyWhereConditions(collection, condition.where);
    }

    let results = await collection.toArray();

    // 如果不是利用复合索引排序的字段，在此处执行JS内存排序
    if (condition?.sort && sortKey !== 'updateTime' && sortKey !== 'createTime') {
      results.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (condition?.fields) {
      results = results.map(item => this.selectFields(item, condition.fields!));
    }

    return results.map(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __tableName, ...rest } = item;
      return rest;
    }) as unknown as T[];
  }

  /**
   * 根据条件删除数据
   * @param condition 删除条件
   * @returns Promise 返回删除的数量
   */
  async delete(condition: Partial<T>): Promise<number> {
    const table = this.getTable();

    if (condition.id !== undefined) {
      const exists = await table.get([this.tableName, condition.id as string | number]);
      if (exists) {
        await table.delete([this.tableName, condition.id as string | number]);
        return 1;
      }
      return 0;
    }

    const list = await this.getList({ where: condition });
    if (list.length > 0) {
      const keys = list.map(item => [this.tableName, item.id!] as [string, string | number]);
      if (keys.length > 0) {
        await table.bulkDelete(keys);
      }
    }
    return list.length;
  }

  /**
   * 根据条件获取单条信息
   * @param condition 查询条件
   * @returns Promise 返回单条数据，不存在则返回 null
   */
  async getInfo(condition: Partial<T>): Promise<T | null> {
    if (condition.id !== undefined) {
      const result = await this.getTable().get([this.tableName, condition.id as string | number]);
      if (result) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __tableName, ...rest } = result;
        return rest as unknown as T;
      }
      return null;
    }

    const list = await this.getList({ ...condition, pageSize: 1 });
    return list.length > 0 ? list[0] : null;
  }

  /**
   * 根据条件更新信息
   * 更新所有符合条件的数据
   * @param data 要更新的数据
   * @param condition 查询条件
   * @returns Promise 返回更新后的第一条数据
   */
  async update(data: Record<string, any>, condition: Partial<T>): Promise<T | null> {
    const table = this.getTable();
    const list = await this.getList({ where: condition });

    if (list.length === 0) {
      return null;
    }

    const now = new Date();
    const plainData = toPlainObject<Record<string, any>>(data);
    const updateData = {
      ...plainData,
      updateTime: now,
    };

    await Promise.all(list.map(item => table.update([this.tableName, item.id!], updateData)));

    return { ...list[0], ...updateData } as unknown as T;
  }

  /**
   * 根据条件统计数量
   * @param condition 统计条件
   * @returns Promise 返回符合条件的记录数
   */
  async count(condition: Partial<T>): Promise<number> {
    const table = this.getTable();

    if (!condition || Object.keys(condition).length === 0) {
      return await table.where('__tableName').equals(this.tableName).count();
    }

    let collection = table.where('__tableName').equals(this.tableName);
    collection = this.applyWhereConditions(collection, condition);
    return await collection.count();
  }

  /**
   * 清空所有数据
   * @returns Promise
   */
  async clear(): Promise<void> {
    const table = this.getTable();
    const collection = table.where('__tableName').equals(this.tableName);
    await collection.delete();
  }

  /**
   * 根据条件分页获取列表
   * @param condition 查询条件和分页参数
   * @returns Promise 返回分页结果
   */
  async getPage(condition: IQueryCondition<T>): Promise<IPage<T>> {
    const page = condition.page || 1;
    const pageSize = condition.pageSize || 10;
    const table = this.getTable();

    let collection: Collection<any, any>;

    let sortKey = 'updateTime';
    let sortOrder = 'desc';
    if (condition?.sort) {
      const entries = Object.entries(condition.sort);
      if (entries.length > 0) {
        sortKey = entries[0][0];
        sortOrder = entries[0][1].toLowerCase();
      }
    }

    if (sortKey === 'updateTime' || sortKey === 'createTime') {
      collection = table
        .where(`[__tableName+${sortKey}]`)
        .between([this.tableName, Dexie.minKey], [this.tableName, Dexie.maxKey]);
      if (sortOrder === 'desc') {
        collection = collection.reverse();
      }
    } else {
      collection = table.where('__tableName').equals(this.tableName);
    }

    if (condition?.where) {
      collection = this.applyWhereConditions(collection, condition.where);
    }

    const totalCount = await collection.count();

    let paginatedList: any[];
    const offset = (page - 1) * pageSize;

    if (sortKey === 'updateTime' || sortKey === 'createTime') {
      paginatedList = await collection.offset(offset).limit(pageSize).toArray();
    } else {
      const allResults = await collection.toArray();
      allResults.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      paginatedList = allResults.slice(offset, offset + pageSize);
    }

    if (condition?.fields) {
      paginatedList = paginatedList.map(item => this.selectFields(item, condition.fields!));
    }

    paginatedList = paginatedList.map(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __tableName, ...rest } = item;
      return rest;
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      list: paginatedList as T[],
      total: totalCount,
      page,
      size: pageSize,
      totalPages,
    };
  }

  /**
   * 应用 where 条件到查询集合
   */
  private applyWhereConditions(
    collection: Collection<any, any>,
    where: Partial<T>
  ): Collection<any, any> {
    for (const [key, value] of Object.entries(where)) {
      if (value === undefined) continue;

      if (typeof value === 'object' && value !== null) {
        collection = this.applyComplexCondition(collection, key, value as QueryValue);
      } else {
        collection = collection.and((item: any) => item[key] == value);
      }
    }
    return collection;
  }

  /**
   * 应用复杂条件操作符
   */
  private applyComplexCondition(
    collection: Collection<any, any>,
    key: string,
    condition: QueryValue
  ): Collection<any, any> {
    const cond = condition as Record<string, any>;

    if (cond.$eq !== undefined) {
      collection = collection.and((item: any) => item[key] === cond.$eq);
    }
    if (cond.$neq !== undefined) {
      collection = collection.and((item: any) => item[key] !== cond.$neq);
    }
    if (cond.$gt !== undefined) {
      collection = collection.and((item: any) => item[key] != null && item[key] > cond.$gt);
    }
    if (cond.$gte !== undefined) {
      collection = collection.and((item: any) => item[key] != null && item[key] >= cond.$gte);
    }
    if (cond.$lt !== undefined) {
      collection = collection.and((item: any) => item[key] != null && item[key] < cond.$lt);
    }
    if (cond.$lte !== undefined) {
      collection = collection.and((item: any) => item[key] != null && item[key] <= cond.$lte);
    }
    if (cond.$in !== undefined && Array.isArray(cond.$in)) {
      collection = collection.and((item: any) => cond.$in.includes(item[key]));
    }
    if (cond.$nin !== undefined && Array.isArray(cond.$nin)) {
      collection = collection.and((item: any) => !cond.$nin.includes(item[key]));
    }
    if (cond.$like !== undefined) {
      collection = collection.and((item: any) => String(item[key]).includes(cond.$like));
    }
    if (cond.$likeIgnoreCase !== undefined) {
      const searchValue = cond.$likeIgnoreCase.toLowerCase();
      collection = collection.and((item: any) =>
        String(item[key]).toLowerCase().includes(searchValue)
      );
    }
    if (cond.$startsWith !== undefined) {
      collection = collection.and((item: any) => String(item[key]).startsWith(cond.$startsWith));
    }
    if (cond.$startsWithIgnoreCase !== undefined) {
      const prefix = cond.$startsWithIgnoreCase.toLowerCase();
      collection = collection.and((item: any) =>
        String(item[key]).toLowerCase().startsWith(prefix)
      );
    }
    if (cond.$regexp !== undefined) {
      const regex = typeof cond.$regexp === 'string' ? new RegExp(cond.$regexp) : cond.$regexp;
      collection = collection.and((item: any) => regex.test(String(item[key])));
    }

    return collection;
  }

  /**
   * 选择指定字段
   */
  private selectFields(item: any, fields: Partial<Record<keyof T, 1>>): T {
    const result = {} as any;
    for (const key of Object.keys(fields)) {
      result[key] = item[key];
    }
    if (item.id !== undefined) {
      result.id = item.id;
    }
    return result as T;
  }

  /**
   * 关闭数据库连接（一般不需要手动调用，全局单例管理）
   */
  close(): void {
    // No-op for unified database to prevent accidentally closing other stores.
    // If strict teardown is needed, `unifiedDB.close()` can be called manually elsewhere.
  }
}

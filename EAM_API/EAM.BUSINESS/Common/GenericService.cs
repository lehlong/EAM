﻿using AutoMapper;
using Common;
using EAM.CORE;
using EAM.CORE.Common;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;

namespace EAM.BUSINESS.Common
{
    public abstract class GenericService<TEntity, TDto>(AppDbContext dbContext, IMapper mapper) : BaseService(dbContext, mapper), IGenericService<TEntity, TDto> where TDto : class where TEntity : BaseEntity
    {

        /// <summary>
        /// Lấy ra thuộc tính được thiết lập là key trong DTO
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        private static PropertyInfo? GetKeyField(IDto dto)
        {
            PropertyInfo keyProperty = null;
            Type t = dto.GetType();
            foreach (PropertyInfo pi in t.GetProperties())
            {
                object[] attrs = pi.GetCustomAttributes(typeof(KeyAttribute), false);
                if (attrs != null && attrs.Length == 1)
                {
                    keyProperty = pi;
                    break;
                }
            }
            return keyProperty;
        }

        /// <summary>
        /// Lấy giá trị của thuộc tính được thiết lập là key trong DTO
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        private static object? GetValueOfKeyField(IDto dto, PropertyInfo keyProperty)
        {
            object value = null;
            if (keyProperty != null)
            {
                value = keyProperty.GetValue(dto, null);
            }
            return value;
        }

        public virtual Task<PagedResponseDto> Search(BaseFilter filter)
        {
            return Task.FromResult<PagedResponseDto>(new());
        }

        public virtual async Task<IList<TDto>> GetAll()
        {
            try
            {
                var query = _dbContext.Set<TEntity>();
                var lstEntity = await _dbContext.Set<TEntity>().Where(x => x.IsActive == true).ToListAsync();
                return _mapper.Map<List<TDto>>(lstEntity);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public virtual async Task<IList<TDto>> GetAllActive()
        {
            try
            {
                var query = _dbContext.Set<TEntity>().AsQueryable();
                query = query.Where(x => x.IsActive == true);
                var lstEntity = await query.ToListAsync();
                return _mapper.Map<List<TDto>>(lstEntity);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public virtual async Task<TDto> GetById(object id)
        {
            try
            {
                var entity = await _dbContext.Set<TEntity>().FindAsync(id);
                return _mapper.Map<TDto>(entity);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public virtual async Task<TDto> Add(IDto dto)
        {
            try
            {
                var entity = _mapper.Map<TEntity>(dto);

                var keyProperties = dto.GetType()
                    .GetProperties()
                    .Where(p => Attribute.IsDefined(p, typeof(KeyAttribute)))
                    .ToList();

                if (keyProperties.Any())
                {
                    var query = _dbContext.Set<TEntity>().AsQueryable();

                    foreach (var prop in keyProperties)
                    {
                        var keyName = prop.Name;
                        var keyValue = prop.GetValue(dto);

                        if (keyValue == null) continue;

                        var parameter = Expression.Parameter(typeof(TEntity), "e");
                        var left = Expression.Call(
                            typeof(EF),
                            nameof(EF.Property),
                            new[] { typeof(object) },
                            parameter,
                            Expression.Constant(keyName)
                        );
                        var right = Expression.Constant(keyValue);
                        var equal = Expression.Equal(left, right);
                        var lambda = Expression.Lambda<Func<TEntity, bool>>(equal, parameter);

                        query = query.Where(lambda);
                    }

                    if (await query.AnyAsync())
                    {
                        throw new InvalidOperationException("Mã đã tồn tại! Vui lòng nhập mã khác!");
                    }
                }

                var entityResult = await _dbContext.Set<TEntity>().AddAsync(entity);
                await _dbContext.SaveChangesAsync();

                var dtoResult = _mapper.Map<TDto>(entityResult.Entity);
                return dtoResult;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public virtual async Task Delete(object code)
        {
            try
            {
                var entity = _dbContext.Set<TEntity>().Find(code);
                if (entity == null)
                {
                    Status = false;
                    MessageObject.Code = "0000";
                    return;
                }
                _dbContext.Entry<TEntity>(entity).State = EntityState.Deleted;
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

        /// <summary>
        /// Chú ý khi sử dụng phương thức Update Generic. Nó sẽ update toàn bộ thuộc tính của TEntity
        /// Để chỉ update các thuộc tính trong DTO cần overide lại hàm này
        /// Ví dụ
        /// var saleOrderInDB = await _dbContext.TblStoreOrderOperating.FindAsync(saleOrder.Id); --> lấy entity để tracker
        /// _mapper.Map(saleOrder, saleOrderInDB); --> Dòng code này sẽ cập nhật dữ liệu từ DTO --> entity đang được tracker
        /// await _dbContext.SaveChangesAsync();
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public virtual async Task Update(IDto dto)
        {
            try
            {
                var keyField = GenericService<TEntity, TDto>.GetKeyField(dto);
                if (keyField == null)
                {
                    Status = false;
                    MessageObject.Code = "0002";
                    return;
                }
                var keyValue = GenericService<TEntity, TDto>.GetValueOfKeyField(dto, keyField);
                var entityInDB = await _dbContext.Set<TEntity>().FindAsync(keyValue);
                if (entityInDB == null)
                {
                    Status = false;
                    MessageObject.Code = "0003";
                    return;
                }
                _mapper.Map(dto, entityInDB);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

        public virtual async Task UpdateWithListInside(IDto dto, TEntity entity)
        {
            try
            {
                await _dbContext.Database.BeginTransactionAsync();
                var keyField = GenericService<TEntity, TDto>.GetKeyField(dto);
                if (keyField == null)
                {
                    Status = false;
                    MessageObject.Code = "0002";
                    return;
                }
                var keyValue = GenericService<TEntity, TDto>.GetValueOfKeyField(dto, keyField);

                foreach (var property in typeof(TEntity).GetProperties())
                {
                    if (typeof(System.Collections.IEnumerable).IsAssignableFrom(property.PropertyType) && property.PropertyType.IsGenericType
                        && property.PropertyType.GetGenericTypeDefinition() == typeof(List<>))
                    {
                        var type = property.PropertyType.GetGenericArguments().FirstOrDefault();
                        var deleteData = property.GetValue(entity);
                        if (deleteData != null)
                        {
                            var setMethod = typeof(DbContext).GetMethods()
                                .FirstOrDefault(m => m.Name == "Set" && m.IsGenericMethodDefinition && m.GetParameters().Length == 0);

                            if (setMethod != null)
                            {
                                var genericSetMethod = setMethod.MakeGenericMethod(type);
                                var dbSet = genericSetMethod.Invoke(_dbContext, null);

                                var removeRangeMethod = dbSet.GetType()
                                    .GetMethod("RemoveRange", [typeof(IEnumerable<object>)]) ?? dbSet.GetType()
                                                                                                .GetMethod("RemoveRange", [typeof(IEnumerable<>)
                                                                                                .MakeGenericType(type)]);
                                removeRangeMethod?.Invoke(dbSet, [deleteData]);
                            }
                        }
                    }
                }

                _mapper.Map(dto, entity);
                await _dbContext.SaveChangesAsync();
                await _dbContext.Database.CommitTransactionAsync();
            }
            catch (Exception ex)
            {
                await _dbContext.Database.RollbackTransactionAsync();
                Status = false;
                Exception = ex;
            }
        }

        public virtual async Task<PagedResponseDto> Paging(IQueryable<TEntity> query, BaseFilter filter)
        {
            try
            {
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }

                if (filter.Fields != null && filter.Fields.Count != 0)
                {
                    query = query.SelectFields(filter.Fields);
                }

                if (!string.IsNullOrEmpty(filter.SortColumn))
                {
                    query = query.SortByColumn(filter.SortColumn, filter.IsDescending);
                }

                var pagedResponseDto = new PagedResponseDto
                {
                    TotalRecord = await query.CountAsync(),
                    CurrentPage = filter.CurrentPage,
                    PageSize = filter.PageSize
                };
                pagedResponseDto.TotalPage = Convert.ToInt32(Math.Ceiling((double)pagedResponseDto.TotalRecord / (double)pagedResponseDto.PageSize));
                var result = query.Skip((filter.CurrentPage - 1) * filter.PageSize).Take(filter.PageSize).ToList();
                pagedResponseDto.Data = _mapper.Map<List<TDto>>(result);
                return pagedResponseDto;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public virtual async Task<List<TDto>> GetAllMd(IQueryable<TEntity> query, BaseMdFilter filter)
        {
            try
            {
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }

                if (filter.Fields != null && filter.Fields.Count != 0)
                {
                    query = query.SelectFields(filter.Fields);
                }

                if (!string.IsNullOrEmpty(filter.SortColumn))
                {
                    query = query.SortByColumn(filter.SortColumn, filter.IsDescending);
                }

                var lstEntity = await query.ToListAsync();
                return _mapper.Map<List<TDto>>(lstEntity);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
    }

}
